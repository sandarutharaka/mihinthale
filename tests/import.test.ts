import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';import path from 'node:path';import os from 'node:os';import {execFileSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
const script=fileURLToPath(new URL('../scripts/prepare-data.ts',import.meta.url));
test('offline GeoJSON import preserves original, produces metric paths, and stays preview without DEM',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'mihintale-import-'));
 const feature={type:'FeatureCollection',features:[{type:'Feature',id:'test-steps',properties:{highway:'steps'},geometry:{type:'LineString',coordinates:[[80.517,8.351],[80.518,8.352]]}}]};
 await fs.writeFile(path.join(dir,'map.geojson'),JSON.stringify(feature));await fs.writeFile(path.join(dir,'map.geojson.source.json'),JSON.stringify({name:'Synthetic test fixture',sourceURL:'https://example.com/test',license:'CC0 test fixture',retrievedAt:'2026-10-13',crs:'EPSG:4326'}));
 execFileSync(process.execPath,[script,'--geojson','map.geojson','--out','scene.json'],{cwd:dir,encoding:'utf8',windowsHide:true});
 const result=JSON.parse(await fs.readFile(path.join(dir,'scene.json'),'utf8'));assert.equal(result.status,'preview');assert.equal(result.terrain,null);assert.equal(result.features[0].kind,'steps');const points=result.features[0].rings[0];assert.ok(points.length>25);assert.ok(points.at(-1)[0]>100);assert.ok(points.at(-1)[2]<-100);assert.equal(result.sources.length,1);assert.ok(result.sources[0].sha256.length===64);assert.ok((await fs.readdir(path.join(dir,'data/raw'))).some(f=>f.endsWith('.geojson')));
});
test('unlicensed import fails before writing a scene',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'mihintale-invalid-'));await fs.writeFile(path.join(dir,'map.geojson'),'{}');await fs.writeFile(path.join(dir,'map.geojson.source.json'),'{}');
 assert.throws(()=>execFileSync(process.execPath,[script,'--geojson','map.geojson','--out','scene.json'],{cwd:dir,stdio:'pipe',windowsHide:true}));assert.equal(await fs.stat(path.join(dir,'scene.json')).catch(()=>null),null);
});
