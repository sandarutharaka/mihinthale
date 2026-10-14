import {useEffect,useRef} from 'react';import type {ComponentRef} from 'react';
import {useFrame,useThree} from '@react-three/fiber';import {OrbitControls} from '@react-three/drei';import {Vector3,Spherical} from 'three';
import type {Dataset,Landmark,Vec3} from '../data/types.ts';import {bounds,height,position} from '../geo/landscape.ts';
export interface CameraCommand {id:number;type:'focus'|'overview'|'reset'|'left'|'right'|'in'|'out';landmark?:Landmark}
export interface CameraView {x:number;z:number;targetX:number;targetZ:number;bearing:number}
export default function CameraRig({data,command,onManual,onView,reduced}:{data:Dataset;command:CameraCommand;onManual:()=>void;onView:(v:CameraView)=>void;reduced:boolean}){
 const controls=useRef<ComponentRef<typeof OrbitControls>>(null);const {camera,invalidate}=useThree();
 const transition=useRef<{eye:Vector3;target:Vector3;fromEye:Vector3;fromTarget:Vector3;started:number}|null>(null),last=useRef(0);
 const callbacks=useRef({onManual,onView});callbacks.current={onManual,onView};
 useEffect(()=>{
 const c=controls.current;if(!c)return;
 const b=bounds(data),center=new Vector3((b.minX+b.maxX)/2,(height(data,(b.minX+b.maxX)/2,(b.minZ+b.maxZ)/2)??0)+12,(b.minZ+b.maxZ)/2);
 let target=center,eye=center.clone().add(new Vector3(510,480,650));
 if(command.type==='focus'&&command.landmark){const p=position(data,command.landmark);if(!p)return;target=new Vector3(...p);target.y+=command.landmark.viewpoint.targetHeight;eye=target.clone().add(new Vector3(...command.landmark.viewpoint.offset))}
 else if(['left','right','in','out'].includes(command.type)){
 callbacks.current.onManual();target=c.target.clone();const s=new Spherical().setFromVector3(camera.position.clone().sub(target));
 if(command.type==='left')s.theta-=0.22;if(command.type==='right')s.theta+=0.22;if(command.type==='in')s.radius=Math.max(12,s.radius*0.8);if(command.type==='out')s.radius=Math.min(1500,s.radius*1.25);eye=target.clone().add(new Vector3().setFromSpherical(s));
 }else if(command.type==='overview'){eye=center.clone().add(new Vector3(0,940,12))}
 transition.current={eye,target,fromEye:camera.position.clone(),fromTarget:c.target.clone(),started:performance.now()};invalidate();
 },[command,data,camera,invalidate]);
 useFrame((state)=>{
 const c=controls.current;if(!c)return;const wasTransition=Boolean(transition.current);
 if(transition.current){const {eye,target,fromEye,fromTarget,started}=transition.current;const progress=reduced?1:Math.min(1,(performance.now()-started)/1600),a=1-Math.pow(1-progress,3);c.enableDamping=false;camera.position.lerpVectors(fromEye,eye,a);c.target.lerpVectors(fromTarget,target,a);c.update();if(progress===1){transition.current=null;c.enableDamping=!reduced}else invalidate()}
 const b=bounds(data);const tx=Math.max(b.minX,Math.min(b.maxX,c.target.x)),tz=Math.max(b.minZ,Math.min(b.maxZ,c.target.z));
 camera.position.x+=tx-c.target.x;camera.position.z+=tz-c.target.z;c.target.x=tx;c.target.z=tz;
 const ground=height(data,tx,tz)??0;c.target.y=Math.max(ground,Math.min(220,c.target.y));
 const gx=Math.max(b.minX,Math.min(b.maxX,camera.position.x)),gz=Math.max(b.minZ,Math.min(b.maxZ,camera.position.z));
 camera.position.y=Math.max((height(data,gx,gz)??0)+5,camera.position.y);
 camera.lookAt(c.target);
 if((wasTransition&&!transition.current)||state.clock.elapsedTime-last.current>0.12){last.current=state.clock.elapsedTime;const dx=c.target.x-camera.position.x,dz=c.target.z-camera.position.z;callbacks.current.onView({x:camera.position.x,z:camera.position.z,targetX:c.target.x,targetZ:c.target.z,bearing:Math.atan2(dx,-dz)*180/Math.PI})}
 });
 const manual=()=>{transition.current=null;if(controls.current)controls.current.enableDamping=!reduced;callbacks.current.onManual();invalidate()};
 return <OrbitControls ref={controls} makeDefault enableDamping={!reduced} dampingFactor={0.09} minDistance={12} maxDistance={1500} minPolarAngle={0.035} maxPolarAngle={Math.PI/2-0.17} screenSpacePanning={false} zoomSpeed={0.7} rotateSpeed={0.55} panSpeed={0.65} onStart={manual}/>;
}
export const INITIAL_CAMERA:Vec3=[430,500,650];
