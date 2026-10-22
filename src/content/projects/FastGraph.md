---
title: "FastGraph"
category: "research"
description: "Accelerating graph construction for geometric deep learning. I developed PCA-based search and specialized CUDA kernels, with up to 41× speedups over exact FAISS-GPU on the evaluated CMS HGCAL workload."
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

### Five Million Points. 7.5 Seconds.

FastGraph builds nearest-neighbor graphs on the GPU: for each point, it finds the closest points to connect. These graphs power geometric deep learning models used to understand irregular data, including particle-detector measurements.

On the evaluated CMS HGCAL detector-derived workload, FastGraph built a graph over **5 million points in 7.5 seconds**, compared with **310 seconds for exact FAISS-GPU**—a reported **41× speedup** on a single NVIDIA A100.

### My Role

I developed the **PCA-based search extension**, rewrote and optimized selected **CUDA kernels**, and **rewrote the paper from the ground up as first author**. This work builds on Jan Kieseler’s original kernels and early manuscript.

- **GPU performance engineering.** Specialized binning kernels for 2–5 dimensions at compile time, enabling fixed-size storage and loop unrolling while supporting inputs with more features.
- **Algorithm development.** Used PCA to organize the search around the data’s geometry, reducing candidate checks while computing neighbor distances in the original feature space.
- **Framework integration.** Worked on C++ operator registration, autograd, and TorchScript support for the axis-aligned path, with changes [merged upstream](https://github.com/jkiesele/FastGraphCompute/commit/e159744371356426903b99c57a29cbae6f80de3d).
- **Research communication.** Rebuilt the manuscript’s method explanation, exactness argument, experimental analysis, and discussion of tradeoffs.

### The Bottleneck

Models such as GravNet rebuild their graphs during each forward pass. A brute-force search compares every point with every other point; as the dataset grows, graph construction becomes expensive.

Spatial bins can narrow the search, but their usefulness depends on how well they match the data. Binning directly along a few input coordinates can leave too many candidates to check. I developed the PCA extension to align the search space with the data’s structure.

### The Engineering

**Search in a compact space. Measure in the original space.** FastGraph projects points into a small PCA subspace, groups them into bins, and searches outward from each point. The evaluated HGCAL configuration uses three binning dimensions for eight-dimensional inputs.

The key challenge is skipping work without losing a closer neighbor. An orthonormal projection cannot increase distance, so projected bins provide a lower bound on the distance to unvisited points. Once that bound exceeds the farthest selected neighbor’s distance, the search can stop. Candidate distances are still evaluated using every original feature.

This separates the size of the search index from the input dimension. Compile-time CUDA specialization makes the small set of binning configurations efficient, while the pruning rule preserves exact neighbors in exact arithmetic. Floating-point behavior was checked against brute-force references across multiple dimensions and neighborhood sizes.

### Performance

The headline experiment uses **5 million points, 8 features, and 40 neighbors per point** on one **NVIDIA A100 80 GB**.

| Exact method | Graph construction time |
| --- | ---: |
| **FastGraph with PCA** | **7.5 s** |
| cuVS brute force | 146 s |
| FAISS-GPU IndexFlatL2 | 310 s |

Timings include PCA, projection, bin construction, and search with data already on the GPU. The speedup measures graph construction; data transfer and downstream training are outside the timed region.

Across the evaluated 2–10-dimensional HGCAL workloads, FastGraph reports a **10.4× geometric-mean speedup over FAISS-GPU**.

![Graph construction times across 2–10 input dimensions for 5 million HGCAL-derived points and 40 neighbors.](/generated/fastgraph/dimensional-scaling.png "Results from the PCA manuscript. Lower is better; the time axis is logarithmic. GGNN and CAGRA are approximate methods.")

### Engineering Tradeoffs

The gain depends on the data’s geometry. PCA helps when a compact subspace makes pruning effective; on isotropic data, optimized brute force can be faster. Fitting and projecting also adds overhead, which matters more for small graphs.

The central engineering decision was to combine a data-adaptive search algorithm with specialized GPU kernels. The result demonstrates work across **algorithm design, CUDA optimization, PyTorch integration, and performance evaluation**.

[Read the PCA manuscript](https://github.com/AgarwalAarush/fastgraph-paper/blob/869f9d41277c75000f51e968ac5abe655a20b9d7/Paper.pdf) · [Explore the implementation](https://github.com/AgarwalAarush/FastGraphCompute)
