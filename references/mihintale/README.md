# Mihintale reference and modeling library

Open index.html for the local photograph gallery. This folder contains 11 usable unmodified licensed photographs, plus one excluded photograph whose title did not match useful rock imagery. photos.json records author, source, licence, capture date, retrieval time, size and SHA-256. commons-*.json preserves the original metadata. The photographs span different years; they are not a synchronized survey and cannot reconstruct unseen geometry by themselves.

maps/ holds the actual cached OSM export, Copernicus GeoTIFF, their source sidecars, processed GeoJSON, and landmark anchors. Coordinates, sources, shared origin and licences are documented in ../../docs/sources.md and ../../docs/data-preparation.md. OSM: © OpenStreetMap contributors, ODbL 1.0. Copernicus notices in ../../docs/sources.md apply to the copied raster.

models/mihintale-buddha.glb is an editable photo-informed mesh generated for this project. The runtime copy is public/models/mihintale-buddha.glb. It is not a scan or a surveyed asset. Run npm run models:build to regenerate it, and npm run references:index to refresh this collection. Do not regenerate over a hand-edited Blender replacement without backing it up.

Blender was not installed on PATH or in its standard Windows directory. The GLB was created with Three.js and can be imported into a 3D editor for sculpting. No Blender execution or photogrammetry reconstruction is claimed. A search for a matching downloadable Mihintale scan did not identify a verified usable asset; unrelated Buddha models were not substituted.

The hospital photo is an outlying-site reference; the hospital is outside the current terrain box and has not been inserted at an arbitrary location. The Lion Bath and Kantaka fresco photographs are supporting references, not complete modeled reconstructions. The staircase photos establish material/appearance; their exact individual flights are not geolocated.

For an exact reconstruction, the missing inputs are a licensed overlapping multi-view capture of each structure, measured scale/control points, a detailed bare-earth surface model, and archaeological/site plans identifying the surviving walls, stairs and columns. Internet photographs alone do not provide those measurements.
