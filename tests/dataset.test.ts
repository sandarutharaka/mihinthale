import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {validateDataset,previewDataset} from '../src/geo/dataset.ts';import {landmarks} from '../src/data/landmarks.ts';import {BBOX,toLocal} from '../src/geo/coordinates.ts';
const preview=previewDataset;
test('prepared runtime manifest is valid',()=>{assert.ok(validateDataset(JSON.parse(fs.readFileSync('public/data/scene.json','utf8'))))});
test('explicit preview is valid without fabricated datasets',()=>{assert.equal(validateDataset(preview).status,'preview');assert.equal(preview.sources.length,0)});
test('reject corrupt grids and mismatched coordinate origins',()=>{assert.throws(()=>validateDataset({...preview,origin:[0,0]}));assert.throws(()=>validateDataset({...preview,status:'ready',terrain:null}));assert.throws(()=>validateDataset({...preview,terrain:{width:2,height:2,step:10,minX:0,minZ:0,values:[1,2,3,null]}}))});
test('all placed landmarks have source and lie inside compact site',()=>{for(const l of landmarks){if(l.coordinates){assert.ok(l.coordinateSource?.url.startsWith('https://'));const [x,y]=l.coordinates;assert.ok(x>=BBOX[0]&&x<=BBOX[2]&&y>=BBOX[1]&&y<=BBOX[3]);assert.ok(toLocal(x,y).every(Number.isFinite))}}});

test('every mapped landmark is on valid source terrain',async()=>{const {position,height}=await import('../src/geo/landscape.ts');const d=validateDataset(JSON.parse(fs.readFileSync('public/data/scene.json','utf8')));assert.equal(d.status,'ready');for(const landmark of landmarks){const p=position(d,landmark);assert.ok(p);assert.equal(p[1],height(d,p[0],p[2]));assert.ok(p[1]>=0&&p[1]<500)}});
