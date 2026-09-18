/* ============================================================
   sise.js — Şişe Çevirmece görünümü.
   Sunucu hedefi ve açıyı belirler; bütün telefonlar aynı açıyı
   aldığı için şişe herkeste aynı kişiye döner.
   ============================================================ */
const Sise = (() => {
const $ = id => document.getElementById(id);
let sonTur = -1, birikmisAci = 0;

/** Oyuncuları masanın çevresine dizer (0 = saat 12, saat yönünde). */
function halkaCiz(oyuncular) {
  const halka = $('sise-halka');
  const imza = oyuncular.map(p => p.id + p.ad).join('|');
  if (halka.dataset.imza !== imza) {
    halka.dataset.imza = imza;
    halka.innerHTML = '';
    const n = oyuncular.length;
    oyuncular.forEach((p, i) => {
      const a = (i * 360 / n - 90) * Math.PI / 180;
      const el = document.createElement('div');
      el.className = 'isim' + (p.id === Oda.kimlik() ? ' ben' : '');
      el.dataset.id = p.id;
      el.textContent = p.ad;
      el.style.left = (50 + 41 * Math.cos(a)) + '%';
      el.style.top = (50 + 41 * Math.sin(a)) + '%';
      halka.appendChild(el);
    });
  }
}

function ciz(d) {
  const s = d.sise || {};
  halkaCiz(d.oyuncular);
  $('sise-kod').textContent = Oda.kod() || '';
  $('sise-tur').textContent = s.tur ? `${s.tur}. tur` : '';

  // yeni bir çevirme geldiyse şişeyi döndür
  if (s.tur && s.tur !== sonTur) {
    sonTur = s.tur;
    // her zaman ileri dön: mevcut açının üstüne 5 tam tur ekle
    const hedefAci = s.aci || 0;
    const suanki = ((birikmisAci % 360) + 360) % 360;
    birikmisAci += (360 - suanki) + hedefAci + 360 * 5;
    $('sise-obje').style.transform = `translate(-50%,-50%) rotate(${birikmisAci}deg)`;
  }

  const hedef = s.hedefId && d.oyuncular.find(p => p.id === s.hedefId);
  document.querySelectorAll('#sise-halka .isim').forEach(el => {
    el.classList.toggle('hedef', !!hedef && el.dataset.id === hedef.id);
  });

  const sonuc = $('sise-sonuc');
  if (hedef) {
    const benMi = hedef.id === Oda.kimlik();
    sonuc.innerHTML =
      `<div class="kim">${benMi ? 'Şişe sende!' : hedef.ad}</div>` +
      `<div class="gorev">${s.gorev || ''}</div>`;
  } else {
    sonuc.innerHTML = d.oyuncular.filter(p => p.bagli).length < 2
      ? `<div class="gorev">En az iki kişi gerekli — kodu paylaş.</div>`
      : `<div class="gorev">Şişeyi çeviren kişi kendisi dışında birini seçer.</div>`;
  }

  $('sise-cevir').classList.toggle('gizli', !!hedef);
  $('sise-cevir').disabled = d.oyuncular.filter(p => p.bagli).length < 2;
  $('sise-tamam').classList.toggle('gizli', !hedef);
}

function bagla() {
  $('sise-cevir').onclick = () => Oda.gonder({ t: 'cevir' });
  $('sise-tamam').onclick = () => Oda.gonder({ t: 'siseTamam' });
}

return { ciz, bagla, sifirla: () => { sonTur = -1; } };
})();
