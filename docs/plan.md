# Mihintale implementation plan

Goal: implement the user-authorized static explorer and repeatable geographic preparation pipeline.

1. Research candidate locations, source licenses and package documentation. Record bounds and source limitations.
2. Write coordinate, raster and tour behavior tests; run failing checks, implement utilities and rerun.
3. Implement cached OSM/GeoTIFF ingestion, GeoJSON export and EPSG:32644 height sampling. Support offline imports and provenance sidecars.
4. Implement lazy 3D scene, recognizable approximate models, deterministic constrained vegetation, controls and camera limits.
5. Implement accessible bilingual UI, info sheet, overview map, shareable selection, tour controls and non-WebGL/missing-data fallbacks.
6. Install pinned compatible dependencies, generate npm lockfile, run TypeScript/build/tests and inspect desktop/mobile rendering if supported.
7. Audit sources and report missing input, validation limits and run commands.

Review focus: missing/malformed inputs; non-finite elevation and vertical units; camera interruption and terrain collision; invalid hash and language persistence; mobile overlays and keyboard controls.
