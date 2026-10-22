# FastGraph diagram review

Two discrete, user-controlled teaching figures; there is no autoplay or continuous motion. Read in page order: PCA, then binstepper/stopping bound. Review states 0, 1 and 2 are complete algorithm snapshots, not measured execution time.

## Source review

Pinned library revision: ad4392eee16734a1001e82764a13144379d931e9.

- `binned_select_knn.py`: `_compute_pca_projection` selects orthonormal PCA columns; the wrapper builds `bin_coords` while passing original `coords` to the search. The teaching diagram explicitly labels its 2D-to-1D simplification; the implementation uses at least two bin dimensions.
- `binstepper.h`: `set_d` and `step` enumerate the cube surface and reject invalid global indices. The illustration shows entire completed shells, not within-shell ordering or parallel GPU scheduling.
- `binned_select_knn_cuda_kernel.cu`: stop only when the neighbor set is full and `(bin_width * distance)^2 > maxdistsq`. Slot zero is self. The example uses K=4 including self and the same conservative bound, not the tighter query-to-cell-boundary distance.

## Numerical checks

`scripts/check-fastgraph-diagrams.mjs` verifies PCA covariance, all-pairs contraction, shell membership and non-overlap, non-premature stopping, and agreement of the final neighbors with brute force. Values are illustrative and do not imply benchmark performance.

## Render review, round 1

Inspected original-coordinate, projected-coordinate, and shell scenes at all steps in light/dark raster previews. Found the PCA query label adjacent to a point and unlabeled radius/bound rings. Moved the query label and added explicit ring legend keys. Added a hollow marker at the projection of p. No animated paths or swept collisions apply.

## Presentation constraints

Native SVG text uses Arial/Helvetica to match the existing page's system sans. HTML controls and captions reflow; panels stack below 560px. Page theme is inherited from the parent root; a standalone embed follows system appearance. Native buttons provide keyboard activation, focus rings, pressed state, and a polite live description. Figures show the final useful poster on first load and without JavaScript.

## Final local review

- Reviewed all three discrete states in both palettes as native 360px panels, plus the harness 720px and 534px contact views. The final query label is clear of the points. Projection foot, grid shells, retained radius, and stopping bound preserve their identities and mathematical meaning.
- The generic harness assumes a wide frame. Its first render failed when given a two-row composite; the adapter now exports a horizontal review strip. This adapter change does not change the live panels, which reflow in CSS.
- Build, emitted-script syntax, numerical checks, shipped button handlers, repeated state selection, inherited theme logic, HTTP endpoints, and page embed placement passed. The existing removed headline is absent from the served page.
- Browser verification is incomplete: Dia repeatedly returned to the user's active window and rejected subsequent actions as a user-driven state change. No alternate browser was launched. Mobile reflow, focus styling, actual iframe sizing, and inherited theme appearance are implemented and code-inspected, but are not claimed as visually verified in Dia.
- The render harness approves the authored SVG scenes only. It does not establish browser layout acceptance or publication.

Regenerate HTML/posters with `node scripts/build-fastgraph-diagrams.mjs`; validate with `node scripts/check-fastgraph-diagrams.mjs`. The page embeds the generated HTML through `/api/fastgraph-diagram?kind=pca` and `?kind=binstepper`. SVG posters live in `public/generated/fastgraph/`.
