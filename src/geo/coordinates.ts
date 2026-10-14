/** WGS84 / UTM zone 44N (EPSG:32644). Snyder transverse Mercator series.
 * Local render axes: x=easting-originE, z=originN-northing, y=elevation-datum.
 * Only the northern zone 44 footprint is supported, not a general GIS library. */
export const ORIGIN: [number, number] = [80.517, 8.351];
export const BBOX = [80.512, 8.348, 80.520, 8.354] as const; // W,S,E,N
export const CRS = 'EPSG:32644';
const A=6378137, E2=0.0066943799901413165, EP2=E2/(1-E2), K=0.9996;
const radians=Math.PI/180;
export function toUTM(lon:number, lat:number):[number,number] {
 if(!Number.isFinite(lon)||!Number.isFinite(lat)||lon<78||lon>84||lat<0||lat>84) throw new Error('Coordinate outside supported UTM zone 44N');
 const p=lat*radians, l=(lon-81)*radians, s=Math.sin(p), c=Math.cos(p), t=Math.tan(p);
 const n=A/Math.sqrt(1-E2*s*s), T=t*t, C=EP2*c*c, a=c*l;
 const m=A*((1-E2/4-3*E2**2/64-5*E2**3/256)*p-(3*E2/8+3*E2**2/32+45*E2**3/1024)*Math.sin(2*p)+(15*E2**2/256+45*E2**3/1024)*Math.sin(4*p)-(35*E2**3/3072)*Math.sin(6*p));
 return [500000+K*n*(a+(1-T+C)*a**3/6+(5-18*T+T*T+72*C-58*EP2)*a**5/120), K*(m+n*t*(a*a/2+(5-T+9*C+4*C*C)*a**4/24+(61-58*T+T*T+600*C-330*EP2)*a**6/720))];
}
export function fromUTM(e:number,n:number):[number,number] {
 const m=n/K, mu=m/(A*(1-E2/4-3*E2**2/64-5*E2**3/256)), e1=(1-Math.sqrt(1-E2))/(1+Math.sqrt(1-E2));
 const p=mu+(3*e1/2-27*e1**3/32)*Math.sin(2*mu)+(21*e1**2/16-55*e1**4/32)*Math.sin(4*mu)+(151*e1**3/96)*Math.sin(6*mu)+(1097*e1**4/512)*Math.sin(8*mu);
 const c=Math.cos(p),t=Math.tan(p),T=t*t,C=EP2*c*c,N=A/Math.sqrt(1-E2*Math.sin(p)**2),R=A*(1-E2)/(1-E2*Math.sin(p)**2)**1.5,D=(e-500000)/(N*K);
 const lat=p-N*t/R*(D**2/2-(5+3*T+10*C-4*C*C-9*EP2)*D**4/24+(61+90*T+298*C+45*T*T-252*EP2-3*C*C)*D**6/720);
 const lon=(D-(1+2*T+C)*D**3/6+(5-2*C+28*T-3*C*C+8*EP2+24*T*T)*D**5/120)/c;
 return [81+lon/radians,lat/radians];
}
export const UTM_ORIGIN=toUTM(...ORIGIN);
export function toLocal(lon:number,lat:number):[number,number] {
 const [e,n]=toUTM(lon,lat); return [e-UTM_ORIGIN[0], UTM_ORIGIN[1]-n || 0];
}
export function fromLocal(x:number,z:number):[number,number] {return fromUTM(x+UTM_ORIGIN[0],UTM_ORIGIN[1]-z)}
