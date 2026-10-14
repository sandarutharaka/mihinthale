import MappedDetails from './MappedDetails';
import {Suspense,lazy,useEffect} from 'react';import {Canvas,useThree} from '@react-three/fiber';import {Html} from '@react-three/drei';
import type {Dataset,Landmark,Language} from '../data/types.ts';import {position} from '../geo/landscape.ts';import {textFor} from '../data/translations.ts';
import Terrain from './Terrain';import Vegetation from './Vegetation';import MapFeatures from './MapFeatures';import CameraRig,{INITIAL_CAMERA} from '../controls/CameraRig';import type {CameraCommand,CameraView} from '../controls/CameraRig';
const LandmarkModel=lazy(()=>import('./LandmarkModels'));
export interface SceneProps {data:Dataset;landmarks:Landmark[];selected:string|null;lang:Language;labels:boolean;paths:boolean;command:CameraCommand;onSelect:(id:string)=>void;onManual:()=>void;onView:(view:CameraView)=>void;onFailure:()=>void;reduced:boolean}
function ContextLoss({onFailure}:{onFailure:()=>void}){const {gl}=useThree();useEffect(()=>{const canvas=gl.domElement;const lost=(e:Event)=>{e.preventDefault();onFailure()};canvas.addEventListener('webglcontextlost',lost);return ()=>canvas.removeEventListener('webglcontextlost',lost)},[gl,onFailure]);return null}
export default function ExplorerScene(props:SceneProps){
 const {data,landmarks,selected,lang,labels,paths,command,onSelect,onManual,onView,onFailure,reduced}=props;const mobile=matchMedia('(max-width: 760px)').matches;const t=textFor(lang);
 return <Canvas className="scene-canvas" frameloop="demand" dpr={[1,mobile?1.25:1.75]} shadows={!mobile} gl={{antialias:true,alpha:false,powerPreference:'high-performance'}} camera={{position:INITIAL_CAMERA,fov:40,near:1,far:4000}} aria-label={t.explorer}>
 <color attach="background" args={['#b7c5b5']}/><fog attach="fog" args={['#b7c5b5',1200,2600]}/>
 <hemisphereLight args={['#fcf6df','#657767',1.5]}/><directionalLight position={[-220,600,340]} intensity={2} color="#fff2d4" castShadow={!mobile} shadow-mapSize={[1024,1024]} shadow-camera-left={-550} shadow-camera-right={550} shadow-camera-top={450} shadow-camera-bottom={-450} shadow-camera-far={1500} shadow-normalBias={1.8}/>
 <Terrain data={data}/><MapFeatures data={data} paths={paths}/><MappedDetails data={data} paths={paths}/><Vegetation data={data} landmarks={landmarks}/>
 <Suspense fallback={null}>{landmarks.map((l,index)=>{const p=position(data,l);if(!p)return null;const active=l.id===selected;const labelHeight=l.model==='maha'?49:l.model==='buddha'?24:l.model==='ambasthala'?26:25;return <group key={l.id} position={p}>
 <group onClick={e=>{e.stopPropagation();onSelect(l.id)}} onPointerOver={e=>{e.stopPropagation();document.body.style.cursor='pointer'}} onPointerOut={()=>{document.body.style.cursor='auto'}}>{!(l.model==='pond'&&data.features.some(f=>f.id.startsWith('way/390565267')))&&<LandmarkModel model={l.model}/>}</group>
 {active&&<mesh position={[0,0.9,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[l.model==='maha'?27:23,l.model==='maha'?28:24,64]}/><meshBasicMaterial color="#e4bd66" transparent opacity={0.85} depthWrite={false}/></mesh>}
 {labels&&<Html position={[0,labelHeight,0]} center zIndexRange={[15,0]} occlude={false}><button className={'landmark-marker '+(active?'selected':'')} onClick={()=>onSelect(l.id)} aria-pressed={active}><span>{String(index+1).padStart(2,'0')}</span>{l.name[lang]}</button></Html>}
 </group>})}</Suspense>
 <CameraRig data={data} command={command} onManual={onManual} onView={onView} reduced={reduced}/><ContextLoss onFailure={onFailure}/>
 </Canvas>
}
