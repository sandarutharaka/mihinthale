/** Photo-informed geometry, not a measured scan. Units: metres; +Z is statue front. */
import fs from 'node:fs/promises';
import * as T from 'three';
import {mergeGeometries,mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
// GLTFExporter uses FileReader in browsers. This preparation-only adapter handles Blob buffers in Node.
globalThis.FileReader=class {readAsArrayBuffer(blob){blob.arrayBuffer().then(v=>{this.result=v;this.onloadend?.()})}readAsDataURL(blob){blob.arrayBuffer().then(v=>{this.result='data:'+blob.type+';base64,'+Buffer.from(v).toString('base64');this.onloadend?.()})}};
const parts={plaster:[],fold:[],shadow:[],base:[]};
function add(g,p=[0,0,0],s=[1,1,1],r=[0,0,0],mat='plaster') {g.scale(...s);g.applyMatrix4(new T.Matrix4().makeRotationFromEuler(new T.Euler(...r)));g.translate(...p);const flat=g.index?g.toNonIndexed():g;flat.deleteAttribute('uv');parts[mat].push(flat);}
function ellipsoid(p,s,mat='plaster',r=[0,0,0]){add(new T.SphereGeometry(1,Math.max(...s)<.2?8:Math.max(...s)<.7?16:32,Math.max(...s)<.2?6:Math.max(...s)<.7?10:24),p,s,r,mat)}
function tube(points,radii,mat='plaster',sides=12,steps=48){const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));const frames=curve.computeFrenetFrames(steps,false),v=[],idx=[];for(let i=0;i<=steps;i++){const t=i/steps,p=curve.getPointAt(t),ri=t*(radii.length-1),k=Math.min(radii.length-2,Math.floor(ri)),r=T.MathUtils.lerp(radii[k],radii[k+1],ri-k);for(let j=0;j<=sides;j++){const a=j/sides*Math.PI*2,o=frames.normals[i].clone().multiplyScalar(Math.cos(a)*r).addScaledVector(frames.binormals[i],Math.sin(a)*r);v.push(p.x+o.x,p.y+o.y,p.z+o.z);if(i<steps&&j<sides){const n=i*(sides+1)+j;idx.push(n,n+1,n+sides+1,n+1,n+sides+2,n+sides+1)}}}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(v,3));g.setIndex(idx);g.computeVertexNormals();add(g,[0,0,0],[1,1,1],[0,0,0],mat);ellipsoid(points[0],[radii[0],radii[0],radii[0]],mat);const end=radii.at(-1);ellipsoid(points.at(-1),[end,end,end],mat)}
function loft(profile,mat='plaster'){const c=new T.CatmullRomCurve3(profile.map(p=>new T.Vector3(...p))),v=[],idx=[],rows=profile.length===11?180:70,sides=64;for(let i=0;i<=rows;i++){const p=c.getPoint(i/rows);for(let j=0;j<=sides;j++){const a=j/sides*Math.PI*2,x=p.x*Math.sin(a),robe=profile.length===11&&p.y>5&&p.y<10.9&&Math.cos(a)>0&&p.y<9.3+x*.65?Math.pow(Math.max(0,Math.sin((p.y-.3*x-.05*x*x)*21)),4)*.035:0;v.push(x,p.y,p.z*Math.cos(a)+robe);if(i<rows&&j<sides){const n=i*(sides+1)+j;idx.push(n,n+1,n+sides+1,n+1,n+sides+2,n+sides+1)}}}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(v,3));g.setIndex(idx);g.computeVertexNormals();add(g,[0,0,0],[1,1,1],[0,0,0],mat)}
// Layered plinth and elongated lotus seat.
add(new T.BoxGeometry(15.4,.65,10.4),[0,.325,0],[1,1,1],[0,0,0],'base');
for(const [r,h,y] of [[6.4,.45,.88],[6.15,.6,1.4],[6.45,.22,1.81]])add(new T.CylinderGeometry(r,r,h,80),[0,y,0],[1,1,.70]);
for(let i=0;i<36;i++){const a=i/36*Math.PI*2;ellipsoid([Math.sin(a)*6.05,1.5,Math.cos(a)*4.24],[.51,.48,.17],'plaster',[0,a,0]);}
// Seated body with shoulders/waist shaped as a continuous elliptical surface.
loft([[0,2.0,0],[2.5,2.4,1.6],[2.5,5.3,1.55],[2.1,6.5,1.35],[2.25,8.0,1.50],[2.9,10.1,1.65],[3.15,10.9,1.35],[2.6,11.6,.95],[1.03,12.0,.8],[.9,12.9,.8],[0,13.0,0]]);
// Crossed legs: broad knees, tapering shins and visible feet.
tube([[-1.2,3.9,-.2],[-4.4,3.8,.35],[-5.35,3.1,1.4],[-3.7,2.85,2.4],[0,2.9,2.9],[3.1,3.15,1.9]],[1.4,1.1,.8,.52], 'plaster',20,72);
tube([[1.2,3.9,-.2],[4.4,3.7,.3],[5.1,3.05,1.65],[2.8,3.1,2.8],[-.7,3.8,2.6],[-2.8,4.1,1.4]],[1.45,1.08,.75,.5], 'plaster',20,72);
ellipsoid([2.6,3.65,1.55],[1.3,.5,.68],'plaster',[0,-.4,.15]);ellipsoid([-1.5,4.0,2.3],[1.25,.48,.62],'plaster',[0,.3,-.12]);
for(let i=0;i<5;i++)ellipsoid([3.4+i*.12,3.67,1.03+i*.23],[.32-i*.025,.21,.13]);
// Left arm (viewer's right) flows from shoulder to lap.
tube([[2.65,10.8,0],[3.3,9.5,.2],[3.65,7.1,.6],[3.65,5.55,1.1],[2.4,4.9,2.0],[1.25,4.85,2.45]],[1.02,.83,.65,.48], 'plaster',20,64);
ellipsoid([1.6,4.92,2.45],[1.2,.4,.66]);for(let i=0;i<4;i++)tube([[1.85,4.98+i*.065,2.35+i*.19],[.7,4.95+i*.05,2.55+i*.17],[.3,4.93+i*.05,2.47+i*.17]],[.15,.15,.06], 'plaster',8,14);
// Right arm: bent elbow and raised teaching gesture (thumb/index circle).
tube([[-2.6,10.8,.15],[-3.35,9.6,.35],[-3.65,7.35,.8],[-3.5,6.6,1.3],[-3.15,7.35,2],[-2.95,9.1,2.5],[-2.9,10.5,2.55]],[.98,.8,.65,.46], 'plaster',20,64);
ellipsoid([-2.86,11.08,2.52],[.60,.86,.29],'plaster',[0,0,.08]);
for(let i=0;i<3;i++){const x=-3.3+i*.26;const top=12.75+(i===1?.15:0)-i*.1;tube([[x,11.25,2.52],[x-.05,12.15,2.60],[x+.06,top,2.40],[x+.10,top+.02,2.29]],[.17,.15,.10], 'plaster',10,24)}
tube([[-2.6,11.6,2.5],[-2.27,11.8,2.7],[-2.11,11.48,2.88],[-2.3,11.13,2.9],[-2.65,11.1,2.69]],[.16,.16,.11], 'plaster',12,32);
tube([[-2.44,10.5,2.6],[-2.15,10.75,2.9],[-2.2,11.15,2.9]],[.23,.18,.12], 'plaster',12,24);
// Head with broader forehead, tapered chin, smooth cheeks. +Z faces visitor.
loft([[0,12.2,0],[.65,12.4,.62],[1.08,12.85,.99],[1.39,13.5,1.15],[1.55,14.4,1.18],[1.53,15.1,1.08],[1.35,15.65,.94],[.72,16.0,.6],[0,16.15,0]]);
ellipsoid([0,14.12,1.12],[.25,.67,.25]);ellipsoid([0,13.86,1.4],[.30,.20,.26]);
for(const sign of [-1,1]){
 ellipsoid([sign*.23,13.83,1.32],[.17,.13,.20]);ellipsoid([sign*.2,13.76,1.47],[.075,.034,.04],'shadow');
 ellipsoid([sign*.66,14.42,1.06],[.48,.22,.13]);
 tube([[sign*.22,14.4,1.13],[sign*.58,14.34,1.24],[sign*.96,14.38,1.11]],[.035,.04,.015],'shadow',8,24);
 tube([[sign*.2,14.68,1.14],[sign*.6,14.85,1.16],[sign*1.05,14.65,.94]],[.09,.11,.025],'plaster',10,24);
 ellipsoid([sign*1.55,13.90,0],[.28,.85,.25]);
 tube([[sign*1.52,14.5,.14],[sign*1.76,14.25,.16],[sign*1.69,13.55,.20],[sign*1.5,12.76,.21],[sign*1.43,13.4,.22]],[.12,.11,.075], 'plaster',10,36);
}
tube([[-.52,13.40,1.11],[-.22,13.46,1.23],[0,13.4,1.26],[.22,13.46,1.23],[.52,13.40,1.11]],[.035,.035,.025],'shadow',8,32);
ellipsoid([0,13.3,1.13],[.43,.12,.18]);ellipsoid([0,15.1,1.06],[.065,.065,.03]);
// Sculpted hair curls follow cap surface, not a separate round ball head.
for(let row=0;row<10;row++){const yy=15.03+row*.12;const profile=[[15.03,1.57,1.12],[15.65,1.43,1.02],[16,.79,.67],[16.16,.16,.14]];let low=profile[0],hi=profile[1];for(let k=1;k<profile.length;k++)if(yy>=profile[k-1][0]&&yy<=profile[k][0]){low=profile[k-1];hi=profile[k];break}const t=(yy-low[0])/(hi[0]-low[0]),rx=T.MathUtils.lerp(low[1],hi[1],t),rz=T.MathUtils.lerp(low[2],hi[2],t),count=Math.max(8,Math.round(rx*34));for(let j=0;j<count;j++){const a=j/count*Math.PI*2+row*.09;ellipsoid([rx*Math.sin(a),yy,rz*Math.cos(a)],[.11,.10,.11])}}
ellipsoid([0,16.25,0],[.37,.46,.34]);
// Robe folds follow the actual torso surface, so they do not float through the chest.
const torsoCurve=new T.CatmullRomCurve3([[0,2.0,0],[2.5,2.4,1.6],[2.5,5.3,1.55],[2.1,6.5,1.35],[2.25,8.0,1.50],[2.9,10.1,1.65],[3.15,10.9,1.35],[2.6,11.6,.95],[1.03,12.0,.8],[.9,12.9,.8],[0,13.0,0]].map(p=>new T.Vector3(...p)));
const samples=torsoCurve.getPoints(500);function torsoZ(x,y){const p=samples.reduce((best,p)=>Math.abs(p.y-y)<Math.abs(best.y-y)?p:best);return p.z*Math.sqrt(Math.max(0,1-(x/p.x)**2))+.027;}
for(let i=0;i<12;i++){const lower=5.7+i*.27;const pts=Array.from({length:30},(_,j)=>{const t=j/29,x=-1.9+4.5*t,y=lower+Math.pow(t,2.6)*(11.1-lower);return [x,y,torsoZ(x,y)]});tube(pts,[.02,.027,.014],'plaster',6,44);}
// Fine drapery ridges laid onto the torso and legs, following the one-shoulder robe.
for(let i=0;i<16;i++){const x=-4.4+i*.55;tube([[x,3.7,2.30],[x+.3,3.25,2.87],[x+.4,2.9,3.1]],[.025,.035,.014],'fold',6,16)}
const group=new T.Group();group.name='Mihintale_Buddha_photo_interpretation';
const mats={plaster:new T.MeshStandardMaterial({color:'#eeeae1',roughness:.82}),fold:new T.MeshStandardMaterial({color:'#dfddd3',roughness:.93}),shadow:new T.MeshStandardMaterial({color:'#9b9b92',roughness:1}),base:new T.MeshStandardMaterial({color:'#b4afa0',roughness:1})};
for(const [name,geos] of Object.entries(parts)){const geo=mergeVertices(mergeGeometries(geos),0.00001);geo.computeBoundingSphere();const normal=geo.attributes.normal;for(let i=0;i<normal.count;i++){const v=new T.Vector3().fromBufferAttribute(normal,i);if(v.lengthSq()<.1)v.set(0,1,0);else v.normalize();normal.setXYZ(i,v.x,v.y,v.z)}const mesh=new T.Mesh(geo,mats[name]);mesh.name=name;mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh)}
group.userData={accuracy:'Photo-informed artistic interpretation. Not photogrammetry or surveyed geometry.',reference:'references/mihintale/photos/The_Buddha_at_Mihintale__Sri_Lanka.JPG',referenceAuthor:'Ranabolt',referenceLicense:'Public domain'};
const buffer=await new GLTFExporter().parseAsync(group,{binary:true});await fs.mkdir('public/models',{recursive:true});await fs.writeFile('public/models/mihintale-buddha.glb',Buffer.from(buffer));console.log('Exported Buddha GLB',buffer.byteLength,'bytes');
