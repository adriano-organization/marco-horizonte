import assert from 'node:assert/strict';
import fs from 'node:fs';
const src=fs.readFileSync('js/nearest.js','utf8').replace("import {esc as e} from './utils.js';",'');
const {distanceKm}=await import('data:text/javascript;base64,'+Buffer.from(src).toString('base64'));
assert.equal(distanceKm({lat:0,lng:0},{lat:0,lng:0}),0);
assert.ok(Math.abs(distanceKm({lat:0,lng:0},{lat:0,lng:1})-111.195)<.01);
const stores=JSON.parse(fs.readFileSync('data/lojas.json'));
for(const origin of stores){const ordered=[...stores].sort((a,b)=>distanceKm(origin.coordenadas,a.coordenadas)-distanceKm(origin.coordenadas,b.coordenadas));assert.equal(ordered[0].id,origin.id);}
console.log('Distâncias e ordenação das nove lojas: PASS');
