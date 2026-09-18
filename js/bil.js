/* ============================================================
   bil.js — "Bil Bakalım!" görünümü.
   Doğru cevap ve tahminler sunucuda tutulur; açılana kadar
   hiçbir telefona gönderilmez.
   ============================================================ */
const Bil = (() => {
const $ = id => document.getElementById(id);

/** 44000 → "44.000" · 42.195 → "42,195" */
const bicim = n => {
  if (!isFinite(n)) return '—';
  const ondalik = Math.abs(n % 1) > 1e-9 ? (String(n).split('.')[1] || '').length : 0;
  return n.toLocaleString('tr-TR', { maximumFractionDigits: Math.min(ondalik, 3) });
};

function ciz(d) {
  const b = d.bil || {};
  $('bil-kod').textContent = Oda.kod() || '';
  $('bil-tur').textContent = b.tur ? `${b.tur}. soru` : '';
  $('bil-soru').textContent = b.soru || '…';
  $('bil-birim').textContent = b.birim || '';

  const tahminEttim = b.tahminEden.includes(Oda.kimlik());

  // giriş alanı yalnızca cevap vermemişken
  $('bil-cevap-alani').classList.toggle('gizli', b.acik || tahminEttim);
  $('bil-gonder').classList.toggle('gizli', b.acik || tahminEttim);
  $('bil-sonraki').classList.toggle('gizli', !(b.acik && Oda.hostMu()));
  $('bil-ac').classList.toggle('gizli', !(!b.acik && Oda.hostMu() && b.tahminEden.length > 0));

  if (!b.acik && Oda.hostMu()) {
    const kalan = d.oyuncular.filter(p => p.bagli && !b.tahminEden.includes(p.id)).length;
    $('bil-ac').textContent = kalan ? `${kalan} kişi bekleniyor — beklemeden aç` : 'Aç';
  }

  // doğru cevap
  const dogru = $('bil-dogru');
  dogru.classList.toggle('gizli', !b.acik);
  if (b.acik) {
    $('bil-dogru-sayi').textContent = bicim(b.cevap) + (b.birim ? ' ' + b.birim : '');
    $('bil-not').textContent = b.not || '';
  }

  // tahmin listesi
  const liste = $('bil-liste');
  liste.innerHTML = '';
  const sira = d.oyuncular.slice();
  if (b.acik) {
    sira.sort((x, y) => {
      const fx = b.tahminler[x.id] === undefined ? Infinity : Math.abs(b.tahminler[x.id] - b.cevap);
      const fy = b.tahminler[y.id] === undefined ? Infinity : Math.abs(b.tahminler[y.id] - b.cevap);
      return fx - fy;
    });
  }
  sira.forEach(p => {
    const el = document.createElement('div');
    let sinif = 'satir';
    if (p.id === Oda.kimlik()) sinif += ' ben';
    if (b.acik && b.kazananlar.includes(p.id)) sinif += ' kazanan';
    if (!b.acik && !b.tahminEden.includes(p.id)) sinif += ' bekliyor';
    el.className = sinif;

    const tahmin = b.tahminler[p.id];
    const deger = b.acik
      ? (tahmin === undefined ? '—' : bicim(tahmin))
      : (b.tahminEden.includes(p.id) ? '✓' : '⋯');
    const fark = (b.acik && tahmin !== undefined)
      ? (b.kazananlar.includes(p.id) ? '🏆 en yakın' : '±' + bicim(Math.abs(tahmin - b.cevap)))
      : '';
    el.innerHTML = `<span class="ad">${p.ad}</span>` +
                   `<span class="deger">${deger}</span>` +
                   `<span class="fark">${fark}</span>` +
                   (p.puan ? `<span class="fark">${p.puan} puan</span>` : '');
    liste.appendChild(el);
  });
}

function gonder() {
  const kutu = $('bil-tahmin');
  // "12.500" ve "12,5" ikisini de kabul et
  const ham = kutu.value.trim().replace(/\s/g, '').replace(/\.(?=\d{3}\b)/g, '').replace(',', '.');
  const sayi = Number(ham);
  if (!kutu.value.trim() || !isFinite(sayi)) { kutu.focus(); return; }
  Oda.gonder({ t: 'bilTahmin', sayi });
  kutu.value = '';
}

function bagla() {
  $('bil-gonder').onclick = gonder;
  $('bil-tahmin').addEventListener('keydown', e => { if (e.key === 'Enter') gonder(); });
  $('bil-sonraki').onclick = () => Oda.gonder({ t: 'bilSonraki' });
  $('bil-ac').onclick = () => Oda.gonder({ t: 'bilAc' });
}

return { ciz, bagla };
})();
