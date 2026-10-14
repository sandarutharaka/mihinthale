# Accuracy report — 13 October 2026

This is a source-grounded interactive interpretation of the present-day sacred hill, not a measured digital twin. Mihintale town is west of the modeled complex. Coverage is 80.512–80.520 E, 8.348–8.354 N. Kaludiya Pokuna and more distant sites are outside this version.

## Obtained data

The cached OSM bounding-box export contains 707 objects. Preparation renders 45 features: 19 building/ruin footprints, 2 water polygons, 15 paths and 9 stairway segments. Two boundary-crossing parts are omitted conservatively. OSM retrieval: 2026-10-13; this does not establish when each object was last surveyed.

The complete Copernicus GLO-30 2021 tile was downloaded (47,178,963 bytes). Native resolution is 1 arc-second, nominal 30 m. It is a surface model (DSM), including vegetation/buildings, not bare-earth terrain. EGM2008 orthometric heights are metres. The display grid is 91 × 69 at 10 m spacing, elevations approximately 113.97–290.93 m, vertical exaggeration 1. No source NoData samples needed filling. Interpolation adds smoothness, not source accuracy. It cannot resolve individual stairs or narrow cliff summits.

## Position evidence

These coordinates were checked against the downloaded OSM objects, not independently surveyed. Polygon anchors are projected-area centroids; the stair anchor is a length midpoint. Longitude precedes latitude. Derivation details are in data/reference/osm-landmark-derivation.json.

| Landmark | Longitude, latitude | OSM source | Qualification |
|---|---|---|---|
| Maha Seya | 80.5167935, 8.3506202 | way/156291582 | Mapped footprint centroid |
| Ambasthala Stupa | 80.5177526, 8.3512986 | way/398907408 | Sela Cetiya alias; naming conflict below |
| Aradhana Gala | 80.5182896, 8.3510324 | node/1402637230 | Mapped point; summit height unresolved |
| White Buddha | 80.5176702, 8.3519428 | node/9349793101 | Mapped statue point |
| Main stairway viewpoint | 80.5145027, 8.3528131 | way/1356595420 | Unnamed mapped steps; identification as main/northern stairway is interpretation |
| Kantaka Cetiya | 80.5136937, 8.3522241 | way/126442943 | Mapped ruin footprint centroid |
| Naga Pokuna | 80.5156182, 8.3501414 | way/390565267 | Mapped water polygon centroid |

**Unresolved names:** another OSM object, way/581207227, is named Ambasthala about 74 m west of the retained Sela Cetiya footprint. Reference sources associate Sela Cetiya with Ambasthala. This implementation retains the Sela footprint and discloses the conflict; site/archaeological verification is still needed.

**Unresolved summit height:** Aradhana Gala's OSM elevation tag is 250 m; the sampled DSM is about 220.76 m. The app preserves the shared DSM rather than introducing an unsupported height correction. The source cannot establish exact summit geometry.

## Geometry and appearance

All landmark meshes are original simplified approximations informed by linked reference photographs. No reusable surveyed models were acquired. Stupa diameters/heights, Buddha anatomy, rock shape, pillars and railings are illustrative. Kantaka is represented as a ruined mound, not a reconstructed intact stupa. The main stairway is rendered from mapped segments; no individual measured steps are claimed. Naga Pokuna uses the mapped shoreline; water level/depth are approximate. Unknown buildings remain shallow footprint slabs.

Trees are decorative dry-zone broadleaf vegetation, deterministically scattered with exclusions around paths, water, buildings, mapped rock and landmarks. No tree inventory or land-cover polygons were obtained. Exposed rock coloration is slope-based styling, not a geological survey. No fictional palaces or extra water bodies are added.

Names use a locally bundled Sinhala-capable font. Sinhala names were cross-checked with Sinhala reference text, but the UI translations have not received a native-editor review. The user-supplied video was not exposed to the tools; no video geometry was extracted.

## Inputs that would improve accuracy

A licensed bare-earth survey/LiDAR DEM with documented vertical datum, surveyed landmark/terrace footprints and dimensions, verified Sinhala editorial review, current access/connectivity observations, and licensed photogrammetry models or measured drawings. Resolve the Ambasthala alias conflict and Aradhana height discrepancy before presenting exact geometry. No credentials or further input are required to run this delivered version. The tour is a camera sequence, not a verified walking route.

## 14 October detail upgrade

The explorer now has 11 selectable sites. Additional OSM footprint centroids: Alms Hall (way/581144469), Relic House (way/581144470), Assembly Hall (way/581144471), and Image House (way/581147399). Their exact derived coordinates and methods are in the updated landmark-derivation JSON. No new independent survey was obtained.

Buddha primitive shapes were replaced by an indexed sculpted GLB informed by a public-domain photograph. The face, gesture, hair and robe details are more recognizable but still interpreted. Mapped stairways now contain individually rendered stone blocks; no exact tread count is asserted. Identified ruin halls show perimeter masonry and interpretive standing columns instead of only flat slabs. Stupa finial rings/pillar capitals were refined; the Kantaka ruin mound height was reduced toward the approximate height in its OSM description. Vegetation and ground materials have more detail, with no change to their unsurveyed status.

A set of disparate internet photographs cannot make this an exact or photoreal scanned replica. The present result is a more detailed geographic interpretation. The wider Mihintale complex, hospital and outlying sites are not fully modeled.
