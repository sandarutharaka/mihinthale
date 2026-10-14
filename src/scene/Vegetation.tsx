import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {useEffect,useMemo,useRef} from 'react';
import {Color,InstancedMesh,Object3D,SphereGeometry} from 'three';
import type {Dataset,Landmark} from '../data/types.ts';
import {bounds,height,position,inFeature,distanceToSegment} from '../geo/landscape.ts';
export default function Vegetation({data,landmarks}:{data:Dataset;landmarks:Landmark[]}){
 const canopy=useMemo(()=>mergeGeometries(Array.from({length:7},(_,i)=>{const a=i*2.4,g=new SphereGeometry(i===0?.75:.50,12,9),p=g.attributes.position;for(let j=0;j<p.count;j++){const k=1+.10*Math.sin(p.getX(j)*7+i)*Math.sin(p.getY(j)*6+p.getZ(j)*9);p.setXYZ(j,p.getX(j)*k,p.getY(j)*k,p.getZ(j)*k)}g.computeVertexNormals();g.translate(i===0?0:Math.cos(a)*.56,i===0?.15:Math.sin(i*2)*.22, i===0?0:Math.sin(a)*.52);return g})),[]);useEffect(()=>()=>canopy.dispose(),[canopy]);
 const crown=useRef<InstancedMesh>(null),trunk=useRef<InstancedMesh>(null);
 const trees=useMemo(()=>{
 const b=bounds(data),points=landmarks.map(l=>position(data,l)).filter(p=>p!==null),woods=data.features.filter(f=>f.kind==='wood');
 // Vegetation outside mapped woodland is decorative, constrained by terrain slope and mapped exclusions.
 let seed=84173;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 const output:{x:number;y:number;z:number;s:number}[]=[];
 for(let i=0;i<2300&&output.length<700;i++){
 const x=b.minX+random()*(b.maxX-b.minX),z=b.minZ+random()*(b.maxZ-b.minZ),y=height(data,x,z);if(y===null)continue;
 if(points.some(p=>Math.hypot(x-p[0],z-p[2])<37))continue;
 if(woods.length&&!woods.some(f=>inFeature(x,z,f)))continue;
 const obstacle=data.features.some(f=>['building','water','rock'].includes(f.kind)?inFeature(x,z,f):['path','steps'].includes(f.kind)&&f.rings.some(r=>r.some((p,j)=>j>0&&distanceToSegment(x,z,r[j-1],p)<7)));
 if(obstacle||Math.abs((height(data,x+8,z)??y)-y)>5||Math.abs((height(data,x,z+8)??y)-y)>5)continue;
 output.push({x,y,z,s:0.7+random()*0.7});
 }
 return output;
 },[data,landmarks]);
 useEffect(()=>{
 if(!crown.current||!trunk.current)return;
 const obj=new Object3D();trees.forEach((t,i)=>{
 obj.position.set(t.x,t.y+5*t.s,t.z);obj.scale.set(4.8*t.s,4*t.s,4.4*t.s);obj.rotation.set(0,i*1.618,0);obj.updateMatrix();crown.current!.setMatrixAt(i,obj.matrix);crown.current!.setColorAt(i,new Color().setHSL(0.23+(i%5)*0.014,0.34,0.13+(i%7)*0.012));
 obj.position.y=t.y+2*t.s;obj.scale.set(0.48*t.s,4*t.s,0.48*t.s);obj.updateMatrix();trunk.current!.setMatrixAt(i,obj.matrix);
 });crown.current.instanceMatrix.needsUpdate=true;trunk.current.instanceMatrix.needsUpdate=true;if(crown.current.instanceColor)crown.current.instanceColor.needsUpdate=true;
 crown.current.computeBoundingSphere();trunk.current.computeBoundingSphere();
 },[trees]);
 if(!trees.length)return null;
 return <group><instancedMesh ref={crown} args={[undefined,undefined,trees.length]}><primitive object={canopy} attach="geometry"/><meshStandardMaterial roughness={1}/></instancedMesh><instancedMesh ref={trunk} args={[undefined,undefined,trees.length]}><cylinderGeometry args={[0.7,1,1,5]}/><meshStandardMaterial color="#777058" roughness={1}/></instancedMesh></group>
}
