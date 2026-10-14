# Geographic preparation and imports

The browser loads only local files from public/data. It never queries Overpass or an elevation API. Keep data/raw originals and source sidecars when redistributing data. Do not add credentials to frontend code.

## Coverage and coordinates

The sacred hill complex is east of Mihintale town (town reference approximately 8.35 N, 80.50 E). The compact first-version bounding box is west 80.512, south 8.348, east 80.520, north 8.354 (WGS84 longitude/latitude). It includes the summit and Kantaka Cetiya; it excludes Kaludiya Pokuna and other outlying sites.

Shared origin: longitude 80.517, latitude 8.351. Project to WGS84 / UTM zone 44N, EPSG:32644. Local X is east; local Z is south (negative northing difference); Y is elevation in metres minus the floor of the dataset minimum to a 10 m boundary. Every terrain vertex, map feature and model uses this same origin. Vertical exaggeration is exactly 1. Geographic source coordinates are always [longitude, latitude]. The preparation script reprojects each sample into a regular local metric grid; it does not mistake angular degrees for metres.

## Download

Use Node 22.12+ (prefer Node 24 LTS) and install dependencies first:

    npm install
    npm run data:fetch
    npm run data:prepare

The fetch script keeps successful original files and .source.json metadata, including SHA-256 and retrieval time. Existing files are never silently re-downloaded. Failed attempts are written as .failure.json, never used as data. To refresh, move the old files to an archive, then fetch again. A failed fetch exits nonzero; preparation can still produce a clearly labeled preview if inputs are missing.

The successful default is the documented OSM API small-area export: https://api.openstreetmap.org/api/0.6/map.json?bbox=80.512,8.348,80.520,8.354 (707 objects acquired). Overpass is an alternative; its attempts failed in this environment. OSM query: data/raw/mihintale.overpassql. It requests all nodes, ways and relations within the small bounding box, then their node members. Endpoint: https://overpass-api.de/api/interpreter. Documentation: https://wiki.openstreetmap.org/wiki/Overpass_API and https://wiki.openstreetmap.org/wiki/Overpass_turbo/GeoJSON. Alternative documented public instance: https://overpass.private.coffee/api/interpreter. Respect server limits; do not issue repeated/parallel requests. OSM data is ODbL 1.0, with attribution to OpenStreetMap contributors: https://www.openstreetmap.org/copyright.

The successfully downloaded Copernicus tile is Copernicus_DSM_COG_10_N08_00_E080_00_DEM. It nominally covers the site within 8–9 N and 80–81 E. Its full 47,178,963 bytes were acquired and decoded successfully. Public anonymous URL:

https://copernicus-dem-30m.s3.amazonaws.com/Copernicus_DSM_COG_10_N08_00_E080_00_DEM/Copernicus_DSM_COG_10_N08_00_E080_00_DEM.tif

This AWS distribution requires no API key or AWS account. Other Copernicus access services have different registration rules. Source: https://registry.opendata.aws/copernicus-dem/ and https://copernicus-dem-30m.s3.amazonaws.com/readme.html. This is the 2021 release, native 1 arc-second at Mihintale (nominal 30 m), WGS84 horizontal coordinates, orthometric heights referenced to EGM2008 in metres. It is a DSM, including vegetation and structures, not bare ground. Licence: https://documentation.dataspace.copernicus.eu/APIs/SentinelHub/Data/DEM/resources/license/License-COPDEM-30.pdf. Consult that licence for reuse conditions and retain its notices.

## Import already downloaded files

GeoTIFF imports support EPSG:4326 or EPSG:32644, axis-aligned rasters, one selected elevation band, and metres or international feet. GeoJSON imports must follow RFC 7946 WGS84. Reproject other CRSs/rotated rasters with GDAL first; do not merely relabel them.

    npm run data:prepare -- --dem "imports/mihintale.tif" --geojson "imports/mihintale.geojson"

Alternatively use --osm imports/export.json for Overpass JSON. --out selects the output scene JSON. GeoJSON takes precedence if both map options are provided. Importing map data without a DEM is supported: scene status stays preview and geographic path X/Z uses synthetic heights until the raster arrives. Imported source bytes are preserved under content-addressed filenames in data/raw.

Each input requires a sidecar next to it, e.g. imports/mihintale.tif.source.json:

    {
      "name": "Copernicus DEM GLO-30 2021",
      "sourceURL": "https://example.org/the-actual-downloaded-file.tif",
      "license": "Actual dataset licence name and URL",
      "retrievedAt": "2026-10-13T00:00:00Z",
      "crs": "EPSG:4326",
      "verticalUnits": "m",
      "verticalDatum": "EGM2008 orthometric metres",
      "sourceResolution": "1 arc-second, nominal 30 m",
      "product": "DSM"
    }

Replace the example URL, licence and date with the real facts. Map sidecars need name, sourceURL, license, retrievedAt and crs. DEM sidecars also require verticalUnits, verticalDatum and sourceResolution. Optional sha256 is checked. No .env file is necessary for the anonymous providers used here. If you choose a credentialed provider, download privately outside the frontend and import the resulting file; never use a VITE_ variable for a private key.

## Processing and limits

- osmtogeojson converts Overpass objects and multipolygons to data/processed/map.geojson. Imported GeoJSON is cached directly. Original tags survive in the rendered feature records.
- Tagged paths/footways/tracks/pedestrian ways, steps, buildings, water, bare rock and woodland are extracted. Whole feature parts crossing the compact bounds are omitted with a count, rather than joined with invented geometry. Relations outside the query may be incomplete. This is deliberately conservative boundary handling.
- The DEM is cropped with padding at native resolution. PixelIsArea versus PixelIsPoint and signed Y resolution are respected. Rotated grids and incompatible vertical metadata fail clearly. NoData is filled with the nearest valid grid neighbour (Manhattan distance), only if at most 2% of the cropped source window is missing. Larger gaps fail; there is no zero-elevation substitution. Full output-grid coverage is required.
- The display grid is 10 m, bilinearly resampled. This smooths display only; it does not improve a 30 m source. Row 0 is the north side. Values remain vertical metres without exaggeration. Building roofs/tree canopies in a DSM may raise landmarks above true ground; a bare-earth survey would improve this.
- Paths are densified to at most 5 m spacing and draped on the same terrain sampler. A steps tag is a mapped stairway segment, not measured individual treads. Paths are not used to create a verified walking route.
- Buildings without reliable height tags are shown as footprints/slabs, not invented ancient buildings. Tagged ruins stay low. Polygon holes are preserved. Water geometry and levels remain approximate where elevations are coarse.
- Woodland vegetation is instanced inside mapped woodland, excluding footprints, water, bare rock, paths and landmark clearances. The acquired extract has no woodland polygons; trees therefore use decorative constrained placement, not surveyed tree locations. Synthetic-preview trees are also decorative.
- Landmark definitions remain separately curated in src/data/landmarks.ts. Importing a map does not silently substitute a nearby POI with a similar name. Cross-check relevant OSM IDs and reference photographs before changing their coordinates or adding a missing main-stairway viewpoint.

## Outputs and regression checks

public/data/scene.json is the local runtime asset. data/processed/metadata.json records provenance and processing statistics. Run npm run data:landmarks to regenerate the curated OSM anchors from the cached extract. data/reference/landmarks.geojson contains derived points; osm-landmark-derivation.json records their source IDs and methods. Run npm test for geographic control points, orientation, height interpolation, manifest validation, offline GeoJSON import and tour logic. Test fixtures are synthetic and never copied into runtime assets.
