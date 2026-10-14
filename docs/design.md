# Mihintale 3D Explorer — Design

Build an educational present-day site explorer for Sri Lankan visitors, students and tourists. The user brief is the implementation authority. Empty workspace: standalone Vite + React + TypeScript + R3F/Drei, static hosting, no account or runtime map requests.

Geography: compact sacred hill extent, not town; source-backed point coordinates are distinct from downloaded map geometry. Terrain and feature ingestion use EPSG:32644, a fixed geographic origin, x east/y up/z south, heights in metres without exaggeration. Keep raw inputs and provenance; fail clearly on unsupported rasters. Never imply illustrative terrain is surveyed.

UI: full-screen green/granite miniature, dark translucent panels, gold selection, English/Sinhala, landmark list and info sheet, orbit/pan/zoom, camera focus and overview, tour state controls with manual interruption, north-up mini-map and camera bearing, URL selection. No fabricated walking route.

Fallback: persistent illustrative-preview badge whenever DEM is absent. Without WebGL the landmark list, descriptions and map remain usable. Unlocated candidates stay in the list without scene positions.

Validation: geographic control points, raster orientation/NoData, terrain sampling, tour reducer, URL parsing, production build and desktop/mobile browser checks where execution is available. Document actual failures honestly.
