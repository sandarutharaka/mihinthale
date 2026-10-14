export interface HeightGrid {width:number;height:number;minX:number;minZ:number;step:number;values:number[]}
function bilinear(data:ArrayLike<number>,width:number,height:number,x:number,y:number):number|null {
 if(!Number.isFinite(x)||!Number.isFinite(y)||x<0||y<0||x>width-1||y>height-1)return null;
 const x0=Math.floor(x), y0=Math.floor(y), x1=Math.min(x0+1,width-1), y1=Math.min(y0+1,height-1), tx=x-x0,ty=y-y0;
 const cells=[data[y0*width+x0],data[y0*width+x1],data[y1*width+x0],data[y1*width+x1]];
 const weights=[(1-tx)*(1-ty),tx*(1-ty),(1-tx)*ty,tx*ty];
 let v=0; for(let i=0;i<4;i++){if(weights[i]>0&&!Number.isFinite(cells[i]))return null; if(weights[i]>0)v+=cells[i]*weights[i]}
 return v;
}
export function sampleGrid(g:HeightGrid,x:number,z:number):number|null {return bilinear(g.values,g.width,g.height,(x-g.minX)/g.step,(z-g.minZ)/g.step)}
/** Origin is GeoTIFF tiepoint, signed resolutions retained. PixelIsArea samples are at cell centers. */
export function sampleRaster(data:ArrayLike<number>,width:number,height:number,ox:number,oy:number,rx:number,ry:number,x:number,y:number,pixelIsArea:boolean):number|null {
 return bilinear(data,width,height,(x-ox)/rx-(pixelIsArea?0.5:0),(y-oy)/ry-(pixelIsArea?0.5:0));
}
/** Fill nearest valid samples by deterministic multi-source BFS; caller enforces a missing-data budget. */
export function fillNoData(input:ArrayLike<number>,width:number,height:number):{values:number[];filled:number} {
 if(width*height!==input.length)throw new Error('Raster dimensions do not match samples');
 const values=Array.from(input), queue:number[]=[]; let filled=0;
 for(let i=0;i<values.length;i++)if(Number.isFinite(values[i]))queue.push(i);else filled++;
 if(!queue.length)throw new Error('Raster has no valid elevation samples');
 for(let q=0;q<queue.length;q++){
 const i=queue[q],x=i%width,y=Math.floor(i/width);
 const ns=[x>0?i-1:-1,x<width-1?i+1:-1,y>0?i-width:-1,y<height-1?i+width:-1];
 for(const j of ns)if(j>=0&&!Number.isFinite(values[j])){values[j]=values[i];queue.push(j)}
 }
 return {values,filled};
}
