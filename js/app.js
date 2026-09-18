/* ============================================================
   app.js — ekran yönlendirme ve oda olaylarının dağıtımı
   ============================================================ */
(() => {
const $ = id => document.getElementById(id);
const SURUM = (document.currentScript && document.currentScript.src.match(/v=(\d+)/) || [, '1'])[1];
document.querySelectorAll('[data-surum]').forEach(el => el.textContent = 'v.' + SURUM);

function goster(ad) {
  document.querySelectorAll('.ekran').forEach(e => e.classList.remove('aktif'));
  $('ekran-' + ad).classList.add('aktif');
}

/* ---------------- giriş ---------------- */
$('ad').value = Oda.kayitliAd() || '';
$('kod').addEventListener('input', e => {
  e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
});

function gir(kod) {
  const ad = ($('ad').value || '').trim().slice(0, 14);
  if (!ad) { $('giris-durum').textContent = 'Önce adını yaz.'; $('ad').focus(); return; }
  Oda.bagla(kod, ad);
  goster('lobi');
}
$('oda-kur').onclick = () => gir(Oda.yeniKod());
$('odaya-katil').onclick = () => {
  const kod = ($('kod').value || '').trim().toUpperCase();
  if (kod.length < 3) { $('giris-durum').textContent = 'Geçerli bir oda kodu gir.'; return; }
  gir(kod);
};

document.querySelectorAll('[data-cik]').forEach(b => b.onclick = () => {
  Oda.ayril(); Sise.sifirla(); goster('giris');
});
document.querySelectorAll('[data-lobi]').forEach(b => b.onclick = () => Oda.gonder({ t: 'lobi' }));

$('kod-kopyala').onclick = async () => {
  try { await navigator.clipboard.writeText(Oda.kod()); $('kod-kopyala').textContent = 'Kopyalandı ✓'; }
  catch { $('kod-kopyala').textContent = Oda.kod(); }
  setTimeout(() => ($('kod-kopyala').textContent = 'Kodu kopyala'), 1800);
};

document.querySelectorAll('.oyun-karti[data-oyun]').forEach(b =>
  b.onclick = () => Oda.gonder({ t: 'oyunSec', oyun: b.dataset.oyun }));

Sise.bagla();
Nhie.bagla();

/* ---------------- lobi çizimi ---------------- */
function lobiCiz(d) {
  $('lobi-kod').textContent = Oda.kod() || '—';
  const ul = $('lobi-oyuncular');
  ul.innerHTML = '';
  d.oyuncular.forEach(p => {
    const li = document.createElement('li');
    if (p.id === Oda.kimlik()) li.classList.add('ben');
    if (!p.bagli) li.classList.add('kopuk');
    const etiketler = [];
    if (p.id === d.hostId) etiketler.push('odayı kuran');
    if (!p.bagli) etiketler.push('bağlı değil');
    li.innerHTML = `<span>${p.ad}</span><span class="etiket">${etiketler.join(' · ')}</span>`;
    ul.appendChild(li);
  });
  $('lobi-host').classList.toggle('gizli', !Oda.hostMu());
  $('lobi-bekle').classList.toggle('gizli', Oda.hostMu());
}

/* ---------------- oda olayları ---------------- */
Oda.dinle((tip, veri) => {
  if (tip === 'durumMesaji') { $('giris-durum').textContent = veri || ''; return; }
  if (tip === 'hata') {
    $('giris-durum').textContent = veri;
    Oda.ayril(); goster('giris'); return;
  }
  if (tip !== 'durum') return;

  const d = veri;
  if (d.faz === 'lobi') { lobiCiz(d); goster('lobi'); return; }
  if (d.oyun === 'sise') { Sise.ciz(d); goster('sise'); return; }
  if (d.oyun === 'nhie') { Nhie.ciz(d); goster('nhie'); return; }
  lobiCiz(d); goster('lobi');
});

// Çevrimdışı kabuk (yalnızca http/https)
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  const vardi = !!navigator.serviceWorker.controller;
  let yenilendi = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!vardi || yenilendi) return; yenilendi = true; location.reload();
  });
  addEventListener('load', () => navigator.serviceWorker.register('./sw.js')
    .then(r => r.update().catch(() => {})).catch(() => {}));
}
})();
