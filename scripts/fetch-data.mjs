import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
const cache='data/raw'; await fs.mkdir(cache,{recursive:true});
const query='[out:json][timeout:60];(nwr(8.348,80.512,8.354,80.520););out body;>;out skel qt;';
await fs.writeFile(cache+'/mihintale.overpassql',query+'\n');
const tile='Copernicus_DSM_COG_10_N08_00_E080_00_DEM';
const tasks=[
 {name:'OpenStreetMap',file:'osm.json',url:'https://api.openstreetmap.org/api/0.6/map.json?bbox=80.512,8.348,80.520,8.354',license:'ODbL 1.0 — https://www.openstreetmap.org/copyright',crs:'EPSG:4326',options:{headers:{'User-Agent':'Mihintale3DExplorer/0.1 (one-off cached educational extract)'}}},
 {name:'Copernicus DEM GLO-30 2021',file:'elevation.tif',url:'https://copernicus-dem-30m.s3.amazonaws.com/'+tile+'/'+tile+'.tif',license:'Copernicus WorldDEM-30 licence — https://documentation.dataspace.copernicus.eu/APIs/SentinelHub/Data/DEM/resources/license/License-COPDEM-30.pdf',crs:'EPSG:4326',verticalUnits:'m',verticalDatum:'EGM2008 orthometric metres',sourceResolution:'1 arc-second, nominal 30 m',product:'DSM'}
];
let failed=false;
for(const item of tasks){
 const file=cache+'/'+item.file;
 if(await fs.stat(file).catch(()=>null)){const sidecar=JSON.parse(await fs.readFile(file+'.source.json','utf8').catch(()=>'{"sha256":null}'));const bytes=await fs.readFile(file);if(sidecar.sha256!==createHash('sha256').update(bytes).digest('hex'))throw new Error('Unverified or partial cached input: '+file+'; archive it before fetching again');console.log('Verified cached original: '+file);continue}
 const attemptedAt=new Date().toISOString();
 try{
 const r=await fetch(item.url,{...item.options,signal:AbortSignal.timeout(300000)});
 if(!r.ok)throw new Error('HTTP '+r.status);
 const buffer=Buffer.from(await r.arrayBuffer());
 if(item.file.endsWith('.json')){const j=JSON.parse(buffer.toString());if(!Array.isArray(j.elements)||j.remark)throw new Error(j.remark||'Invalid OSM response')}
 else if(!['II','MM'].includes(buffer.subarray(0,2).toString()))throw new Error('Response is not a TIFF');
 await fs.writeFile(file,buffer);
 const {options,...meta}=item;
 await fs.writeFile(file+'.source.json',JSON.stringify({...meta,sourceURL:item.url,retrievedAt:new Date().toISOString(),sha256:createHash('sha256').update(buffer).digest('hex')},null,2));
 console.log('Saved '+file+' ('+buffer.length+' bytes)');
 }catch(e){failed=true;await fs.writeFile(file+'.failure.json',JSON.stringify({attemptedAt,url:item.url,error:String(e),cause:String(e.cause??'')},null,2));console.error(item.name+': '+e.message+'; import a downloaded file with provenance instead.');}
}
if(failed)process.exitCode=1;
