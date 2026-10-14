export type TourStatus='idle'|'playing'|'paused'|'finished';
export interface TourState {index:number;status:TourStatus}
export type TourAction={type:'START'|'PAUSE'|'RESUME'|'NEXT'|'PREVIOUS'|'MANUAL'|'STOP';count:number};
export const initialTour:TourState={index:0,status:'idle'};
export function tourReducer(state:TourState,action:TourAction):TourState {
 if(action.count===0||action.type==='STOP')return initialTour;
 switch(action.type){
 case 'START':return {index:0,status:'playing'};
 case 'RESUME':return {index:state.status==='finished'?0:state.index,status:'playing'};
 case 'MANUAL':case 'PAUSE':return state.status==='playing'?{...state,status:'paused'}:state;
 case 'NEXT':return state.index>=action.count-1?{...state,status:'finished'}:{...state,index:state.index+1};
 case 'PREVIOUS':return {index:Math.max(0,state.index-1),status:state.status==='finished'?'paused':state.status};
 }
}
export function selectionFromHash(hash:string,ids:string[]):string|null {
 const value=new URLSearchParams(hash.replace(/^#/, '')).get('landmark');return value&&ids.includes(value)?value:null;
}
