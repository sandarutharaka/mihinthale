import type { HeightGrid } from '../geo/elevation.ts';
export type Language='en'|'si';
export type Bilingual={en:string;si:string};
export type Vec3=[number,number,number];
export interface Source {label:string;url:string}
export interface Landmark {
 id:string;name:Bilingual;category:Bilingual;description:Bilingual;
 coordinates:[number,number]|null;coordinateSource:Source|null;coordinateStatus:'published'|'mapped'|'pending';
 model:'maha'|'ambasthala'|'rock'|'buddha'|'stairs'|'ruin'|'pond'|'mapped-ruin';
 modelAccuracy:Bilingual;references:Source[];viewpoint:{offset:Vec3;targetHeight:number};
}
export interface SceneFeature {id:string;kind:'path'|'steps'|'building'|'water'|'rock'|'wood';rings:Vec3[][];name?:string;tags:Record<string,string>}
export interface Dataset {
 schemaVersion:1;status:'ready'|'preview';origin:[number,number];crs:'EPSG:32644';verticalDatum:string;verticalExaggeration:1;
 terrain:HeightGrid|null;features:SceneFeature[];generatedAt:string|null;
 sources:{name:string;url:string;license:string;retrievedAt:string;sha256?:string}[];
 warnings:string[];stats?:Record<string,number>;
}
