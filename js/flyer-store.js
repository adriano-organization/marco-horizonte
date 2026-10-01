const database='marco-horizonte';
function db(){return new Promise((resolve,reject)=>{const request=indexedDB.open(database,1);request.onupgradeneeded=()=>request.result.createObjectStore('content');request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});}
async function transaction(mode,action){const database=await db();try{return await new Promise((resolve,reject)=>{const tx=database.transaction('content',mode);const request=action(tx.objectStore('content'));tx.oncomplete=()=>resolve(request.result);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});}finally{database.close();}}
export const readFlyer=()=>transaction('readonly',store=>store.get('flyer'));
export const saveFlyer=value=>transaction('readwrite',store=>store.put(value,'flyer'));
export const resetFlyer=()=>transaction('readwrite',store=>store.delete('flyer'));
