---
title: "FastGraph"
category: "research"
description: "Exact GPU k-nearest-neighbor graph construction with PCA-subspace pruning. My work spans CUDA kernel specialization, the PCA enhancement, and the paper: up to 41× faster than FAISS-GPU on the evaluated 5M-point, 8D HGCAL-derived workload."
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

**About 7.5 seconds instead of 310 seconds** to construct a kNN graph over 5 million detector-derived points, with 8 input features and 40 neighbors, on one NVIDIA A100 80 GB PCIe GPU. The manuscript reports **41.23×** speedup over exact FAISS-GPU `IndexFlatL2` for this workload.

This measures graph construction with inputs already on the GPU. It includes PCA estimation, projection, binning, and search; it is not a training-throughput or end-to-end application speedup.

### My Contribution

Jan Kieseler wrote the initial kernels and an early manuscript draft. I built on that foundation: **rewrote selected kernels for compile-time specialization, made targeted kernel optimizations, developed the PCA-subspace enhancement, and rewrote the entire paper from the ground up.** I am the paper’s first author; the original library and the broader research effort are collaborative work.

| Area | My work |
| --- | --- |
| CUDA implementation | Reworked selected kernels around static specialization and made targeted performance improvements. The evaluated binning kernels specialize on 2–5 bin dimensions, separately from the full input dimensionality. |
| PyTorch integration | Worked on C++ operator registration, autograd plumbing, and TorchScript compatibility for the axis-aligned path. The upstream [PyTorch compatibility merge](https://github.com/jkiesele/FastGraphCompute/commit/e159744371356426903b99c57a29cbae6f80de3d) records this work. |
| PCA enhancement | Developed a data-adaptive binning space that prunes candidates using a compact orthonormal projection while retaining full-dimensional distance evaluation. See the [PCA implementation](https://github.com/AgarwalAarush/FastGraphCompute/blob/ad4392eee16734a1001e82764a13144379d931e9/fastgraphcompute/extensions/binned_select_knn.py). |
| Paper | Wrote the manuscript anew after Jan’s initial draft, explaining the method, exactness argument, experiments, and limitations. |

The [original library](https://github.com/jkiesele/FastGraphCompute), [my fork](https://github.com/AgarwalAarush/FastGraphCompute), and [manuscript history](https://github.com/AgarwalAarush/fastgraph-paper/commits/main/) provide complementary views of the work. The later PCA manuscript and release extend the [November 2025 arXiv version](https://arxiv.org/abs/2511.10442); its older benchmark claims should not be substituted for the PCA results here.

### The Problem

Dynamic graph networks such as GravNet rebuild neighborhoods from point features during a forward pass. Exact brute-force kNN evaluates every candidate pair, which becomes expensive as point counts grow. Spatial binning can eliminate much of that work, but its effectiveness depends on the geometry of the input.

The existing axis-aligned approach bins a few input coordinates. My PCA enhancement changes **which coordinate subspace organizes the search**. The final neighbors are still selected using the original features and distance metric.

### How It Works

1. **Choose the binning space.** Sample up to 50,000 points and estimate a small orthonormal PCA basis on the GPU. The HGCAL configuration uses three binning dimensions. If the input already has at most that many dimensions, skip PCA.
2. **Build a compact grid.** Project points into that space, assign bins, and sort by bin index. Row splits keep separate graphs from sharing neighbors.
3. **Search expanding shells.** For each point, traverse nearby bins and maintain the best neighbors. Evaluate every candidate’s squared distance in the full input space.
4. **Stop with a bound.** Once the lower bound for every unvisited bin exceeds the current farthest selected neighbor’s distance, stop searching.

Compile-time specialization keeps the small set of binning dimensions explicit to the compiler, enabling fixed-size storage and loop unrolling. Increasing bin dimensions also increases the grid and traversal cost, so using every input dimension for binning would defeat the purpose.

### Why PCA Preserves Exactness

An orthonormal projection cannot increase Euclidean distance:

`distance(project(x), project(y)) ≤ distance(x, y)`

Consequently, a lower bound on distance to an unvisited projected bin is also a valid lower bound in the original space. If that bound is already larger than the current K-th neighbor distance, none of its points can improve the answer. Keeping full-dimensional candidate distances **and** using this conservative stopping rule preserves exact neighbors in exact arithmetic.

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

| Method | Graph construction time, rounded | Reported speedup of FastGraph |
| --- | ---: | ---: |
| FastGraph with PCA | 7.5 s | 1× |
| FAISS-GPU IndexFlatL2, exact | 310 s | 41.23× |
| cuVS brute force, exact | 146 s | 19.41× |

Ratios use the underlying medians, not the rounded times displayed above. Across the HGCAL dimension sweep from 2 to 10 at 5 million points and 40 neighbors, the reported geometric-mean speedup is 10.4× over FAISS-GPU.

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

**Reproduction boundary:** this is a small correctness check, not a reproduction of the 41× timing. The [manuscript’s reproduction guide](https://github.com/AgarwalAarush/fastgraph-paper/blob/869f9d41277c75000f51e968ac5abe655a20b9d7/REPRODUCIBILITY.md) identifies the canonical timing CSVs and plotting scripts, but their separate benchmark repository currently requires access. The HGCAL input also requires approved CMS access. The public paper, figure, and library are available for inspection; a complete public rerun of the headline experiment is not currently available.

### Limitations and Lessons

- **Distribution matters.** On isotropic Gaussian data at 1 million points and 40 neighbors, FastGraph is only 0.8× as fast as cuVS brute force at seven dimensions. PCA has no preferred anisotropic structure to exploit there. CLOVER is also substantially faster on the three-dimensional HGCAL comparison.
- **The 41× result is a kernel-workload result.** The detector-derived rows are concatenated into one segment. This is not an event-batched GNN training run, and it does not establish a model-quality improvement.
- **Feature scale matters.** The benchmark artifact does not identify column names, units, or preprocessing. Adding columns changes feature identity as well as dimension, so the sweep does not isolate dimensionality alone. PCA is sensitive to feature scaling.
- **PCA has a cost.** Its fit and projection may be unattractive for small graphs. The three-dimensional binning default is tuned to the evaluated workload and should be revalidated elsewhere.
- **Integration has boundaries.** The implementation targets one GPU. The PCA wrapper uses eager mode; the axis-aligned path supports TorchScript. Atomic gradient accumulation is not guaranteed to be bitwise deterministic.

The central lesson was to separate the **space used to organize a search** from the **space used to measure distance**. A compact, data-adaptive index can make an exact search much cheaper when its pruning bounds remain valid—and the benchmark needs to show where that advantage ends.
