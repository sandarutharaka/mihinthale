import type { Dataset, Landmark, SceneFeature, Vec3 } from '../data/types.ts';
import { toLocal } from './coordinates.ts';
import { sampleGrid } from './elevation.ts';
export const PREVIEW_BOUNDS={minX:-560,maxX:340,minZ:-340,maxZ:340};
/** Deliberately synthetic, deterministic exhibit base. Never an elevation source. */
export function previewHeight(x:number,z:number):number {
 const hill=(cx:number,cz:number,sx:number,sz:number,h:number)=>h*Math.exp(-(((x-cx)/sx)**2+((z-cz)/sz)**2));
 return 6+hill(5,35,200,220,66)+hill(142,0,62,95,39)+hill(-320,-110,90,90,36)+hill(55,-105,95,70,30);
}
const datumCache=new WeakMap<Dataset,number>();
export function datum(d:Dataset){let value=datumCache.get(d);if(value===undefined){value=d.terrain?Math.floor(d.terrain.values.reduce((a,b)=>Math.min(a,b),Infinity)/10)*10:0;datumCache.set(d,value)}return value}
export function elevation(d:Dataset,x:number,z:number){return d.terrain?sampleGrid(d.terrain,x,z):previewHeight(x,z)}
export function height(d:Dataset,x:number,z:number){const y=elevation(d,x,z);return y===null?null:y-datum(d)}
export function bounds(d:Dataset){const g=d.terrain;return g?{minX:g.minX,maxX:g.minX+(g.width-1)*g.step,minZ:g.minZ,maxZ:g.minZ+(g.height-1)*g.step}:PREVIEW_BOUNDS}
export function position(d:Dataset,l:Landmark):Vec3|null {
 if(!l.coordinates)return null;const [x,z]=toLocal(...l.coordinates),y=height(d,x,z);return y===null?null:[x,y,z];
}
export function pointInRing(x:number,z:number,ring:Vec3[]){let inside=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[i],b=ring[j];if((a[2]>z)!==(b[2]>z)&&x<(b[0]-a[0])*(z-a[2])/(b[2]-a[2])+a[0])inside=!inside}return inside}
export function inFeature(x:number,z:number,f:SceneFeature){return pointInRing(x,z,f.rings[0])&&!f.rings.slice(1).some(r=>pointInRing(x,z,r))}
export function distanceToSegment(x:number,z:number,a:Vec3,b:Vec3){const dx=b[0]-a[0],dz=b[2]-a[2],len=dx*dx+dz*dz,t=len?Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[2])*dz)/len)):0;return Math.hypot(x-a[0]-t*dx,z-a[2]-t*dz)}
