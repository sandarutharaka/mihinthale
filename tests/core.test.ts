import test from 'node:test';
import assert from 'node:assert/strict';
import { toUTM, fromUTM, toLocal, ORIGIN } from '../src/geo/coordinates.ts';
import { sampleGrid, sampleRaster, fillNoData } from '../src/geo/elevation.ts';
import { tourReducer, initialTour, selectionFromHash } from '../src/controls/tour.ts';

test('UTM 44N central meridian control point', () => {
 const [e,n] = toUTM(81,0); assert.ok(Math.abs(e-500000)<0.001); assert.ok(Math.abs(n)<0.001);
});
test('published Mihintale town MGRS control point', () => {
 const [e,n] = toUTM(80.5,8.35); assert.ok(Math.abs(e-444948)<2); assert.ok(Math.abs(n-923026)<2);
});
test('origin, east/north orientation and round trip', () => {
 assert.deepEqual(toLocal(...ORIGIN),[0,0]);
 assert.ok(toLocal(ORIGIN[0]+0.001,ORIGIN[1])[0]>100);
 assert.ok(toLocal(ORIGIN[0],ORIGIN[1]+0.001)[1]<-100);
 for (const point of [[80.517,8.351],[80.510,8.349],[80.521,8.355]]) {
 const r=fromUTM(...toUTM(point[0],point[1])); assert.ok(Math.abs(r[0]-point[0])<1e-7); assert.ok(Math.abs(r[1]-point[1])<1e-7);
 }
});
test('terrain alignment uses north-first rows and bilinear sampling', () => {
 const g={width:2,height:2,minX:0,minZ:0,step:10,values:[10,20,30,40]};
 assert.equal(sampleGrid(g,0,0),10); assert.equal(sampleGrid(g,10,10),40); assert.equal(sampleGrid(g,5,5),25); assert.equal(sampleGrid(g,-1,0),null);
});
test('raster orientation works with either signed Y resolution and pixel areas', () => {
 assert.equal(sampleRaster([10,20,30,40],2,2,0,20,10,-10,5,15,true),10);
 assert.equal(sampleRaster([30,40,10,20],2,2,0,0,10,10,5,15,true),10);
});
test('NoData holes filled deterministically; absent raster rejected', () => {
 assert.deepEqual(fillNoData([10,NaN,30,40],2,2),{values:[10,10,30,40],filled:1});
 assert.throws(()=>fillNoData([NaN,NaN],2,1),/valid elevation/);
});
test('tour pauses on manual control and resumes at same landmark', () => {
 let t=tourReducer(initialTour,{type:'START',count:3}); t=tourReducer(t,{type:'NEXT',count:3});
 assert.equal(t.index,1); t=tourReducer(t,{type:'MANUAL',count:3}); assert.equal(t.status,'paused');
 t=tourReducer(t,{type:'RESUME',count:3}); assert.equal(t.index,1); assert.equal(t.status,'playing');
 t=tourReducer(t,{type:'NEXT',count:3}); t=tourReducer(t,{type:'NEXT',count:3}); assert.equal(t.status,'finished'); assert.equal(t.index,2);
});
test('tour handles previous, reset and empty data', () => {
 assert.equal(tourReducer(initialTour,{type:'START',count:0}).status,'idle');
 assert.equal(tourReducer({...initialTour,index:0},{type:'PREVIOUS',count:3}).index,0);
 assert.deepEqual(tourReducer({...initialTour,index:2,status:'paused'},{type:'STOP',count:3}),initialTour);
});
test('share hashes reject unknown and malformed landmark IDs', () => {
 assert.equal(selectionFromHash('#landmark=maha-seya',['maha-seya']),'maha-seya');
 assert.equal(selectionFromHash('#landmark=bad',['maha-seya']),null);
 assert.equal(selectionFromHash('#landmark=%',['maha-seya']),null);
});
