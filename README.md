# Mihintale 3D Explorer — මිහින්තලය

A bilingual, full-screen React + TypeScript explorer of the Mihintale sacred hill, with a miniature Three.js scene, source-linked landmark information and a guided camera tour. No login, database, paid service or runtime public-map requests.

## Run

Node 22.12 or newer is required; Node 24 LTS is recommended.

    npm install
    npm run dev

Open the URL printed by Vite (normally http://127.0.0.1:5173). For production:

    npm run build
    npm run preview

Deploy the generated dist folder to a static host. The app uses relative asset URLs and hash-based landmark links, so a server-side route rewrite is not needed. A resolved package-lock.json is included; use npm ci for repeatable installation. See docs/validation.md for executed checks.

## Geography

Read [the accuracy report](docs/accuracy.md) before presenting this as a geographic reconstruction. The delivered scene includes a downloaded OSM extract (707 objects, 45 rendered features) and a complete Copernicus GLO-30 tile (nominal 30 m DSM). Landmark anchors are derived from the extract; all landmark meshes remain approximate. Without an imported DEM it explicitly says **Illustrative preview — geographic data pending**. It never treats decorative preview terrain as real elevations.

    npm run data:fetch
    npm run data:prepare
    npm run data:landmarks

For already downloaded files:

    npm run data:prepare -- --dem imports/mihintale.tif --geojson imports/mihintale.geojson

See [data preparation and provenance requirements](docs/data-preparation.md). Downloads occur during preparation, not on every visit. No API key or .env file is needed for the selected anonymous providers. Private credentials must never go into a VITE_ environment variable.

## Controls

- Drag to rotate; scroll/pinch to zoom; right-drag or two fingers to pan.
- Select a floating marker or a landmark from the keyboard-accessible list. The information panel becomes a bottom sheet on mobile.
- Explore ends the tour. Guided tour starts it. Pause/resume, next/previous and end-tour controls are available. Manual orbit/pan/zoom pauses the tour; changing tabs also pauses it.
- Overview moves to a north-up overhead view. Reset view returns to the initial perspective. Rotate/zoom buttons provide keyboard alternatives.
- EN / සිං switches English and Sinhala. Labels and available mapped paths can be toggled. Unavailable map layers are disabled with an explanation.
- Landmark selection updates #landmark=... and survives reload. Copy link uses the clipboard when available; otherwise the address bar contains the shareable URL.
- The mini-map shows sourced landmark positions and camera bearing. The guided tour is a camera sequence, not a verified walking route.
- Reduced-motion preferences make camera transitions immediate and disable decorative CSS motion. Without WebGL, the landmark list, sources and map remain usable.

## Checks

    npm test
    npm run build
    npx playwright install chromium
    npm run test:e2e

The dependency-free Node tests exercise coordinate control points, axis orientation, raster sampling, missing samples, terrain alignment, tour state, URLs and offline import behavior. Browser tests target desktop/mobile layouts, language switching, landmark selection, tour interruption and missing-data/WebGL fallback. [Validation record](docs/validation.md) distinguishes executed checks from checks blocked by this environment.

## Structure

    src/scene/        Terrain, mapped features, vegetation, landmark models and markers
    src/controls/     Camera rig and tour state
    src/ui/           Accessible panels, mini-map, dialogs and icons
    src/geo/          WGS84/UTM transforms, height sampling, validation and scene placement
    src/data/         Bilingual landmark records, translations and types
    scripts/          Cached download, offline import and preparation commands
    data/raw/         Original downloads, source metadata and failed-attempt records
    data/reference/   OSM-derived landmark coordinates and derivation records
    data/processed/   GeoJSON and preparation statistics
    public/data/      Local runtime scene asset
    tests/            Node checks and Playwright browser tests
    docs/             Accuracy, sources, pipeline and validation records

The 3D renderer and landmark model module load lazily. Trees share instanced geometry; mobile DPR and shadows are limited. Custom terrain/feature geometry is explicitly disposed, and R3F disposes component-owned geometry/materials on unmount.

[Sources and asset attribution](docs/sources.md). The attached reference video was not available to the execution tools in this session; no geometry was extracted from it.

## Reference-based detail upgrade

The explorer now includes 11 named places, a photo-informed Buddha GLB, individual stone stair blocks, and mapped hall ruins with masonry/pillars. Open [the local reference gallery](references/mihintale/index.html) for the licensed photographs, map files and editable model in one folder. The [model workflow](docs/model-workflow.md) explains rebuilding and Blender refinement. This remains an approximation; no exact scan or complete reconstruction of every Mihintale site is claimed.
