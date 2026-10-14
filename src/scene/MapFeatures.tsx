import GroundMaterial from './GroundMaterial';
import {useEffect,useMemo} from 'react';import {BufferGeometry,Float32BufferAttribute,ShapeUtils,Vector2,DoubleSide} from 'three';
import type {Dataset,SceneFeature} from '../data/types.ts';import {height} from '../geo/landscape.ts';
function Feature({feature:f,data}:{feature:SceneFeature;data:Dataset}){
 const geometry=useMemo(()=>{
 const vertices:number[]=[];const y=(x:number,z:number)=>(height(data,x,z)??0)+0.35;
 if(f.kind==='path'||f.kind==='steps'){
 const half=f.kind==='steps'?1.8:1.15;
 for(const ring of f.rings)for(let i=1;i<ring.length;i++){
 const a=ring[i-1],b=ring[i],len=Math.hypot(b[0]-a[0],b[2]-a[2]);if(!len)continue;const dx=(b[2]-a[2])/len*half,dz=-(b[0]-a[0])/len*half;
 const p=[[a[0]+dx,y(a[0]+dx,a[2]+dz),a[2]+dz],[a[0]-dx,y(a[0]-dx,a[2]-dz),a[2]-dz],[b[0]+dx,y(b[0]+dx,b[2]+dz),b[2]+dz],[b[0]-dx,y(b[0]-dx,b[2]-dz),b[2]-dz]];
 vertices.push(...p[0],...p[1],...p[2],...p[2],...p[1],...p[3]);
 }
 }else{
 const rings=f.rings.map(r=>{const pts=r.map(p=>new Vector2(p[0],p[2]));if(pts.length>1&&pts[0].equals(pts[pts.length-1]))pts.pop();return pts});
 if(rings[0].length<3)return new BufferGeometry();const flat=rings.flat(),faces=ShapeUtils.triangulateShape(rings[0],rings.slice(1));
 // Untagged footprints are outlines/slabs, never invented intact ancient buildings.
 const ruined=f.tags.ruins==='yes'||f.tags.historic==='ruins';const explicit=Number.parseFloat(f.tags.height??'');const raised=f.kind==='building'?(ruined?0.6:Number.isFinite(explicit)?Math.min(25,Math.max(0.5,explicit)):0.4):0;
 for(const face of faces)for(const index of face){const p=flat[index];vertices.push(p.x,y(p.x,p.y)+raised,p.y)}
 if(raised>0)for(const ring of rings)for(let i=0;i<ring.length;i++){const a=ring[i],b=ring[(i+1)%ring.length],A=[a.x,y(a.x,a.y),a.y],B=[b.x,y(b.x,b.y),b.y],C=[b.x,y(b.x,b.y)+raised,b.y],D=[a.x,y(a.x,a.y)+raised,a.y];vertices.push(...A,...B,...C,...A,...C,...D)}
 }
 const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(vertices,3));g.computeVertexNormals();return g;
 },[f,data]);useEffect(()=>()=>geometry.dispose(),[geometry]);
 const color=f.kind==='water'?'#567d76':f.kind==='steps'?'#c7bc9d':f.kind==='path'?'#b9aa88':f.kind==='building'?'#b6a98e':'#b1b1a0';
 return <mesh geometry={geometry} receiveShadow>{f.kind==='water'?<meshStandardMaterial color={color} roughness={.45} side={DoubleSide}/>:<GroundMaterial color={color}/>}</mesh>
}
export default function MapFeatures({data,paths}:{data:Dataset;paths:boolean}){return <group>{data.features.filter(f=>f.kind!=='wood'&&f.kind!=='steps'&&(paths||!['steps','path'].includes(f.kind))).map(f=><Feature key={f.id} feature={f} data={data}/>)}</group>}
