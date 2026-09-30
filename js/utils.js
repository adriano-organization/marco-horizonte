export const esc = value => String(value??'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const known = value => !!value && !String(value).includes('[A PREENCHER]');
export function safeUrl(value){try{const u=new URL(value,location.href);return ['http:','https:'].includes(u.protocol)?u.href:'#';}catch{return '#';}}
export function localDate(now=new Date(),zone='Europe/Lisbon'){const p=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now).map(p=>[p.type,p.value]));return {date:`${p.year}-${p.month}-${p.day}`,day:new Date(`${p.year}-${p.month}-${p.day}T12:00:00Z`).getUTCDay(),minutes:+p.hour*60 + +p.minute};}
const mins=t=>{if(!/^\d{2}:\d{2}$/.test(t))return NaN;const [h,m]=t.split(':').map(Number);return h<24&&m<60?h*60+m:NaN;};
export function openingStatus(store,now=new Date()){
 const h=store.horario;if(!h)return 'desconhecido';const x=localDate(now,h.fuso);const previous=new Date(`${x.date}T12:00:00Z`);previous.setUTCDate(previous.getUTCDate()-1);const pd=previous.toISOString().slice(0,10);const dayBefore=(x.day+6)%7;
 const get=(date,day)=>Object.hasOwn(h.excecoes||{},date)?h.excecoes[date]:h.semana?.[day];
 const today=get(x.date,x.day),yesterday=get(pd,dayBefore);
 if(!Array.isArray(today))return 'desconhecido';
 if(today.some(([a,b])=>{const s=mins(a),e=mins(b);return e>s?x.minutes>=s&&x.minutes<e:x.minutes>=s&&s!==e;}))return 'aberto';
 if(Array.isArray(yesterday)&&yesterday.some(([a,b])=>mins(b)<mins(a)&&x.minutes<mins(b)))return 'aberto';
 return 'fechado';
}
export function leafletActive(f,now=new Date()){const d=localDate(now).date;return !!f.caminho&&/^\d{4}-\d{2}-\d{2}$/.test(f.inicio||'')&&/^\d{4}-\d{2}-\d{2}$/.test(f.fim||'')&&f.inicio<=d&&d<=f.fim;}
export const coordinates=s=>Number.isFinite(s.coordenadas?.lat)&&Number.isFinite(s.coordenadas?.lng)&&Math.abs(s.coordenadas.lat)<=90&&Math.abs(s.coordenadas.lng)<=180;
export function loadScript(src){return new Promise((resolve,reject)=>{const el=document.createElement('script');el.src=src;el.onload=resolve;el.onerror=()=>{el.remove();reject(new Error('CDN unavailable'));};document.head.append(el);});}
