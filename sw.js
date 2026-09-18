/* Muhabbet — çevrimdışı kabuk.
   Sayfanın kendisi ÖNCE AĞDAN alınır; sürümlü dosyalar önbellekten.
   Böylece yeni sürüm çıkınca uygulama kendini güncelleyebilir. */
const SURUM = 'v2';
const ONBELLEK = 'muhabbet-' + SURUM;

const DOSYALAR = [
  './', './index.html', './manifest.webmanifest',
  './css/style.css?v=2',
  './js/room.js?v=2', './js/sise.js?v=2', './js/nhie.js?v=2', './js/app.js?v=2',
  './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(ONBELLEK)
    .then(c => c.addAll(DOSYALAR.map(u => new Request(u, { cache: 'reload' }))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== ONBELLEK).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return;

  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(res => {
      const kopya = res.clone();
      caches.open(ONBELLEK).then(c => c.put('./index.html', kopya)).catch(() => {});
      return res;
    }).catch(() => caches.match('./index.html').then(h => h || caches.match('./'))));
    return;
  }

  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res && res.status === 200 && res.type === 'basic') {
      const kopya = res.clone();
      caches.open(ONBELLEK).then(c => c.put(req, kopya)).catch(() => {});
    }
    return res;
  }).catch(() => undefined)));
});
