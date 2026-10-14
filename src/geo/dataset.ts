import type { Dataset } from '../data/types.ts';
import { ORIGIN } from './coordinates.ts';
import { sampleGrid } from './elevation.ts';
export function validateDataset(value:unknown):Dataset {
 if(!value||typeof value!=='object')throw new Error('Missing dataset');
 const d=value as Dataset;
 if(d.schemaVersion!==1||d.crs!=='EPSG:32644'||d.verticalExaggeration!==1||!Array.isArray(d.origin)||d.origin.some((v,i)=>v!==ORIGIN[i])||d.origin.length!==2)throw new Error('Unsupported shared coordinate system');
 if(!['ready','preview'].includes(d.status)||!Array.isArray(d.features)||!Array.isArray(d.sources)||!Array.isArray(d.warnings))throw new Error('Malformed dataset');
 if(d.status==='ready'&&!d.terrain)throw new Error('Ready dataset requires elevation');
 if(d.terrain){
 const g=d.terrain;
 if(!Number.isInteger(g.width)||!Number.isInteger(g.height)||g.width<2||g.height<2||g.width*g.height>1000000||!Number.isFinite(g.step)||g.step<=0||!Number.isFinite(g.minX)||!Number.isFinite(g.minZ)||!Array.isArray(g.values)||g.values.length!==g.width*g.height||g.values.some(v=>typeof v!=='number'||!Number.isFinite(v)))throw new Error('Invalid heightmap dimensions or samples');
 }
 if(d.features.length>20000)throw new Error('Too many features');
 for(const f of d.features){
 if(!['path','steps','building','water','rock','wood'].includes(f.kind)||!Array.isArray(f.rings)||!f.rings.length)throw new Error('Invalid mapped feature');
 for(const ring of f.rings){if(!Array.isArray(ring)||ring.length>100000||ring.length<2)throw new Error('Invalid geometry');for(const p of ring){if(!Array.isArray(p)||p.length!==3||p.some(n=>typeof n!=='number'||!Number.isFinite(n)))throw new Error('Invalid feature coordinate');if(d.terrain&&sampleGrid(d.terrain,p[0],p[2])===null)throw new Error('Feature outside height coverage')}}
 }
 return d;
}
export const previewDataset:Dataset={schemaVersion:1,status:'preview',origin:ORIGIN,crs:'EPSG:32644',verticalDatum:'Illustrative only',verticalExaggeration:1,terrain:null,features:[],generatedAt:null,sources:[],warnings:[]};
