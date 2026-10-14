import GroundMaterial from './GroundMaterial';
import BuddhaAsset from './BuddhaAsset';
import type { Landmark } from '../data/types.ts';
const white='#f1eee1', stone='#b1a78b';
function Drum({r,h,y,color=white}:{r:number;h:number;y:number;color?:string}){return <mesh castShadow receiveShadow position={[0,y,0]}><cylinderGeometry args={[r,r,h,48]}/><meshStandardMaterial color={color} roughness={0.85}/></mesh>}
function Stupa({small=false}:{small?:boolean}){
 const r=small?6.4:20.5;
 return <group>
 <Drum r={r*1.2} h={1} y={0.5} color={stone}/>
 {[0,1,2].map(i=><Drum key={i} r={r*(1.12-i*0.055)} h={small?0.55:0.9} y={1+i*(small?0.55:0.9)}/>)}
 <mesh castShadow receiveShadow position={[0,small?2.1:3,0]}><sphereGeometry args={[r,48,24,0,Math.PI*2,0,Math.PI/2]}/><meshStandardMaterial color={white} roughness={0.82}/></mesh>
 <mesh castShadow position={[0,r+(small?2.9:4.3),0]}><boxGeometry args={[r*0.38,small?1.7:3,r*0.38]}/><meshStandardMaterial color={white}/></mesh>
 <Drum r={r*0.14} h={small?1.7:3} y={r+(small?4.1:7)}/>{Array.from({length:small?15:22},(_,i)=><Drum key={'spire'+i} r={r*.15*(1-i/(small?16:23))+.03} h={small?.11:.16} y={r+(small?4.5:8)+i*(small?.38:.61)}/>)}
 <mesh castShadow position={[0,r+(small?7.4:15),0]}><coneGeometry args={[r*0.15,small?6:14,32]}/><meshStandardMaterial color={white}/></mesh>
 <mesh position={[0,r+(small?10.7:22.5),0]}><sphereGeometry args={[small?0.3:0.6,12,8]}/><meshStandardMaterial color="#bd9950" metalness={0.45} roughness={0.4}/></mesh>
 {small&&Array.from({length:16},(_,i)=>{const a=i*Math.PI/8;return <group key={i} position={[Math.cos(a)*10.5,0,Math.sin(a)*10.5]}><mesh castShadow position={[0,3.5,0]}><boxGeometry args={[.55,7,.55]}/><GroundMaterial color="#a49d8b"/></mesh><mesh castShadow position={[0,7.2,0]}><cylinderGeometry args={[.58,.35,.55,8]}/><GroundMaterial color="#a49d8b"/></mesh><mesh position={[0,.3,0]}><boxGeometry args={[.85,.4,.85]}/><GroundMaterial color="#a49d8b"/></mesh></group>})}
 </group>
}
function Rock(){return <group>
 <mesh castShadow receiveShadow position={[0,5,0]} scale={[19,12,13]} rotation={[0,0.3,0.1]}><dodecahedronGeometry args={[1,1]}/><meshStandardMaterial color="#b5b3a4" roughness={1} flatShading/></mesh>
 {Array.from({length:8},(_,i)=><mesh key={i} position={[-7+i*2,15.7,-1]}><cylinderGeometry args={[0.09,0.09,1.8,5]}/><meshStandardMaterial color="#4d5149"/></mesh>)}
 <mesh position={[0,16.4,-1]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[0.09,0.09,14,6]}/><meshStandardMaterial color="#4d5149"/></mesh>
 </group>}
function Ruin(){return <group>
 {[0,1,2].map(i=><Drum key={i} r={20-i*1.3} h={1.3} y={0.65+i*1.3} color={i===0?'#9f957b':'#9b8263'}/>)}
 <mesh castShadow receiveShadow position={[0,3.9,0]} scale={[1,.47,1]}><sphereGeometry args={[16.8,40,16,0,Math.PI*2,0,Math.PI/2]}/><GroundMaterial color="#977e61"/></mesh>
 {[0,1,2,3].map(i=><group key={i} rotation={[0,i*Math.PI/2,0]}><mesh castShadow position={[0,2.5,20]}><boxGeometry args={[7,5,2.4]}/><meshStandardMaterial color="#b4a68a"/></mesh><mesh position={[0,5.3,20]}><boxGeometry args={[7.5,0.6,2.9]}/><meshStandardMaterial color={stone}/></mesh></group>)}
 </group>}
function Pond(){return <group>
 <mesh receiveShadow position={[0,0.2,0]} scale={[18,0.7,6]}><sphereGeometry args={[1,32,12]}/><meshStandardMaterial color="#817e68" roughness={1}/></mesh>
 <mesh position={[0,0.7,0]} rotation={[-Math.PI/2,0,0]} scale={[16,4.8,1]}><circleGeometry args={[1,48]}/><meshStandardMaterial color="#526e66" roughness={0.5}/></mesh>
 <mesh castShadow position={[0,3,-5]} scale={[18,5,3]}><dodecahedronGeometry args={[1,1]}/><meshStandardMaterial color="#a19e8c" roughness={1}/></mesh>
 </group>}
export default function LandmarkModel({model}:{model:Landmark['model']}){
 switch(model){case 'maha':return <Stupa/>;case 'ambasthala':return <Stupa small/>;case 'buddha':return <BuddhaAsset/>;case 'rock':return <Rock/>;case 'ruin':return <Ruin/>;case 'pond':return <Pond/>;case 'mapped-ruin':return null;case 'stairs':return null}
}
