# Model workflow

The Buddha now uses a local GLB loaded through Drei useGLTF. No model service or runtime API key is required. The uncompressed binary is about 2.46 MB. The generator merges and indexes four material groups and uses smooth profiled surfaces, tapered limbs, facial features, elongated ears, curled hair, articulated fingers, crossed legs, robe folds and a lotus seat. Its primary close-up reference is Ranabolt's public-domain photograph in references/mihintale/photos. Proportions, back geometry and azimuth remain artistic interpretation.

    npm run models:build
    npm run references:index
    npm run build

For manual refinement, import public/models/mihintale-buddha.glb into Blender using its glTF importer, keep the model at metre scale and its base at local origin, refine against the licensed references, and export a GLB to that same path. Preserve glTF Y-up, with the face toward +Z before the app's placement rotation. Keep the file self-contained. The app currently uses an uncompressed GLB without external Draco/Meshopt decoder downloads. Back up hand-authored changes: models:build overwrites its output. No .blend file is claimed in this delivery because Blender was unavailable.

The statue's geographic anchor stays in src/data/mapped-positions.ts; do not encode latitude/longitude into the model. src/scene/BuddhaAsset.tsx handles the local asset. Model accuracy text lives in src/data/landmarks.ts.

Mapped stair treads and ruin blocks are built by src/geo/detail-layout.ts, then instanced in MappedDetails.tsx. Steps use OSM line geometry and sampled terrain; tread count, widths without tags and weathering remain interpreted. Blocks have joints and rounded edges. Ruin perimeter courses follow OSM footprints. Pillars are restricted to identified hall footprints; their spacing/heights are not a measured inventory. No roofs are reconstructed. These details must not be used as archaeological measurements.

The coarse DSM cannot supply flat archaeological terraces, narrow rock cliffs or precise stair gradients. Source terrain is preserved; it has not been quietly replaced by invented survey surfaces. Ground grain and broadleaf crowns are procedural visual styling, not aerial textures or a vegetation inventory.

Loader documentation checked: https://drei.docs.pmnd.rs/loaders/gltf-use-gltf. Blender glTF documentation URL: https://docs.blender.org/manual/en/latest/addons/import_export/scene_gltf2.html (retrieval blocked in this environment; Blender workflow not executed).
