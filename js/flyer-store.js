const databaseName = 'marco-horizonte';
const storageError = () => new Error('Não foi possível aceder ao armazenamento deste navegador. Verifique se permite guardar dados deste site.');

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!globalThis.indexedDB) { reject(storageError()); return; }
    let request, blocked = false;
    try { request = indexedDB.open(databaseName, 1); } catch { reject(storageError()); return; }
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains('content')) request.result.createObjectStore('content');
    };
    request.onsuccess = () => {
      const database = request.result;
      if (blocked) { database.close(); return; }
      database.onversionchange = () => database.close();
      resolve(database);
    };
    request.onerror = () => reject(storageError());
    request.onblocked = () => { blocked = true; reject(new Error('Feche os outros separadores deste site e volte a tentar.')); };
  });
}

async function transaction(mode, action) {
  const database = await openDatabase();
  try {
    return await new Promise((resolve, reject) => {
      const tx = database.transaction('content', mode);
      let request, blocked = false;
      try { request = action(tx.objectStore('content')); } catch (error) { tx.abort(); reject(error); return; }
      tx.oncomplete = () => resolve(request.result);
      tx.onerror = () => reject(tx.error || storageError());
      tx.onabort = () => reject(tx.error || storageError());
    });
  } finally { database.close(); }
}

export const readFlyer = () => transaction('readonly', store => store.get('flyer'));
export const saveFlyer = value => transaction('readwrite', store => store.put(value, 'flyer'));
export const resetFlyer = () => transaction('readwrite', store => store.delete('flyer'));
