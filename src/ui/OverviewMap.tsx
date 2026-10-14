import {useMemo} from 'react';import type {Dataset,Landmark,Language} from '../data/types';import {bounds,height,position} from '../geo/landscape';import {textFor} from '../data/translations';import type {CameraView} from '../controls/CameraRig';
export default function OverviewMap({data,landmarks,selected,view,lang,onSelect}:{data:Dataset;landmarks:Landmark[];selected:string|null;view:CameraView;lang:Language;onSelect:(id:string)=>void}){
 const t=textFor(lang),b=bounds(data);const xy=(x:number,z:number)=>[14+(x-b.minX)/(b.maxX-b.minX)*172,22+(z-b.minZ)/(b.maxZ-b.minZ)*122];
 const tiles=useMemo(()=>Array.from({length:24*18},(_,i)=>{const c=i%24,r=Math.floor(i/24),x=b.minX+(c+0.5)/24*(b.maxX-b.minX),z=b.minZ+(r+0.5)/18*(b.maxZ-b.minZ);return {x:14+c*172/24,y:22+r*122/18,h:height(data,x,z)??0}}),[data,b.minX,b.maxX,b.minZ,b.maxZ]);
 const cam=xy(view.x,view.z),cx=Math.max(15,Math.min(185,cam[0])),cy=Math.max(23,Math.min(143,cam[1]));
 return <section className="overview-map glass" aria-label={t.overviewMap}><div className="map-title"><span>{t.overviewMap}</span><b>{t.north} ↑</b></div><svg data-camera-x={view.x} data-camera-z={view.z} data-target-x={view.targetX} data-target-z={view.targetZ} viewBox="0 0 200 164" aria-label={t.overviewMap}>
 <rect x="14" y="22" width="172" height="122" rx="5" fill="#394c39"/>
 {tiles.map((v,i)=><rect key={i} x={v.x} y={v.y} width={172/24+0.4} height={122/18+0.4} fill={'hsl(90 16% '+Math.min(48,20+v.h*0.16)+'%)'}/>)}
 {data.features.filter(f=>f.kind==='path'||f.kind==='steps').flatMap(f=>f.rings.map((r,i)=><polyline key={f.id+i} points={r.map(p=>xy(p[0],p[2]).join(',')).join(' ')} fill="none" stroke="#bdc3a4" strokeWidth="0.6"/>))}
 <g transform={'translate('+cx+','+cy+') rotate('+view.bearing+')'}><path d="M0 0 -9 -23 9 -23Z" fill="#cfdbc2" opacity="0.22"/><path d="m0-6 4 11-4-2-4 2Z" fill="#e8ecdf"/></g>
 {landmarks.map(l=>{const p=position(data,l);if(!p)return null;const [x,y]=xy(p[0],p[2]);return <g key={l.id}><circle cx={x} cy={y} r={l.id===selected?6:3.5} fill={l.id===selected?'#e8c372':'#d8dfce'} stroke="#1e352d" strokeWidth="1.5"/><circle cx={x} cy={y} r="10" fill="transparent" role="button" tabIndex={0} aria-label={l.name[lang]} onClick={()=>onSelect(l.id)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect(l.id)}}}/></g>})}
 <path d="M14 153h20m-20-2v4m20-4v4" stroke="#c9d0be"/><text x="40" y="156" fill="#c9d0be" fontSize="7">{Math.round((b.maxX-b.minX)*20/172)} m</text>
 </svg></section>
}
