import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { BBOX,ORIGIN,CRS,toLocal,fromLocal,UTM_ORIGIN } from '../src/geo/coordinates.ts';
import { fillNoData,sampleGrid,sampleRaster } from '../src/geo/elevation.ts';
import type { HeightGrid } from '../src/geo/elevation.ts';
import type { Dataset,SceneFeature,Vec3 } from '../src/data/types.ts';

const args=process.argv.slice(2);
function option(name:string,fallback:string){const i=args.indexOf(name);return i<0?fallback:args[i+1]??fallback}
const demPath=option('--dem','data/raw/elevation.tif'),osmPath=option('--osm','data/raw/osm.json'),geojsonPath=option('--geojson','');
const output=option('--out','public/data/scene.json');
await fs.mkdir('data/raw',{recursive:true});await fs.mkdir('data/processed',{recursive:true});
const warnings:string[]=[];const sources:Dataset['sources']=[];
async function input(file:string){
 const bytes=await fs.readFile(file);const meta=JSON.parse(await fs.readFile(file+'.source.json','utf8'));
 for(const key of ['name','sourceURL','license','retrievedAt','crs'])if(typeof meta[key]!=='string'||!meta[key])throw new Error(file+'.source.json requires '+key);
 if(Number.isNaN(Date.parse(meta.retrievedAt)))throw new Error('Invalid retrieval date');
 const sha256=createHash('sha256').update(bytes).digest('hex');
 if(meta.sha256&&meta.sha256!==sha256)throw new Error('Source checksum mismatch: '+file);
 // Preserve imported original bytes under content-addressed names; never overwrite the input.
 const cached='data/raw/import-'+sha256.slice(0,16)+path.extname(file);
 if(path.dirname(path.resolve(file))!==path.resolve('data/raw')&&path.resolve(cached)!==path.resolve(file)){await fs.writeFile(cached,bytes);await fs.writeFile(cached+'.source.json',JSON.stringify({...meta,sha256},null,2))}
 sources.push({name:meta.name,url:meta.sourceURL,license:meta.license,retrievedAt:meta.retrievedAt,sha256});return {bytes,meta};
}
let terrain:HeightGrid|null=null;let verticalDatum='Not available';let filledCount=0;
if(await fs.stat(demPath).catch(()=>null)){
 const {bytes,meta}=await input(demPath);
 if(!['m','ft'].includes(meta.verticalUnits))throw new Error('DEM sidecar must declare verticalUnits m or ft');
 if(!meta.verticalDatum)throw new Error('DEM sidecar requires verticalDatum');
 if(!meta.sourceResolution)throw new Error('DEM sidecar requires sourceResolution');
 const {fromArrayBuffer}=await import('geotiff');
 const tiff=await fromArrayBuffer(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength));
 const img=await tiff.getImage();const keys=await img.getGeoKeys();
 const epsg=keys.ProjectedCSTypeGeoKey??keys.GeographicTypeGeoKey;
 if(![4326,32644].includes(epsg))throw new Error('Supported DEM CRS: EPSG:4326 or EPSG:32644; reproject the input with GDAL');
 if(meta.crs!=='EPSG:'+epsg)throw new Error('DEM CRS and sidecar disagree');
 if(keys.VerticalUnitsGeoKey&&keys.VerticalUnitsGeoKey!==(meta.verticalUnits==='ft'?9002:9001))throw new Error('TIFF vertical units conflict with sidecar');
 const [ox,oy]=img.getOrigin(),[rx,ry]=img.getResolution();
 const transform=img.fileDirectory.getValue('ModelTransformation');
 if(transform&&(transform[1]!==0||transform[4]!==0))throw new Error('Rotated raster unsupported; warp north-up first');
 if(!Number.isFinite(rx)||!Number.isFinite(ry)||rx===0||ry===0)throw new Error('Invalid raster resolution');
 const sw=toLocal(BBOX[0],BBOX[1]),ne=toLocal(BBOX[2],BBOX[3]);
 const minX=Math.floor(sw[0]/10)*10,minZ=Math.floor(ne[1]/10)*10;
 const width=Math.ceil((ne[0]-minX)/10)+1,height=Math.ceil((sw[1]-minZ)/10)+1;
 // Read only a padded pixel window covering the local metric rectangle; retain native source resolution.
 const corners=[[minX,minZ],[minX+(width-1)*10,minZ],[minX,minZ+(height-1)*10],[minX+(width-1)*10,minZ+(height-1)*10]];
 const px=corners.map(([x,z])=>{const [a,b]=epsg===4326?fromLocal(x,z):[UTM_ORIGIN[0]+x,UTM_ORIGIN[1]-z];return [(a-ox)/rx,(b-oy)/ry]});
 const x0=Math.max(0,Math.floor(Math.min(...px.map(p=>p[0])))-2),y0=Math.max(0,Math.floor(Math.min(...px.map(p=>p[1])))-2);
 const x1=Math.min(img.getWidth(),Math.ceil(Math.max(...px.map(p=>p[0])))+3),y1=Math.min(img.getHeight(),Math.ceil(Math.max(...px.map(p=>p[1])))+3);
 if(x1<=x0||y1<=y0)throw new Error('DEM does not cover Mihintale bounds');
 const native=await img.readRasters({window:[x0,y0,x1,y1],samples:[0],interleave:true});const nodata=img.getGDALNoData();
 const original=Array.from(native as ArrayLike<number>,v=>!Number.isFinite(v)||v===nodata?NaN:v*(meta.verticalUnits==='ft'?0.3048:1));
 const missing=original.filter(v=>!Number.isFinite(v)).length;
 if(missing/original.length>0.02)throw new Error('More than 2% of source window is NoData; supply a better DEM');
 const filled=fillNoData(original,x1-x0,y1-y0);filledCount=filled.filled;
 if(filledCount)warnings.push(filledCount+' missing source samples filled using nearest valid neighbour (Manhattan grid distance).');
 const values:number[]=[];
 for(let row=0;row<height;row++)for(let col=0;col<width;col++){
 const x=minX+col*10,z=minZ+row*10;const [a,b]=epsg===4326?fromLocal(x,z):[UTM_ORIGIN[0]+x,UTM_ORIGIN[1]-z];
 const value=sampleRaster(filled.values,x1-x0,y1-y0,ox+x0*rx,oy+y0*ry,rx,ry,a,b,keys.GTRasterTypeGeoKey!==2);
 if(value===null)throw new Error('DEM misses at least one output vertex; full bounding-box coverage is required');
 values.push(Math.round(value*100)/100);
 }
 terrain={width,height,minX,minZ,step:10,values};verticalDatum=meta.verticalDatum;
 warnings.push('Source resolution: '+meta.sourceResolution+'. 10 m display resampling does not improve accuracy. '+(meta.product==='DSM'?'DSM includes vegetation and structures; not bare earth.':''));
}else warnings.push('Elevation raster missing. Illustrative preview — geographic data pending.');

let collection:any={type:'FeatureCollection',features:[]};
const sourcePath=geojsonPath||osmPath;
if(await fs.stat(sourcePath).catch(()=>null)){
 const {bytes,meta}=await input(sourcePath);
 if(meta.crs!=='EPSG:4326')throw new Error('Map input must be WGS84 EPSG:4326 GeoJSON/OSM');
 const raw=JSON.parse(bytes.toString());
 if(geojsonPath)collection=raw;
 else {if(!Array.isArray(raw.elements)||raw.remark)throw new Error('Invalid/incomplete Overpass JSON');const {default:convert}=await import('osmtogeojson');collection=convert(raw)}
 if(collection.type!=='FeatureCollection'||!Array.isArray(collection.features))throw new Error('Expected a GeoJSON FeatureCollection');
 if(collection.crs)throw new Error('GeoJSON CRS member not supported: use RFC 7946 WGS84');
 await fs.writeFile('data/processed/map.geojson',JSON.stringify(collection));
}else warnings.push('No mapped paths, buildings, water or land cover available.');
const features:SceneFeature[]=[];let skipped=0;
for(const f of collection.features){
 const tags=f.properties?.tags??f.properties??{};const g=f.geometry;if(!g)continue;
 let kind:SceneFeature['kind']|null=null;
 if(tags.highway==='steps')kind='steps';else if(['path','footway','pedestrian','track'].includes(tags.highway))kind='path';
 else if(tags.building||tags.historic==='ruins')kind='building';else if(tags.natural==='water'||tags.water)kind='water';else if(tags.natural==='bare_rock')kind='rock';else if(tags.natural==='wood'||tags.landuse==='forest')kind='wood';
 if(!kind)continue;
 const parts=g.type==='Polygon'?[g.coordinates]:g.type==='MultiPolygon'?g.coordinates:g.type==='LineString'?[[g.coordinates]]:g.type==='MultiLineString'?g.coordinates.map((line:any)=>[line]):[];
 for(let p=0;p<parts.length;p++){
 const rings:Vec3[][]=[];let valid=true;
 for(const ring of parts[p]){
 const points:Vec3[]=[];
 for(let i=0;i<ring.length;i++){
 const [lon,lat]=ring[i];if(!Number.isFinite(lon)||!Number.isFinite(lat)||lon<BBOX[0]||lon>BBOX[2]||lat<BBOX[1]||lat>BBOX[3]){valid=false;break}
 const [x,z]=toLocal(lon,lat),prev=points.at(-1),steps=prev?Math.max(1,Math.ceil(Math.hypot(x-prev[0],z-prev[2])/5)):1;
 for(let s=1;s<=steps;s++){const px=prev?prev[0]+(x-prev[0])*s/steps:x,pz=prev?prev[2]+(z-prev[2])*s/steps:z;const y=terrain?sampleGrid(terrain,px,pz):0;if(y===null){valid=false;break}points.push([px,y??0,pz])}
 }
 rings.push(points);
 }
 if(!valid||!rings[0]?.length){skipped++;continue}
 features.push({id:String(f.id??'feature-'+features.length)+'-'+p,kind:kind!,rings,name:tags.name,tags});
 }
}
if(skipped)warnings.push(skipped+' feature parts crossing the compact boundary or lacking height coverage were omitted, not joined across gaps.');
const dataset:Dataset={schemaVersion:1,status:terrain?'ready':'preview',origin:ORIGIN,crs:CRS,verticalDatum,verticalExaggeration:1,terrain,features,generatedAt:new Date().toISOString(),sources,warnings,stats:{features:features.length,filledSourceSamples:filledCount,skippedParts:skipped}};
await fs.mkdir(path.dirname(output),{recursive:true});const temp=output+'.tmp';await fs.writeFile(temp,JSON.stringify(dataset));try{await fs.rename(temp,output)}catch(error){if((error as NodeJS.ErrnoException).code!=='EPERM')throw error;await fs.writeFile(output,await fs.readFile(temp));await fs.unlink(temp).catch(()=>{});}
await fs.writeFile('data/processed/metadata.json',JSON.stringify({...dataset,terrain:terrain?{...terrain,values:undefined}:null,features:undefined},null,2));
console.log('Prepared '+features.length+' feature parts; terrain '+(terrain?'loaded':'pending')+'. Output: '+output);
