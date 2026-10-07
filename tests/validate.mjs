import assert from 'node:assert/strict';
import fs from 'node:fs';
const source=fs.readFileSync(new URL('../js/utils.js',import.meta.url),'utf8');
const {openingStatus,leafletActive,coordinates,validDate,known,safeUrl}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const stores=JSON.parse(fs.readFileSync(new URL('../data/lojas.json',import.meta.url)));
const config=JSON.parse(fs.readFileSync(new URL('../data/config.json',import.meta.url)));
JSON.parse(fs.readFileSync(new URL('../data/folheto.json',import.meta.url)));
assert.equal(stores.length,9);assert.equal(new Set(stores.map(s=>s.slug)).size,9);
for(const s of stores){assert.ok(s.fontes.length);assert.equal(coordinates(s),true);assert.ok(s.mapsUrl.startsWith("https://www.google.com/maps/"));assert.ok(Array.isArray(s.servicos));assert.equal(Object.keys(s.horario.semana).length,7);}
assert.equal(coordinates(stores.find(s=>s.slug==='boelhe')),true);
// Every store marker must agree with the exact destination supplied in its Maps link.
for(const store of stores){
 const point=store.mapsUrl.match(/!3d(-?[\d.]+)!4d(-?[\d.]+)/)||store.mapsUrl.match(/maps\/search\/(-?[\d.]+),[+\s]*(-?[\d.]+)/);
 assert.ok(point, `${store.nome}: link Maps sem coordenadas de destino`);
 assert.equal(store.coordenadas.lat,Number(point[1]), `${store.nome}: latitude divergente`);
 assert.equal(store.coordenadas.lng,Number(point[2]), `${store.nome}: longitude divergente`);
}
assert.equal(coordinates(null),false);
assert.equal(coordinates({coordenadas:{lat:NaN,lng:0}}),false);
assert.equal(coordinates({coordenadas:{lat:91,lng:0}}),false);
assert.equal(known('  '),false);
assert.equal(known('[A PREENCHER]'),false);
assert.equal(known('255 539 430'),true);
assert.equal(safeUrl('javascript:alert(1)'), '#');
assert.equal(safeUrl('data:text/html,<h1>'), '#');
assert.equal(safeUrl(''), '#');
assert.equal(safeUrl(undefined), '#');
assert.equal(safeUrl('https://www.google.com/maps/'), 'https://www.google.com/maps/');
assert.equal(openingStatus(stores.find(s=>s.slug==='vila-boa-de-quires')),'desconhecido');
const fixture={horario:{fuso:'Europe/Lisbon',semana:{0:[],1:[['09:00','13:00'],['14:00','19:00']],2:[],3:[],4:[],5:[['22:00','02:00']],6:[]},excecoes:{'2026-10-05':[]}}};
assert.equal(openingStatus(fixture,new Date('2026-09-28T09:00:00Z')),'aberto');
assert.equal(openingStatus(fixture,new Date('2026-09-28T12:30:00Z')),'fechado');
assert.equal(openingStatus(fixture,new Date('2026-09-28T18:00:00Z')),'fechado');
assert.equal(openingStatus(fixture,new Date('2026-09-26T00:30:00Z')),'aberto');
assert.equal(openingStatus(fixture,new Date('2026-10-05T09:00:00Z')),'fechado');
assert.equal(openingStatus(null),'desconhecido');
assert.equal(openingStatus({...fixture,horario:{...fixture.horario,fuso:'invalid/zone'}}),'desconhecido');
assert.equal(openingStatus(fixture,new Date('invalid')),'desconhecido');
assert.equal(openingStatus({horario:{...fixture.horario,semana:{1:[['25:00','27:00']]}}},new Date('2026-09-28T09:00:00Z')),'desconhecido');
assert.equal(openingStatus({horario:{...fixture.horario,semana:{1:['malformed']}}},new Date('2026-09-28T09:00:00Z')),'desconhecido');
assert.equal(openingStatus({horario:{...fixture.horario,semana:{5:[['22:00','02:00']],6:null}}},new Date('2026-09-26T00:30:00Z')),'aberto');
const f={caminho:'test.pdf',inicio:'2026-09-01',fim:'2026-09-30'};
assert.equal(leafletActive(f,new Date('2026-09-30T22:59:00Z')),true);
assert.equal(leafletActive(f,new Date('2026-09-30T23:01:00Z')),false);
assert.equal(leafletActive({...f,inicio:null}),false);
assert.equal(leafletActive(null),false);
assert.equal(leafletActive({...f,caminho:'[A PREENCHER]'}),false);
assert.equal(leafletActive({...f,inicio:'2026-02-30'}),false);
assert.equal(leafletActive({...f,inicio:'2026-10-01',fim:'2026-09-30'}),false);
assert.equal(leafletActive(f,new Date('invalid')),false);
assert.equal(validDate('2026-02-29'),false);
assert.equal(validDate('2028-02-29'),true);
assert.equal(validDate('2026-13-01'),false);
assert.equal(validDate('2026-9-01'),false);
function luminance(hex){const channels=hex.match(/[a-f\d]{2}/gi).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;}
for(const [a,b] of [[config.paleta.primaria,config.paleta.branco],[config.paleta.laranjaTexto,config.paleta.branco],[config.paleta.texto,config.paleta.fundo],[config.paleta.muted,config.paleta.fundo]]){const la=luminance(a),lb=luminance(b);const ratio=(Math.max(la,lb)+.05)/(Math.min(la,lb)+.05);assert.ok(ratio>=4.5);console.log(`${a} / ${b}: ${ratio.toFixed(2)}:1 AA`);}
console.log('JSON, nine matching Maps pins, robust schedules, overnight shifts, exceptions, safe URLs, calendar validity, leaflet expiry and contrast: PASS');
