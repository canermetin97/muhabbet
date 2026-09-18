/* ============================================================
   room.js — oda bağlantısı. Oyunlardan bağımsız: kimlik, WebSocket,
   yeniden bağlanma, durum dağıtımı. Hiçbir kural burada işlemez.
   ============================================================ */
const Oda = (() => {

const SUNUCU = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
  ? 'ws://localhost:8788'
  : 'wss://muhabbet.scanerm97.workers.dev';

const $ = id => document.getElementById(id);
const K_ID = 'muhabbet.oyuncuId';
const K_AD = 'muhabbet.ad';

let ws = null, kod = null, durum = null, acik = false;
let benimId = null, benimAd = 'Oyuncu', deneme = 0;
const dinleyiciler = [];

/* Kimlik sekme başına: aynı tarayıcıda iki pencere = iki oyuncu,
   sayfa yenilenince koltuk korunur. */
function kimlik() {
  if (benimId) return benimId;
  const taze = () => 'o-' + Math.random().toString(36).slice(2, 10);
  try {
    benimId = sessionStorage.getItem(K_ID);
    if (!benimId) { benimId = taze(); sessionStorage.setItem(K_ID, benimId); }
  } catch { benimId = taze(); }
  return benimId;
}

const yeniKod = () => {
  const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';   // karışabilen harfler yok
  return Array.from({ length: 5 }, () => A[Math.floor(Math.random() * A.length)]).join('');
};

function bagla(odaKodu, ad) {
  kod = String(odaKodu || '').toUpperCase();
  benimAd = (ad || 'Oyuncu').slice(0, 14);
  try { localStorage.setItem(K_AD, benimAd); } catch {}
  acik = true; durum = null;
  soketAc();
}

function soketAc() {
  const url = `${SUNUCU}/oda/${encodeURIComponent(kod)}/ws`
            + `?id=${encodeURIComponent(kimlik())}&ad=${encodeURIComponent(benimAd)}`;
  bildir('durumMesaji', 'Bağlanıyor…');
  try { ws = new WebSocket(url); } catch (e) { bildir('durumMesaji', 'Bağlanamadı: ' + e.message); return; }

  ws.onopen = () => { deneme = 0; bildir('durumMesaji', ''); };
  ws.onmessage = e => {
    let m; try { m = JSON.parse(e.data); } catch { return; }
    if (m.t === 'durum') { durum = m; bildir('durum', m); }
    else if (m.t === 'hata') bildir('hata', m.mesaj);
  };
  ws.onclose = () => {
    if (!acik) return;
    bildir('durumMesaji', 'Bağlantı koptu, yeniden deneniyor…');
    deneme = Math.min(deneme + 1, 6);
    setTimeout(() => { if (acik) soketAc(); }, 500 * deneme);
  };
  ws.onerror = () => {};
}

function ayril() {
  acik = false; durum = null;
  if (ws) { try { ws.close(); } catch {} ws = null; }
}

const gonder = o => { if (ws && ws.readyState === 1) ws.send(JSON.stringify(o)); };
const bildir = (tip, veri) => dinleyiciler.forEach(f => f(tip, veri));

return {
  bagla, ayril, gonder, yeniKod, kimlik,
  dinle: f => dinleyiciler.push(f),
  kod: () => kod,
  durum: () => durum,
  acikMi: () => acik,
  ben: () => durum && durum.oyuncular.find(p => p.id === kimlik()),
  hostMu: () => !!durum && durum.hostId === kimlik(),
  kayitliAd: () => { try { return localStorage.getItem(K_AD) || ''; } catch { return ''; } },
  sunucu: SUNUCU,
};
})();
