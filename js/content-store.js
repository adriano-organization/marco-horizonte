export const CONTENT_KEY='marco-horizonte-content-v1';
const empty=()=>({version:1,stores:{},updatedAt:null});
const time=value=>typeof value==='string'&&/^([01]\d|2[0-3]):[0-5]\d$/.test(value);
function validStore(value,id){
 if(!value||typeof value!=='object'||value.id!==id||typeof value.nome!=='string'||!value.nome.trim()||typeof value.morada!=='string'||typeof value.descricao!=='string'||typeof value.telefone!=='string'||typeof value.email!=='string')return false;
 if(!Number.isFinite(value.coordenadas?.lat)||!Number.isFinite(value.coordenadas?.lng)||Math.abs(value.coordenadas.lat)>90||Math.abs(value.coordenadas.lng)>180)return false;
 if(!Array.isArray(value.servicos)||!value.servicos.every(s=>typeof s==='string')||!Array.isArray(value.fotos)||!value.fotos.every(p=>p&&typeof p.src==='string'&&typeof p.alt==='string'))return false;
 const week=value.horario?.semana;if(!week||typeof week!=='object')return false;
 return Array.from({length:7},(_,day)=>week[day]).every(slots=>slots===null||(Array.isArray(slots)&&slots.every(slot=>Array.isArray(slot)&&slot.length===2&&slot.every(time))));
}
export function readContent(){
 try{const value=JSON.parse(localStorage.getItem(CONTENT_KEY)||'null');if(value?.version!==1||!value.stores||typeof value.stores!=='object'||Array.isArray(value.stores))return empty();return {version:1,stores:Object.fromEntries(Object.entries(value.stores).filter(([id,s])=>validStore(s,id))),updatedAt:Number.isFinite(Date.parse(value.updatedAt))?value.updatedAt:null};}catch{return empty();}
}
function notify(){if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent('mh:content-updated'));}
export function saveStore(store){
 if(!validStore(store,store?.id)||!String(store.id||'').trim())throw Error('Verifique o nome, a morada, as coordenadas e os horários da loja.');
 const content=readContent();content.stores[String(store.id)]=JSON.parse(JSON.stringify(store));content.updatedAt=new Date().toISOString();localStorage.setItem(CONTENT_KEY,JSON.stringify(content));notify();return content;
}
export function removeStoreOverride(id){const content=readContent();delete content.stores[String(id)];content.updatedAt=new Date().toISOString();localStorage.setItem(CONTENT_KEY,JSON.stringify(content));notify();return content;}
export function resetContent(){localStorage.removeItem(CONTENT_KEY);notify();}
export function applyStoreOverrides(baseStores){const {stores}=readContent();return baseStores.map(base=>{const changed=Object.hasOwn(stores,String(base.id))?stores[String(base.id)]:null;return changed&&typeof changed==='object'&&changed.id===base.id?{...base,...changed,id:base.id,slug:base.slug}:base;});}
export function getContentSummary(){const value=readContent();return {editedStores:Object.keys(value.stores).length,updatedAt:value.updatedAt};}
