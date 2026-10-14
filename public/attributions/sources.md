# Sources, licences and asset attribution

Consulted/retrieved 13 October 2026. Exact download times and SHA-256 hashes are retained in data/raw/*.source.json and data/processed/metadata.json. Raw files are cached; visitors only load the prepared local JSON.

## Geographic datasets

| Dataset | Source | Licence | CRS / resolution / limitation |
|---|---|---|---|
| OpenStreetMap sacred hill export | https://api.openstreetmap.org/api/0.6/map.json?bbox=80.512,8.348,80.520,8.354 | © OpenStreetMap contributors, ODbL 1.0: https://www.openstreetmap.org/copyright | WGS84 EPSG:4326 longitude/latitude. Community mapping, incomplete and not survey-certified. Retrieved 2026-10-13T17:33:48.774Z. |
| Copernicus DEM GLO-30 2021 | https://copernicus-dem-30m.s3.amazonaws.com/Copernicus_DSM_COG_10_N08_00_E080_00_DEM/Copernicus_DSM_COG_10_N08_00_E080_00_DEM.tif | Copernicus WorldDEM-30 licence linked below | EPSG:4326, native 1 arc-second (~30 m), EGM2008 orthometric metres. DSM includes structures/canopies; historical acquisition, not a 2026 survey. Retrieved 2026-10-13T17:34:15.683Z. |

Copernicus access/coverage: https://registry.opendata.aws/copernicus-dem/ and https://copernicus-dem-30m.s3.amazonaws.com/readme.html. Anonymous AWS access used successfully; no API key required.

Licence: https://documentation.dataspace.copernicus.eu/APIs/SentinelHub/Data/DEM/resources/license/License-COPDEM-30.pdf

Original dataset notice: © DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018 provided under COPERNICUS by the European Union and ESA; all rights reserved.

Prepared terrain notice: produced using Copernicus WorldDEM-30 © DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018 provided under COPERNICUS by the European Union and ESA; all rights reserved.

The organisations in charge of the Copernicus programme by law or by delegation do not incur any liability for any use of the Copernicus WorldDEM-30.

Keep OSM attribution and ODbL obligations with redistributed derived map databases, and the Copernicus notices with terrain. Source sidecars and processing metadata distinguish the two datasets.

OSM workflow documentation: https://wiki.openstreetmap.org/wiki/API_v0.6 and https://wiki.openstreetmap.org/wiki/Overpass_API. Overpass attempts failed in this environment; the documented small-area OSM API export succeeded. The saved Overpass query is an alternative, not the actual successful source.

## Landmark descriptions, spellings and appearance references

- Maha Seya: https://www.uniquesrilanka.com/heritage/maha-seya-mihintale
- Ambasthala / Sela Cetiya: https://mapcarta.com/W398907408 and https://en.wikipedia.org/wiki/Sela_Cetiya
- Aradhana Gala: https://mapcarta.com/N1402637230 and https://commons.wikimedia.org/wiki/File:Mihintale_Rock.jpg
- White Buddha: https://www.uniquesrilanka.com/heritage/mihintale-buddha-statue and https://commons.wikimedia.org/wiki/File:Mihintale_Buddha_Statue.jpg
- Kantaka Cetiya: https://www.uniquesrilanka.com/v2/heritage/kantaka-chethiya-at-mihintale
- Naga Pokuna: https://www.uniquesrilanka.com/heritage/naga-pokuna-of-mihintale
- General context: https://en.wikipedia.org/wiki/Mihintale
- Sinhala name reference: https://aryapatipada.org/mihinthalaya/ (indexed text consulted; full-page retrieval unavailable).

The live records link description and coordinate sources individually. Earlier published coordinates were cross-checked against the acquired OSM extract, whose derived anchors are now used. Reference-page prose is summarized, not copied. The initial delivery used references only. The 14 October update bundles 11 licensed reference photographs in references/mihintale; their full author/source/licence/hash manifest is photos.json. Three unmodified photos are also included in the runtime panels, attributed below. No third-party meshes, video, audio or photographic surface textures are bundled. The 3D meshes, CSS silhouettes and inline icons were created for this project.

## Font and software

Noto Sans Sinhala is bundled from @fontsource/noto-sans-sinhala under SIL Open Font License 1.1; see public/attributions/Noto-Sans-Sinhala-OFL.txt. It is not fetched from Google Fonts at runtime. System fonts/Georgia provide English fallbacks.

Core versions are pinned and resolved in package-lock.json. React 19 + Fiber 9 compatibility was checked against https://r3f.docs.pmnd.rs/getting-started/installation. Other consulted documentation: https://drei.docs.pmnd.rs/controls/introduction, https://vite.dev/guide/, https://github.com/geotiffjs/geotiff.js, https://fontsource.org/fonts/noto-sans-sinhala/install and https://epsg.io/32644. The preparation-only osmtogeojson 3.0.0-beta.5 utility is pinned to its published version; core application packages use stable releases. The xmldom transitive override uses the compatible 0.8.15 security patch.

## Photographs added 14 October 2026

- Buddha close-up: Ranabolt, public domain, https://commons.wikimedia.org/wiki/File:The_Buddha_at_Mihintale,_Sri_Lanka.JPG. Runtime copy public/photos/buddha.jpg, unmodified.
- Conversation/Assembly Hall: Yasasuru, CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/), https://commons.wikimedia.org/wiki/File:Conversation_Hall_of_Mihintale.jpg. Runtime copy public/photos/assembly-hall.jpg, unmodified.
- Stone steps: Uviein, CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/), https://commons.wikimedia.org/wiki/File:Escaleras_de_Mihintale_1.jpg. Runtime copy public/photos/stairs.jpg, unmodified.

The full reference-library attribution manifest covers the other photographs, which are preparation references and are not sent to visitors. Downloaded Aradhana-titled photograph 6501278681 shows people rather than useful rock geometry and was excluded from modeling/gallery after visual inspection.
