/* ============================================================
   nhie.js — "Ben Hiç…" görünümü.
   Cevaplar sunucuda toplanır; kimin ne dediği ancak herkes
   cevapladıktan sonra açılır — erken sızmaz.
   ============================================================ */
const Nhie = (() => {
const $ = id => document.getElementById(id);

function ciz(d) {
  const n = d.nhie || {};
  $('nhie-kod').textContent = Oda.kod() || '';
  $('nhie-tur').textContent = n.tur ? `${n.tur}. soru` : '';
  $('nhie-cumle').textContent = n.cumle || '…';

  document.querySelectorAll('#nhie-seviye .cip').forEach(b =>
    b.classList.toggle('secili', b.dataset.seviye === n.seviye));
  $('nhie-seviye').classList.toggle('gizli', !Oda.hostMu());

  const benimCevap = n.acik ? n.cevaplar[Oda.kimlik()] : undefined;
  const cevapladim = n.cevaplayan.includes(Oda.kimlik());

  // oyuncu rozetleri
  const izgara = $('nhie-izgara');
  izgara.innerHTML = '';
  d.oyuncular.forEach(p => {
    const el = document.createElement('div');
    let sinif = 'kisi';
    if (n.acik && n.cevaplar[p.id] !== undefined) sinif += n.cevaplar[p.id] ? ' yaptim' : ' yapmadim';
    else if (n.cevaplayan.includes(p.id)) sinif += ' hazir';
    el.className = sinif;
    const isaret = n.acik ? (n.cevaplar[p.id] ? '🙈' : '😇')
                          : (n.cevaplayan.includes(p.id) ? '✓' : '⋯');
    el.innerHTML = `<span>${isaret}</span><span>${p.ad}</span>` +
                   (p.puan ? `<span class="sayac">${p.puan}</span>` : '');
    izgara.appendChild(el);
  });

  // alt bar
  const cevapDugmeleri = $('nhie-cevap-dugmeleri');
  cevapDugmeleri.classList.toggle('gizli', n.acik || cevapladim);
  $('nhie-sonraki').classList.toggle('gizli', !(n.acik && Oda.hostMu()));
  $('nhie-ac').classList.toggle('gizli', !(!n.acik && Oda.hostMu() && n.cevaplayan.length > 0));

  if (!n.acik && cevapladim) {
    const kalan = d.oyuncular.filter(p => p.bagli && !n.cevaplayan.includes(p.id)).length;
    $('nhie-ac').textContent = kalan ? `${kalan} kişi bekleniyor — beklemeden aç` : 'Aç';
  }
}

function bagla() {
  $('nhie-yaptim').onclick = () => Oda.gonder({ t: 'nhieCevap', yaptim: true });
  $('nhie-yapmadim').onclick = () => Oda.gonder({ t: 'nhieCevap', yaptim: false });
  $('nhie-sonraki').onclick = () => Oda.gonder({ t: 'nhieSonraki' });
  $('nhie-ac').onclick = () => Oda.gonder({ t: 'nhieAc' });
  document.querySelectorAll('#nhie-seviye .cip').forEach(b =>
    b.onclick = () => Oda.gonder({ t: 'nhieSeviye', seviye: b.dataset.seviye }));
}

return { ciz, bagla };
})();
