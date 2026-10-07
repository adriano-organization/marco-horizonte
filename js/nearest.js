import {esc as e} from './utils.js?v=20261007-4';

const pointIsValid = point => Number.isFinite(point?.lat) && Number.isFinite(point?.lng) && Math.abs(point.lat) <= 90 && Math.abs(point.lng) <= 180;
export function distanceKm(a, b) {
 if (!pointIsValid(a) || !pointIsValid(b)) return Infinity;
 const rad = value => value * Math.PI / 180;
 const h = Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2;
 return 6371 * 2 * Math.atan2(Math.sqrt(Math.min(1, h)), Math.sqrt(Math.max(0, 1 - h)));
}
export const normalizeQuery = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
export function expandStreet(query) {
 return String(query ?? '').trim().replace(/\b(\d{4})[ -]?(\d{3})\b/g, '$1-$2')
  .replace(/^r\.\s*/i, 'Rua ').replace(/^av[ª.]?\s+/i, 'Avenida ').replace(/^trav?\.\s*/i, 'Travessa ')
  .replace(/^estr?\.\s*/i, 'Estrada ').replace(/\bdr\.\s*/gi, 'Doutor ').replace(/\bn(?:[.º°]+\s*|\s+)(\d)/gi, '$1');
}
export const postalCodeFrom = query => expandStreet(query).match(/\b\d{4}-\d{3}\b/)?.[0] || '';
export function isStreetQuery(query) {
 return /^(rua\b|r\.|avenida\b|av[ª.]?\s|travessa\b|trav?\.|estrada\b|estr?\.|largo\b|praça\b|praca\b|alameda\b|caminho\b|urbaniza|n\s*\d)/i.test(String(query ?? '').trim());
}
export function houseNumberFrom(query) {
 if (!isStreetQuery(query)) return '';
 const parts = expandStreet(query).replace(/\b\d{4}-\d{3}\b/g, '').split(',');
 const firstPart = /^\s*\d+[a-z]?(?:[/-]\d+[a-z]?)?\s*$/i.test(parts[1] || '') ? `${parts[0]} ${parts[1].trim()}` : parts[0];
 // A street named "Rua 25 de Abril" has a date, not a door number.
 return firstPart.match(/\s(\d+[a-z]?(?:[/-]\d+[a-z]?)?)\s*$/i)?.[1] || '';
}
// ArcGIS World Geosearch: suggestions are resolved only after a user chooses one.
// Results are used temporarily on this page; they are never written to storage.
export function searchUrl(config, query, mode = 'suggest', magicKey = '') {
 const endpoint = config.endpoint || 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/';
 const url = new URL(mode === 'suggest' ? 'suggest' : 'findAddressCandidates', endpoint);
 const expanded = expandStreet(query);
 const parameters = mode === 'suggest'
  ? {f:'json', text:expanded, countryCode:'PRT', maxSuggestions:String(config.limit || 12), category:'Address,Postal,Populated Place'}
  : {f:'json', SingleLine:expanded, sourceCountry:'PRT', outSR:'4326', outFields:'Addr_type,Country,City,Subregion,Region,Postal,AddNum,ShortLabel,LongLabel', maxLocations:String(config.limit || 12), forStorage:'false', matchOutOfRange:'false'};
 // An explicit place/postcode must take priority over the regional preference.
 const names = config.municipalities || [];
 const normalized = ` ${normalizeQuery(expanded)} `;
 const explicit = expanded.includes(',') || postalCodeFrom(expanded) || names.some(name => normalized.endsWith(` ${normalizeQuery(name)} `));
 if (!explicit && pointIsValid(config.bias)) parameters.location = `${config.bias.lng},${config.bias.lat}`;
 if (magicKey && mode !== 'suggest') parameters.magicKey = magicKey;
 url.search = new URLSearchParams(parameters);
 return url;
}
const cleanLabel = value => String(value || '').replace(/,\s*(PRT|Portugal)\s*$/i,'').trim();
const partsFrom = value => {
 const label = cleanLabel(value), parts = label.split(',').map(part=>part.trim()).filter(Boolean);
 return {label,title:parts[0] || label,description:parts.slice(1).join(' · ')};
};
export function suggestionsFrom(data) {
 const seen = new Set();
 return (Array.isArray(data?.suggestions) ? data.suggestions : []).flatMap(suggestion => {
  if (!suggestion?.text || !suggestion.magicKey) return [];
  const parts = partsFrom(suggestion.text), key = normalizeQuery(parts.label);
  if (!key || seen.has(key)) return [];
  seen.add(key);
  return [{...parts,magicKey:suggestion.magicKey,collection:!!suggestion.isCollection,source:'esri',type:'suggestion'}];
 });
}
export function dedupePlaces(places) {
 const result=[];
 for (const place of places) {
  if (!pointIsValid(place) || !place.label) continue;
  if (result.some(previous => normalizeQuery(previous.label) === normalizeQuery(place.label) && distanceKm(previous,place)<.12)) continue;
  result.push(place);
 }
 return result;
}
export function placesFrom(data) {
 return dedupePlaces((Array.isArray(data?.candidates) ? data.candidates : []).flatMap(candidate => {
  const a=candidate?.attributes || {}, point={lat:candidate?.location?.y,lng:candidate?.location?.x};
  if (!pointIsValid(point) || !['PRT','PT'].includes(String(a.Country || '').toUpperCase()) || !Number.isFinite(candidate.score) || candidate.score<75) return [];
  const parts=partsFrom(a.LongLabel || candidate.address);
  if (!parts.label) return [];
  const addressType=a.Addr_type || '', type=/^(PointAddress|Subaddress)$/.test(addressType)?'house':addressType==='StreetAddress'?'interpolated':addressType==='StreetName'?'street':/^Postal/.test(addressType)?'postcode':'locality';
  return [{...point,...parts,type,addressType,source:'esri',score:candidate.score,postcode:String(a.Postal || ''),housenumber:String(a.AddNum || ''),city:String(a.City || ''),county:String(a.Subregion || ''),region:String(a.Region || '')}];
 }));
}
export function explicitPlaceFrom(query,config={}) {
 const expanded=expandStreet(query), pieces=expanded.split(',').slice(1).map(part=>part.replace(/\b\d{4}(?:-\d{3})?\b/g,'').trim()).filter(part=>part && !/^\d+[a-z]?$/i.test(part) && !/^(Portugal|PRT)$/i.test(part));
 if(pieces.length)return pieces[0];
 const text=normalizeQuery(expanded.replace(/\b\d{4}-\d{3}\b/g,''));
 const names=[...(config.municipalities || [])].sort((a,b)=>b.length-a.length);
 return names.find(name=>text===normalizeQuery(name) || text.endsWith(` ${normalizeQuery(name)}`)) || '';
}
export function matchingSuggestions(places,query,config={}) {
 const area=normalizeQuery(explicitPlaceFrom(query,config));
 return places.filter(place=>{
  if(!area)return true;
  const parts=place.label.split(',').map(part=>normalizeQuery(part));
  const areas=parts.length>3?parts.slice(2,-1):parts.slice(1);
  return areas.includes(area) || normalizeQuery(place.title)===area;
 }).map(place=>({...place,query}));
}
export function matchingPlaces(places, query, config={}) {
 const postcode=postalCodeFrom(query), house=houseNumberFrom(query), area=normalizeQuery(explicitPlaceFrom(query,config));
 return places.filter(place => (!postcode || place.postcode === postcode) && (!house || !place.housenumber || normalizeQuery(house) === normalizeQuery(place.housenumber)) && (!area || [place.city,place.county].map(normalizeQuery).includes(area)));
}
export function rankPlaces(places, query, config={}) {
 const normalized=normalizeQuery(expandStreet(query)), tokens=normalized.split(' ').filter(Boolean);
 const score=place=>{
  const label=normalizeQuery(place.label);
  return (place.score || 0)+tokens.reduce((sum,token)=>sum+(label.includes(token)?10:-15),0)+(normalizeQuery(place.title)===normalized?100:0);
 };
 return [...places].sort((a,b)=>score(b)-score(a));
}
const glyph = name => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${name === 'search' ? 'm21 21-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0' : name === 'locate' ? 'M12 2v3m0 14v3M2 12h3m14 0h3 M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0' : 'M12 21s7-6 7-12A7 7 0 0 0 5 9c0 6 7 12 7 12Z M12 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6'}"/></svg>`;
const precision = place => place.type === 'house' ? 'Morada' : place.type === 'interpolated' ? 'Morada · localização aproximada' : place.type === 'street' ? 'Rua · localização aproximada' : place.type === 'postcode' ? 'Código postal · localização aproximada' : 'Localidade · localização aproximada';
export function locationMarkup(t, config) {
 return `<section class="location-finder" aria-labelledby="location-heading"><div class="location-heading"><span class="location-icon" aria-hidden="true">${glyph('locate')}</span><div><h2 id="location-heading">${e(t.titulo)}</h2><p>${e(t.descricao)}</p></div></div><form id="location-form" role="search"><label class="sr-only" for="location-query">${e(t.label)}</label><div class="location-input"><div class="address-combobox"><span class="address-search-icon">${glyph('search')}</span><input id="location-query" type="search" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="location-choices" aria-describedby="location-help location-status" maxlength="160" placeholder="${e(t.placeholder)}" autocomplete="off" spellcheck="false" enterkeyhint="search"><button type="button" id="location-clear" class="address-clear" aria-label="${e(t.limpar)}" hidden>×</button><ul id="location-choices" role="listbox" aria-label="${e(t.sugestoes)}" hidden></ul></div><button class="btn address-search-button" type="submit" id="address-search">Pesquisar ${glyph('search')}</button></div><div class="location-secondary"><p class="location-note" id="location-help">${e(t.ajuda)}</p><button type="button" id="device-location" class="location-gps">${glyph('locate')}Usar a minha localização</button></div></form><div class="location-search-state"><p id="location-status" role="status" aria-live="polite" aria-atomic="true"></p></div><div id="nearest-result" aria-live="polite"></div><p class="search-attribution">Pesquisa por <a href="https://www.esri.com/en-us/arcgis/products/arcgis-world-geocoding-service/overview" target="_blank" rel="noopener">Esri</a> · O texto escrito é enviado ao serviço de pesquisa.</p></section>`;
}
export function initLocation(config,t,onSelect) {
 const form=document.querySelector('#location-form'),input=document.querySelector('#location-query'),status=document.querySelector('#location-status');
 if(!form || !input || !status) return;
 const list=document.querySelector('#location-choices'),clear=document.querySelector('#location-clear'),device=document.querySelector('#device-location'),submitButton=document.querySelector('#address-search');
 let places=[],active=-1,selected=null,version=0,timer,controller,geoTimer,composing=false;
 const setStatus=(message='',state='')=>{status.textContent=message;status.dataset.state=state;};
 const close=()=>{list.hidden=true;active=-1;input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant');};
 const cancel=()=>{version++;clearTimeout(timer);clearTimeout(geoTimer);controller?.abort();controller=null;input.setAttribute('aria-busy','false');device.disabled=false;submitButton.disabled=false;};
 const resetSelection=()=>{if(selected){selected=null;onSelect(null);}};
 const highlight=index=>{active=(index+places.length)%places.length;list.querySelectorAll('[role=option]').forEach((option,i)=>option.setAttribute('aria-selected',String(i===active)));input.setAttribute('aria-activedescendant',`address-option-${active}`);list.children[active]?.scrollIntoView({block:'nearest'});};
 const render=()=>{
  active=-1;input.removeAttribute('aria-activedescendant');
  list.innerHTML=places.map((place,index)=>`<li role="option" id="address-option-${index}" aria-selected="false" data-index="${index}"><span class="place-icon">${glyph('pin')}</span><span class="place-copy"><span class="place-title">${e(place.title)}</span><span class="place-description">${e(place.description)}</span>${place.type==='suggestion'?'':`<span class="place-meta">${e(precision(place))}</span>`}</span><span class="place-arrow" aria-hidden="true">→</span></li>`).join('');
  list.hidden=!places.length;input.setAttribute('aria-expanded',String(!!places.length));
 };
 const accept=point=>{cancel();selected=point;places=[];close();input.value=point.label;clear.hidden=false;setStatus(precision(point),'selected');onSelect(point);};
 async function request(url,signal){const response=await fetch(url,{signal});if(!response.ok)throw Error(response.status);const data=await response.json();if(data.error)throw Error(data.error.message || 'Geosearch unavailable');return data;}
 async function run(query,mode='suggest',suggestion=null){
  cancel();const id=version,requestController=new AbortController();controller=requestController;let timedOut=false;
  const timeout=setTimeout(()=>{timedOut=true;requestController.abort();},12000);
  input.setAttribute('aria-busy','true');submitButton.disabled=true;setStatus(mode==='suggest'?'A procurar moradas…':'A localizar a morada…','loading');
  try{
   const data=await request(searchUrl(config,query,mode,suggestion?.magicKey || ''),requestController.signal);
   if(id!==version)return;
   if(mode==='suggest'){
    if(!Array.isArray(data.suggestions))throw Error('Invalid suggestions');
    places=matchingSuggestions(suggestionsFrom(data),query,config).slice(0,config.limit || 12);
    if(!places.length){
     const candidates=await request(searchUrl(config,query,'resolve'),requestController.signal);if(id!==version)return;
     places=rankPlaces(matchingPlaces(placesFrom(candidates),query,config),query,config).slice(0,config.limit || 12);
    }
   }else{
    if(!Array.isArray(data.candidates))throw Error('Invalid candidates');
    places=rankPlaces(matchingPlaces(placesFrom(data),suggestion?.query || query,config),query,config).slice(0,config.limit || 12);
    if(places.length===1 || (suggestion && !suggestion.collection && places.length)){accept(places[0]);return;}
   }
   render();setStatus(places.length?'Escolha a sua morada nos resultados.':t.semResultados,places.length?'results':'empty');
  }catch(error){
   if(id!==version || (requestController.signal.aborted && !timedOut))return;
   places=[];close();setStatus('Não foi possível pesquisar agora. Tente novamente com o botão Pesquisar.','error');
  }finally{clearTimeout(timeout);if(id===version){controller=null;input.setAttribute('aria-busy','false');submitButton.disabled=false;}}
 }
 function changed(){cancel();resetSelection();close();places=[];clear.hidden=!input.value;const query=input.value.trim();setStatus(query && query.length<3?t.minimo:'');if(query.length>=3 && !composing)timer=setTimeout(()=>run(query),450);}
 const pick=place=>{if(pointIsValid(place))accept(place);else run(place.label,'resolve',place);};
 form.addEventListener('submit',event=>{event.preventDefault();input.focus();const query=input.value.trim();if(query.length<3){setStatus(t.minimo);input.focus();return;}resetSelection();close();run(query,'resolve');});
 input.addEventListener('input',changed);input.addEventListener('search',()=>{if(!input.value)changed();});
 input.addEventListener('compositionstart',()=>{composing=true;cancel();close();});input.addEventListener('compositionend',()=>{composing=false;changed();});
 input.addEventListener('keydown',event=>{
  if(event.isComposing)return;
  if(event.key==='Escape'){event.preventDefault();cancel();close();setStatus(selected?precision(selected):'');}
  else if((event.key==='ArrowDown'||event.key==='ArrowUp') && places.length){event.preventDefault();list.hidden=false;input.setAttribute('aria-expanded','true');highlight(active<0?(event.key==='ArrowDown'?0:places.length-1):active+(event.key==='ArrowDown'?1:-1));}
  else if(event.key==='Enter' && !list.hidden && places.length){event.preventDefault();pick(places[active<0?0:active]);}
  else if(event.key==='Tab')close();
 });
 list.addEventListener('pointerdown',event=>{if(event.pointerType==='mouse')event.preventDefault();});
 list.addEventListener('click',event=>{const option=event.target.closest('[data-index]');if(option)pick(places[Number(option.dataset.index)]);});
 input.addEventListener('focus',()=>{if(places.length && !selected){list.hidden=false;input.setAttribute('aria-expanded','true');}});
 document.addEventListener('pointerdown',event=>{if(!form.contains(event.target)){cancel();close();if(status.dataset.state==='loading')setStatus('');}});
 form.addEventListener('focusout',()=>setTimeout(()=>{if(!form.contains(document.activeElement)){cancel();close();if(status.dataset.state==='loading')setStatus('');}},0));
 clear.addEventListener('click',()=>{cancel();input.value='';places=[];resetSelection();close();setStatus('');clear.hidden=true;input.focus();});
 device.addEventListener('click',()=>{
  device.focus();cancel();close();resetSelection();if(!navigator.geolocation){setStatus(t.geoIndisponivel,'error');return;}if(!window.isSecureContext){setStatus(t.geoSeguro,'error');return;}
  const id=version;device.disabled=true;setStatus(t.geoProcurar,'loading');
  const fail=message=>{if(id!==version)return;clearTimeout(geoTimer);device.disabled=false;setStatus(message,'error');};
  geoTimer=setTimeout(()=>{if(id!==version)return;cancel();setStatus(t.geoTempo,'error');},13000);
  navigator.geolocation.getCurrentPosition(position=>{if(id!==version)return;const point={lat:position.coords.latitude,lng:position.coords.longitude};if(!pointIsValid(point)){fail(t.geoErro);return;}accept({...point,label:t.geoAtual,title:t.geoAtual,type:'device',source:'device'});setStatus(Number.isFinite(position.coords.accuracy)&&position.coords.accuracy>1000?'Localização do dispositivo aproximada.':t.geoAtual,'selected');},error=>fail(error.code===1?t.geoRecusada:error.code===3?t.geoTempo:t.geoErro),{enableHighAccuracy:false,timeout:10000,maximumAge:60000});
 });
}
