export const esc = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
export const known = value => value != null && String(value).trim() !== '' && !/\[A PREENCHER\]/i.test(String(value));

export function safeUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return '#';
  try {
    const url = new URL(value.trim(), globalThis.location?.href || 'http://localhost/');
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '#';
  } catch {
    return '#';
  }
}

export function localDate(now = new Date(), zone = 'Europe/Lisbon') {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: zone || 'Europe/Lisbon', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  }).formatToParts(now).map(part => [part.type, part.value]));
  const date = `${parts.year}-${parts.month}-${parts.day}`;
  return { date, day: new Date(`${date}T12:00:00Z`).getUTCDay(), minutes: Number(parts.hour) * 60 + Number(parts.minute) };
}

const minutes = value => {
  if (typeof value !== 'string' || !/^\d{2}:\d{2}$/.test(value)) return NaN;
  const [hour, minute] = value.split(':').map(Number);
  return hour < 24 && minute < 60 ? hour * 60 + minute : NaN;
};
const validSlots = slots => Array.isArray(slots) && slots.every(slot => Array.isArray(slot) && slot.length === 2 && slot.every(value => Number.isFinite(minutes(value))));

export function openingStatus(store, now = new Date()) {
  const schedule = store?.horario;
  if (!schedule) return 'desconhecido';
  let current;
  try { current = localDate(now, schedule.fuso); } catch { return 'desconhecido'; }
  const previous = new Date(`${current.date}T12:00:00Z`);
  previous.setUTCDate(previous.getUTCDate() - 1);
  const get = (date, day) => Object.hasOwn(schedule.excecoes || {}, date) ? schedule.excecoes[date] : schedule.semana?.[day];
  const today = get(current.date, current.day);
  const yesterday = get(previous.toISOString().slice(0, 10), (current.day + 6) % 7);

  // An overnight shift still runs even when today's published hours are missing.
  if (validSlots(yesterday) && yesterday.some(([start, end]) => minutes(end) < minutes(start) && current.minutes < minutes(end))) return 'aberto';
  if (!validSlots(today)) return 'desconhecido';
  if (today.some(([start, end]) => {
    const opens = minutes(start), closes = minutes(end);
    return closes > opens ? current.minutes >= opens && current.minutes < closes : opens !== closes && current.minutes >= opens;
  })) return 'aberto';
  return 'fechado';
}

export function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function leafletActive(flyer, now = new Date()) {
  if (!flyer || (!flyer.blob && !known(flyer.caminho)) || !validDate(flyer.inicio) || !validDate(flyer.fim) || flyer.inicio > flyer.fim) return false;
  try {
    const date = localDate(now).date;
    return flyer.inicio <= date && date <= flyer.fim;
  } catch { return false; }
}

export const coordinates = store => Number.isFinite(store?.coordenadas?.lat) && Number.isFinite(store?.coordenadas?.lng) && Math.abs(store.coordenadas.lat) <= 90 && Math.abs(store.coordenadas.lng) <= 180;

const scriptRequests = new Map();
export function loadScript(src) {
  const url = safeUrl(src);
  if (url === '#') return Promise.reject(new Error('Invalid script URL'));
  if (scriptRequests.has(url)) return scriptRequests.get(url);
  const request = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    let timer;
    const finish = error => {
      clearTimeout(timer);
      script.onload = script.onerror = null;
      if (error) { script.remove(); reject(error); } else resolve();
    };
    script.src = url;
    script.async = true;
    script.onload = () => finish();
    script.onerror = () => finish(new Error('CDN unavailable'));
    timer = setTimeout(() => finish(new Error('CDN request timed out')), 15000);
    document.head.append(script);
  });
  scriptRequests.set(url, request);
  request.catch(() => scriptRequests.delete(url));
  return request;
}
