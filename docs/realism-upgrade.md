# Reference-based detail upgrade

Intent: recognizable present-day Mihintale, detailed Buddha, staircases and ruins. Preserve source positions and 1:1 terrain; improve geometry from photographs. Publicly available photographs are references, not survey geometry. No exact digital-twin claim.

Implementation: one references/mihintale folder for downloaded photos, licence metadata, map extracts and a reference contact sheet; procedural sculpted Buddha mesh with face, fingers, robe folds, crossed legs and lotus pedestal; instanced granite stair treads along actual OSM steps; ruin foundations/walls along actual footprints and interpretive pillar arrays only for identified halls; selectable sourced ruin landmarks; photo reference panel and explicit model status. Use a reproducible Three.js geometry pipeline, with GLB export/import support for Blender refinement. Blender was not found on PATH or in its standard install directory. A generic downloaded Buddha would misrepresent this site, so it is not a substitute.

Checks: stair placement/orientation and source positions, geometry bounds, TypeScript/build, browser interaction and close-up screenshot inspection. Known limits: 30 m DSM, no measured tread counts, no verified individual pillar inventory, no matched photogrammetry photo set.
