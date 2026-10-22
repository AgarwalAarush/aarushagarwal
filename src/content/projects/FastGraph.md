---
title: "FastGraph"
category: "research"
description: "Exact GPU k-nearest-neighbor graphs with CUDA specialization and PCA-based pruning. Up to 41× faster than exact FAISS-GPU on the evaluated 5M-point, 8D HGCAL-derived workload."
paper: "https://github.com/AgarwalAarush/fastgraph-paper/blob/869f9d41277c75000f51e968ac5abe655a20b9d7/Paper.pdf"
github: "https://github.com/AgarwalAarush/FastGraphCompute"
upstream: "https://github.com/jkiesele/FastGraphCompute"
technologies:
  - C++
  - CUDA
  - PyTorch
  - PCA
  - Exact kNN
  - Geometric Deep Learning
---

### The Result

**7.5 seconds versus 310 seconds** to build a kNN graph over 5 million detector-derived points: 8 features, 40 neighbors, one NVIDIA A100 80 GB PCIe GPU. The manuscript reports a **41.23× speedup** over exact FAISS-GPU `IndexFlatL2` on this workload.

Timing covers PCA estimation, projection, binning, and search, with inputs already on the GPU. Data transfer and downstream training are excluded.

### My Contribution

I developed the PCA extension, specialized CUDA kernels, and rewrote the paper as first author, building on Jan Kieseler’s original kernels and early manuscript draft.

- **CUDA kernels.** Rewrote selected kernels for compile-time specialization and optimized their performance. The binning kernels specialize on 2–5 dimensions, independently of the full input dimension.
- **PCA pruning.** Developed a compact, data-adaptive search space that reduces candidate checks while keeping distance calculations in the original space. [Implementation](https://github.com/AgarwalAarush/FastGraphCompute/blob/ad4392eee16734a1001e82764a13144379d931e9/fastgraphcompute/extensions/binned_select_knn.py).
- **PyTorch integration.** Worked on C++ operator registration, autograd, and TorchScript support for the axis-aligned path. [Upstream merge](https://github.com/jkiesele/FastGraphCompute/commit/e159744371356426903b99c57a29cbae6f80de3d).
- **Paper.** Rewrote the manuscript from the ground up: the method, exactness argument, experiments, and limitations. [Manuscript history](https://github.com/AgarwalAarush/fastgraph-paper/commits/main/).

The results below come from the later PCA manuscript and release, which extend the [November 2025 arXiv paper](https://arxiv.org/abs/2511.10442).

### The Problem

Dynamic graph networks such as GravNet rebuild neighborhoods during each forward pass. Exact brute-force kNN checks every candidate pair, making large graphs expensive. Spatial binning skips distant candidates, but its effectiveness depends on the input geometry.

The original approach bins a few input coordinates. PCA instead chooses a **data-adaptive subspace for the search**, while selecting neighbors with the original features and distance metric.

### How It Works

1. **Choose the binning space.** Sample up to 50,000 points and estimate a small orthonormal PCA basis on the GPU. The HGCAL configuration uses three binning dimensions. If the input already has at most that many dimensions, skip PCA.
2. **Build a compact grid.** Project points into that space, assign bins, and sort by bin index. Row splits keep separate graphs from sharing neighbors.
3. **Search expanding shells.** For each point, traverse nearby bins and maintain the best neighbors. Evaluate every candidate’s squared distance in the full input space.
4. **Stop with a bound.** Once the lower bound for every unvisited bin exceeds the current farthest selected neighbor’s distance, stop searching.

Specializing on a small set of binning dimensions enables fixed-size storage and loop unrolling. More binning dimensions increase grid size and traversal cost; the index stays compact even when the input has more features.

### Why PCA Preserves Exactness

An orthonormal projection cannot increase Euclidean distance:

`distance(project(x), project(y)) ≤ distance(x, y)`

A distance lower bound for an unvisited projected bin therefore also holds in the original space. Once it exceeds the current K-th neighbor distance, that bin cannot improve the answer. This stopping rule, combined with **full-dimensional distance calculations**, preserves exact neighbors in exact arithmetic.

FP32 arithmetic needs separate validation. The manuscript reports PCA-path comparisons with an element-wise brute-force reference on seeded inputs with 4, 5, 8, and 10 dimensions, neighborhood sizes 16, 40, and 128, and up to 8,000 points. It checks valid, unique, segment-local indices and sorted distance multisets within stated tolerances. Those tests cover the exercised configurations; tied distances need not produce identical neighbor indices.

Autograd propagates through selected distances and input coordinates. Discrete neighbor indices and the fitted PCA basis remain fixed within each forward/backward pair.

### Benchmark and Scope

| Setting | Headline experiment |
| --- | --- |
| Input | First 5 million rows and first 8 stored columns of a CMS HGCAL simulation recHit feature matrix |
| Graph | One segment; 40 neighbors per point, including self |
| Binning | Three PCA dimensions; FP32 coordinates |
| Hardware | One NVIDIA A100 80 GB PCIe GPU |
| Software | CUDA 12.1, PyTorch 2.5; experimental artifacts tagged `pca-fgc-paper-v1.3.4` |
| Timing | Serialized GPU jobs; synchronization around the timed region; median of seven repetitions for FastGraph and the exact baselines |
| Included | PCA fit and projection, index/bin construction, and search |
| Excluded | Data loading and host-to-device transfer; downstream message passing and training |

| Method | Time (rounded) | FastGraph speedup |
| --- | ---: | ---: |
| FastGraph with PCA | 7.5 s | 1× |
| FAISS-GPU IndexFlatL2, exact | 310 s | 41.23× |
| cuVS brute force, exact | 146 s | 19.41× |

Speedups compare FastGraph with each baseline using unrounded medians. Across 2–10 dimensions at 5 million points and 40 neighbors, the reported geometric-mean speedup over FAISS-GPU is 10.4×.

![Graph construction times across 2–10 input dimensions for 5 million HGCAL-derived points and 40 neighbors. FastGraph is fastest among the tested exact baselines; approximate GGNN is faster at low dimensions.](/generated/fastgraph/dimensional-scaling.png "Figure from the PCA manuscript. Lower is better; the vertical axis is logarithmic. Approximate-backend timing is not a matched-recall comparison.")

Source: [PCA manuscript, experimental setup and results](https://github.com/AgarwalAarush/fastgraph-paper/blob/869f9d41277c75000f51e968ac5abe655a20b9d7/Paper.pdf). Approximate CAGRA and GGNN results are shown separately in the paper; their recall was not measured at the headline timing configurations.

### Try the Released Code

The PCA implementation is public. On a machine with an NVIDIA GPU, CUDA 12.1 development tools, a compatible C++ compiler, and Python development headers, install the pinned experimental source:

```bash
git clone https://github.com/AgarwalAarush/FastGraphCompute.git
cd FastGraphCompute
git checkout ad4392eee16734a1001e82764a13144379d931e9
python -m pip install torch==2.5.0 --index-url https://download.pytorch.org/whl/cu121
python -m pip install 'setuptools>=65' wheel cmake ninja
python -m pip install --no-build-isolation .
```

That commit is the library revision referenced by `pca-fgc-paper-v1.3.4`. A small synthetic check exercises the PCA path without CMS data:

```python
import torch
from fastgraphcompute import binned_select_knn_pca

torch.manual_seed(7)
x = torch.randn(2000, 8, device="cuda", dtype=torch.float32)
row_splits = torch.tensor([0, len(x)], device="cuda", dtype=torch.int64)
idx, dist2 = binned_select_knn_pca(
    K=40, coords=x, row_splits=row_splits, max_bin_dims=3
)

# Element-wise FP32 reference, including the query point itself.
reference = ((x[:, None] - x[None, :]) ** 2).sum(-1)
expected = reference.topk(40, largest=False).values
assert bool(((idx >= 0) & (idx < len(x))).all())
assert bool((idx.sort(dim=1).values.diff(dim=1) > 0).all())
torch.testing.assert_close(dist2, reference.gather(1, idx), atol=1e-6, rtol=1e-5)
torch.testing.assert_close(
    dist2.sort(dim=1).values, expected, atol=1e-6, rtol=1e-3
)
print("PCA kNN matches the brute-force distance reference.")
```

**What you can reproduce:** the code above checks correctness on synthetic data. Reproducing the 41× timing requires access to the separate benchmark repository and approved CMS access to the HGCAL input. The [reproduction guide](https://github.com/AgarwalAarush/fastgraph-paper/blob/869f9d41277c75000f51e968ac5abe655a20b9d7/REPRODUCIBILITY.md) identifies the timing CSVs and plotting scripts. The paper, figure, and library are public; a complete public rerun of the headline experiment is not yet available.

### Limitations and Lessons

- **Distribution matters.** On isotropic Gaussian data at 1 million points and 40 neighbors, FastGraph is only 0.8× as fast as cuVS brute force at seven dimensions. PCA has no preferred anisotropic structure to exploit there. CLOVER is also substantially faster on the three-dimensional HGCAL comparison.
- **The 41× result is a kernel-workload result.** The detector-derived rows are concatenated into one segment. This is not an event-batched GNN training run, and it does not establish a model-quality improvement.
- **Feature scale matters.** The benchmark artifact does not identify column names, units, or preprocessing. Adding columns changes feature identity as well as dimension, so the sweep does not isolate dimensionality alone. PCA is sensitive to feature scaling.
- **PCA has a cost.** Its fit and projection may be unattractive for small graphs. The three-dimensional binning default is tuned to the evaluated workload and should be revalidated elsewhere.
- **Integration has boundaries.** The implementation targets one GPU. The PCA wrapper uses eager mode; the axis-aligned path supports TorchScript. Atomic gradient accumulation is not guaranteed to be bitwise deterministic.

The key insight: **organize the search in a compact space; measure distance in the original space.** Valid pruning bounds preserve exactness. The benchmarks show when that separation pays off—and when it does not.
