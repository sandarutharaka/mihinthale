# Validation record — 13 October 2026

## Executed successfully

- npm install: resolved package-lock.json; final install audit reported 0 vulnerabilities.
- Production build: TypeScript check and Vite build passed (614 transformed modules).
- Node geographic/import suite: 16 passed, 0 failed. Covers UTM central-meridian and Mihintale control points, east/north orientation and inverse round trips; signed raster orientation, bilinear interpolation and NoData filling; every included landmark on valid downloaded terrain; manifest failures; offline GeoJSON import and missing licence rejection; tour state and URL validation.
- Actual downloaded GeoTIFF processed successfully: 91 × 69 grid, 45 features, 0 filled source samples, 2 omitted boundary-crossing parts. Original files have recorded SHA-256 checksums.
- Playwright Chromium: 11 passed, 1 intentionally skipped, 0 failed. Five shared scenarios each ran at desktop and emulated iPhone 13 dimensions: selection/hash restoration/language/layout; tour controls and manual button interruption; WebGL-unavailable fallback; missing-data preview and layer controls; rendered 3D with no page errors and screenshot capture. An additional desktop scenario used normal motion, checked camera-map changes, and paused the tour through a direct canvas drag. That desktop mouse scenario is intentionally skipped in the mobile project.
- Inspected desktop and mobile tour screenshots. Fixed a mobile information-sheet/camera-button overlap and excessive near-camera label scaling, then reran the browser suite successfully.

Screenshots: screenshots/desktop.png, desktop-tour.png, mobile.png and mobile-tour.png.

## Limits

Browser tests use Chromium with software WebGL and emulated mobile dimensions; no physical phone, Safari, Firefox, real multi-touch pinch gesture or production hardware performance benchmark was available. The automated mouse-drag test and screenshots do not certify animation frame rate. Reduced-motion behavior is covered, with normal-motion camera change separately exercised. Screen-reader output has not received a human assistive-technology audit. Sinhala translations have not received native-editor proofreading.

Vite reports the Three.js/Fiber shared chunk exceeds 500 kB: approximately 1.105 MB minified / 308 kB gzip. This is a build warning, not a failure. Models and the scene component use dynamic imports, but the renderer remains a significant dependency. Mobile DPR/shadows and instanced vegetation limit rendering cost.

The requested independent reviewer could not run because the agent service reported a usage limit; a local implementation audit and the executed checks above were completed instead. No deployment or live walking-route verification was performed. See accuracy.md for positional and terrain uncertainties.

## 14 October 2026 detail-upgrade validation

- `npm test`: 19 passed, 0 failed, including source-aligned stair blocks, ruin footprint restrictions, and GLB container/size/unit-normal validation. Existing geographic, terrain, import, URL and tour checks remain passing.
- `npm run test:e2e`: 12 passed, 2 intentionally skipped, 0 failed. Seven desktop scenarios and five mobile scenarios passed. The two desktop-only scenarios (direct mouse drag and detailed close-up review) are skipped on mobile. The new close-up check verifies camera target coordinates against the mapped Buddha anchor, then selects mapped ruins and stairs.
- A prior mobile run failed because the reused development server disappeared. The harness now owns a dedicated strict-port server on 5187; the complete rerun passed.
- `npm run build`: TypeScript and production build passed, 621 modules. Three.js shared chunk is 1,178.88 kB / 329.84 kB gzip; the size warning remains. The local Buddha GLB is 2,461,944 bytes.
- Inspected Buddha, stairs, ruins and mobile-tour screenshots. Reference photographs were visually inspected; one misleadingly titled photograph is explicitly excluded from modeling. No Blender execution or scanned-model validation occurred.
- New screenshots: screenshots/buddha-detail.png, stairs-detail.png and ruins-detail.png; desktop/mobile captures refreshed.

Physical-device, browser-family, surveyed-geometry and Sinhala-editor limitations above still apply.
