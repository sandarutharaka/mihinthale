import GroundMaterial from './GroundMaterial';
import {useEffect,useMemo} from 'react';
import {BufferGeometry,Float32BufferAttribute,Color} from 'three';
import type {Dataset} from '../data/types.ts';
import {bounds,height,inFeature} from '../geo/landscape.ts';
export default function Terrain({data}:{data:Dataset}){
 const {surface,edge}=useMemo(()=>{
 const b=bounds(data),step=data.terrain?.step??10,w=data.terrain?.width??Math.round((b.maxX-b.minX)/step)+1,h=data.terrain?.height??Math.round((b.maxZ-b.minZ)/step)+1;
 const positions:number[]=[],colors:number[]=[],indices:number[]=[];
 const green=new Color('#546d47'),granite=new Color('#b4b49a');
 for(let r=0;r<h;r++)for(let c=0;c<w;c++){
 const x=b.minX+c*step,z=b.minZ+r*step,y=height(data,x,z)??0;
 positions.push(x,y,z);
 const slope=Math.abs((height(data,x+step,z)??y)-y)+Math.abs((height(data,x,z+step)??y)-y);
 const exposed=data.features.some(f=>f.kind==='rock'&&inFeature(x,z,f));
 const mix=exposed?0.95:Math.min(0.8,Math.max(0,(slope-4)/12));
 const color=green.clone().lerp(granite,mix).multiplyScalar(0.95+0.055*Math.sin(x*0.055)*Math.cos(z*0.061));colors.push(color.r,color.g,color.b);
 if(c<w-1&&r<h-1){const i=r*w+c;indices.push(i,i+w,i+1,i+1,i+w,i+w+1)}
 }
 const surface=new BufferGeometry();surface.setAttribute('position',new Float32BufferAttribute(positions,3));surface.setAttribute('color',new Float32BufferAttribute(colors,3));surface.setIndex(indices);surface.computeVertexNormals();
 const boundary:number[]=[];for(let c=0;c<w;c++)boundary.push(c);for(let r=1;r<h;r++)boundary.push(r*w+w-1);for(let c=w-2;c>=0;c--)boundary.push((h-1)*w+c);for(let r=h-2;r>0;r--)boundary.push(r*w);
 const skirt:number[]=[];
 for(let i=0;i<boundary.length;i++){const a=boundary[i]*3,bb=boundary[(i+1)%boundary.length]*3;const A=positions.slice(a,a+3),B=positions.slice(bb,bb+3),C=[B[0],-22,B[2]],D=[A[0],-22,A[2]];skirt.push(...A,...B,...C,...A,...C,...D)}
 const edge=new BufferGeometry();edge.setAttribute('position',new Float32BufferAttribute(skirt,3));edge.computeVertexNormals();return {surface,edge};
 },[data]);
 useEffect(()=>()=>{surface.dispose();edge.dispose()},[surface,edge]);
 return <group><mesh geometry={surface} receiveShadow><GroundMaterial vertexColors/></mesh><mesh geometry={edge}><meshStandardMaterial color="#66684b" roughness={1}/></mesh></group>
}
