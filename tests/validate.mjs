import assert from 'node:assert/strict';
import fs from 'node:fs';
const source=fs.readFileSync(new URL('../js/utils.js',import.meta.url),'utf8');
const {openingStatus,leafletActive,coordinates}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const stores=JSON.parse(fs.readFileSync(new URL('../data/lojas.json',import.meta.url)));
for(const name of ['config','folheto'])JSON.parse(fs.readFileSync(new URL(`../data/${name}.json`,import.meta.url)));
assert.equal(stores.length,9);assert.equal(new Set(stores.map(s=>s.slug)).size,9);
for(const s of stores){assert.ok(s.fontes.length);assert.equal(coordinates(s),true);assert.ok(s.mapsUrl.startsWith("https://www.google.com/maps/"));assert.deepEqual(s.servicos,[]);assert.equal(Object.keys(s.horario.semana).length,7);}
assert.equal(coordinates(stores.find(s=>s.slug==='boelhe')),true);
assert.equal(openingStatus(stores.find(s=>s.slug==='vila-boa-de-quires')),'desconhecido');
const fixture={horario:{fuso:'Europe/Lisbon',semana:{0:[],1:[['09:00','13:00'],['14:00','19:00']],2:[],3:[],4:[],5:[['22:00','02:00']],6:[]},excecoes:{'2026-10-05':[]}}};
assert.equal(openingStatus(fixture,new Date('2026-09-28T09:00:00Z')),'aberto');
assert.equal(openingStatus(fixture,new Date('2026-09-28T12:30:00Z')),'fechado');
assert.equal(openingStatus(fixture,new Date('2026-09-28T18:00:00Z')),'fechado');
assert.equal(openingStatus(fixture,new Date('2026-09-26T00:30:00Z')),'aberto');
assert.equal(openingStatus(fixture,new Date('2026-10-05T09:00:00Z')),'fechado');
const f={caminho:'test.pdf',inicio:'2026-09-01',fim:'2026-09-30'};
assert.equal(leafletActive(f,new Date('2026-09-30T22:59:00Z')),true);
assert.equal(leafletActive(f,new Date('2026-09-30T23:01:00Z')),false);
assert.equal(leafletActive({...f,inicio:null}),false);
function luminance(hex){const channels=hex.match(/[a-f\d]{2}/gi).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;}
for(const [a,b] of [['#1C3A7A','#FFFFFF'],['#AB4212','#FFFFFF'],['#142B59','#FFFFFF'],['#52617B','#FFFFFF']]){const la=luminance(a),lb=luminance(b);const ratio=(Math.max(la,lb)+.05)/(Math.min(la,lb)+.05);assert.ok(ratio>=4.5);console.log(`${a} / ${b}: ${ratio.toFixed(2)}:1 AA`);}
console.log('JSON, nine stores, schedules, overnight shifts, exceptions, leaflet expiry and contrast: PASS');
