# FastGraph animation review

Two 14-second explanatory animations share deterministic scene data, geometry and timing with their static SVG posters. The browser changes stable SVG objects in place. No slide navigation remains.

## Sources and scope

Pinned library revision: ad4392eee16734a1001e82764a13144379d931e9. Source links are recorded in scene.mjs.

- PCA uses orthonormal columns for bin coordinates; original coordinates still determine neighbor distances. The 2D-to-1D teaching example is labeled explicitly; production uses at least two bin dimensions and the reported benchmark uses eight input and three bin dimensions.
- Binstepper visits successive Chebyshev shell boundaries, with x outer/y inner traversal in the 2D illustration. Already inspected inner bins are not revisited. Only one query is shown; concurrent GPU queries and timing are not represented.
- The stop requires K filled and the conservative shell-distance bound greater than the farthest retained distance. K=4 includes self. Final neighbors match brute force.

## Motion and presentation

PCA reveals the principal axis, projects copies while preserving the original cloud, transfers those copies into bins, and then compares projected/full distances. Binstepper inspects each boundary cell, updates the retained set, and reveals the stopping comparison after completing the second shell. Final states hold before fading out; the loop resets while invisible, without reversing algorithm execution.

Barlow Condensed headings, JetBrains Mono annotations and numerical comparisons create distinct typographic roles. Supporting copy and point labels share a Helvetica sans-serif stack; both comparisons use 24px monospace with matching explanatory labels. Warm neutral canvases use rust for the query/search and green for projection/retained neighbors. One native Play/Pause button preserves manual pause. Offscreen/hidden animations suspend; reduced motion and printing show the final poster. Parent theme is inherited. Narrow diagrams stack their geometry.

## Review and repairs

Rendered 26 moments per scene across light/dark and 320/720px native geometry: 208 frames, including motion starts, midpoints, completed states, final hold and fade/reset. Inspected contact sheets and full-size posters. Increased narrow binstepper height to prevent the stopping explanation clipping. Found an x-axis label crossing moving PCA points and hide that label during transfer, then restore it. Re-rendered the repaired timeline.

Dia desktop review confirmed actual fonts, standalone dark PCA, embedded light PCA and binstepper, automatic progression, iframe sizing, and PCA pause/resume. The binstepper was observed at its initial and completed stopping states. Mobile geometry was reviewed through native SVG renders; full mobile-browser layout and OS reduced-motion toggling were not exercised.

## Checks

`node scripts/check-fastgraph-diagrams.mjs` verifies PCA covariance and all-pairs contraction, shell membership/non-overlap, every partial search state against visited-point brute force, non-premature stopping, final brute-force neighbors, animation targets and opacity ranges across sampled frames, pause/resume, visibility, reduced motion, looping, and emitted JavaScript syntax. Production build is checked separately.

Regenerate HTML and SVG posters with `node scripts/build-fastgraph-diagrams.mjs`. HTML is served through `/api/fastgraph-diagram?kind=pca` and `?kind=binstepper`. This is a local author review, not independent scientific validation or deployment acceptance.

## Typography refinement

Replaced serif point labels and numerical values with coordinated sans-serif labels and monospace values. Both final inequalities use the same size, tracking and color, with 12px explanatory labels underneath. Supporting HTML copy now uses the same sans-serif stack as SVG labels, with adjusted sizing and line height. Reviewed final frames at 320px and 720px; increased the narrow PCA canvas to fit its explanatory label. Animation logic is unchanged.

## Embedded scrollbar correction

Embedded documents now hide their internal overflow while the existing ResizeObserver grows the iframe to its content height. Standalone diagrams retain normal page scrolling. Dia local review confirmed a clean right edge with the complete footer visible.
