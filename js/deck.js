/* ============================================================
   deck.js — oyun içerikleri (tek kaynak).
   Hem tarayıcı hem sunucu bu dosyayı kullanır: sorular/cümleler
   sunucuda seçilir, istemci yalnızca gösterir.
   ============================================================ */

/* ---------- Never Have I Ever ----------
   seviye: 'hafif' → herkesle oynanır · 'aci' → yakın arkadaş grubu     */
export const NHIE = [
  { s: 'hafif', t: 'Hiç uçağa binmedim.' },
  { s: 'hafif', t: 'Hiç deniz tutmasını yaşamadım.' },
  { s: 'hafif', t: 'Hiç saçımı kendim kesmedim.' },
  { s: 'hafif', t: 'Hiç bir ünlüyle karşılaşmadım.' },
  { s: 'hafif', t: 'Hiç kamp yapmadım.' },
  { s: 'hafif', t: 'Hiç yemek yaparken yangın alarmını çalıştırmadım.' },
  { s: 'hafif', t: 'Hiç bir dizinin bütün sezonunu tek günde bitirmedim.' },
  { s: 'hafif', t: 'Hiç karaoke yapmadım.' },
  { s: 'hafif', t: 'Hiç dövme yaptırmadım.' },
  { s: 'hafif', t: 'Hiç saçımı boyatmadım.' },
  { s: 'hafif', t: 'Hiç toplu taşımada uyuyakalıp durağı kaçırmadım.' },
  { s: 'hafif', t: 'Hiç birinin adını yüzüne karşı yanlış söylemedim.' },
  { s: 'hafif', t: 'Hiç sınavda kopya çekmedim.' },
  { s: 'hafif', t: 'Hiç bir hayvan beslemedim.' },
  { s: 'hafif', t: 'Hiç yurt dışında yaşamadım.' },
  { s: 'hafif', t: 'Hiç ehliyet sınavından kalmadım.' },
  { s: 'hafif', t: 'Hiç bir konserde en ön sırada olmadım.' },
  { s: 'hafif', t: 'Hiç telefonumu suya düşürmedim.' },
  { s: 'hafif', t: 'Hiç doğum günümü unutmadım.' },
  { s: 'hafif', t: 'Hiç birine yanlışlıkla ekran görüntüsü atmadım.' },
  { s: 'hafif', t: 'Hiç sabaha kadar oyun oynamadım.' },
  { s: 'hafif', t: 'Hiç market alışverişinde kartım reddedilmedi.' },
  { s: 'hafif', t: 'Hiç yürüyen merdivende ters yöne gitmedim.' },
  { s: 'hafif', t: 'Hiç bir şeyi ters giydiğimi gün ortasında fark etmedim.' },
  { s: 'hafif', t: 'Hiç arkadaşımın sevgilisinin adını karıştırmadım.' },
  { s: 'hafif', t: 'Hiç toplantıda mikrofonum açık unutulmadı.' },
  { s: 'hafif', t: 'Hiç bir yemeği beğenmediğim halde "çok güzel olmuş" demedim.' },
  { s: 'hafif', t: 'Hiç alarmı kurmayı unutup işe/okula geç kalmadım.' },
  { s: 'hafif', t: 'Hiç bir filmi izlerken ağlamadım.' },
  { s: 'hafif', t: 'Hiç kendi kendime konuşurken yakalanmadım.' },
  { s: 'hafif', t: 'Hiç birinin selamını başkasına sandığım için el sallamadım.' },
  { s: 'hafif', t: 'Hiç sosyal medyada eski bir gönderiyi yanlışlıkla beğenmedim.' },
  { s: 'hafif', t: 'Hiç tek başıma sinemaya gitmedim.' },
  { s: 'hafif', t: 'Hiç bir şarkının sözlerini yıllarca yanlış bilmedim.' },
  { s: 'hafif', t: 'Hiç kapıyı çekip anahtarı içeride bırakmadım.' },

  { s: 'aci', t: 'Hiç gece yarısı eski sevgilime mesaj atmadım.' },
  { s: 'aci', t: 'Hiç birinin sosyal medyasında çok eskiye kaydırıp beğeniye basmadım.' },
  { s: 'aci', t: 'Hiç yalan söyleyip bir davete gitmekten kurtulmadım.' },
  { s: 'aci', t: 'Hiç bu masadakilerden birine yalan söylemedim.' },
  { s: 'aci', t: 'Hiç birinin mesajını okuyup günlerce cevap vermemezlik etmedim.' },
  { s: 'aci', t: 'Hiç hasta numarası yapıp işe gitmedim.' },
  { s: 'aci', t: 'Hiç birinin telefonunu izinsiz karıştırmadım.' },
  { s: 'aci', t: 'Hiç arkadaşımın kırıldığı bir şeyi arkasından anlatmadım.' },
  { s: 'aci', t: 'Hiç bir ilişkiyi mesajla bitirmedim.' },
  { s: 'aci', t: 'Hiç iki kişiyle aynı anda yazışmadım.' },
  { s: 'aci', t: 'Hiç gece kulübünde ağlamadım.' },
  { s: 'aci', t: 'Hiç ertesi gün bir önceki geceyi hatırlamadığım olmadı.' },
  { s: 'aci', t: 'Hiç birinin adını sohbetin ortasında sormak zorunda kalmadım.' },
  { s: 'aci', t: 'Hiç arkadaşımın eşyasını kırıp söylemedim.' },
  { s: 'aci', t: 'Hiç birine "yoldayım" deyip daha evden çıkmamış olmadım.' },
  { s: 'aci', t: 'Hiç bu odadakilerden birine gizlice hayranlık duymadım.' },
  { s: 'aci', t: 'Hiç sarhoşken alışveriş yapmadım.' },
  { s: 'aci', t: 'Hiç bir arkadaşımın sevgilisini beğenmediğimi söylemedim.' },
  { s: 'aci', t: 'Hiç kavga ettiğim biriyle hiçbir şey olmamış gibi davranmadım.' },
  { s: 'aci', t: 'Hiç birini kıskandırmak için bir şey paylaşmadım.' },
  { s: 'aci', t: 'Hiç birinin doğum gününü hatırlamayıp son anda hediye almadım.' },
  { s: 'aci', t: 'Hiç toplu fotoğrafta kendimi beğenmediğim için sildirmedim.' },
  { s: 'aci', t: 'Hiç birine yaşımı ya da maaşımı olduğundan farklı söylemedim.' },
  { s: 'aci', t: 'Hiç birinin arkasından konuşurken yakalanmadım.' },
  { s: 'aci', t: 'Hiç bir arkadaşımın sırrını başkasına anlatmadım.' },
  { s: 'aci', t: 'Hiç taksi/otobüs beklerken birini ekip kaçmadım.' },
  { s: 'aci', t: 'Hiç tanımadığım biriyle sabaha kadar konuşmadım.' },
  { s: 'aci', t: 'Hiç birine "seni sonra ararım" deyip hiç aramadım.' },
  { s: 'aci', t: 'Hiç bu masadakilerden biri hakkında rüya görmedim.' },
  { s: 'aci', t: 'Hiç birinin yüzüne gülüp arkasından güldüğüm olmadı.' },
];

/* ---------- Şişe çevirmece: seçilen kişiye görev ---------- */
export const GOREVLER = [
  'Bir hikâye anlat: en son ne zaman utandın?',
  'Soldaki kişiye bir iltifat et.',
  'Telefonundaki son fotoğrafı göster.',
  'Bir kadeh kaldır ve masaya kısa bir konuşma yap.',
  'Grup adına birini seç ve o kişi bir yudum alsın.',
  'En sevdiğin şarkının nakaratını söyle.',
  'Bir sırrını açıkla (küçük olabilir).',
  'Karşındakinin taklidini yap.',
  'Son aradığın kişiyi söyle.',
  'Bir yudum al ya da bir doğruyu söyle: seçim senin.',
  'Sağdaki kişiye bir soru sor, cevap vermek zorunda.',
  'Bir dakika boyunca gülmemeye çalış.',
  'En kötü alışverişini anlat.',
  'Masadaki herkese bir kelimeyle sıfat ver.',
  'Telefonundaki en çok dinlediğin şarkıyı aç.',
];

export const NHIE_SEVIYE = { hafif: 'Hafif', aci: 'Acı biber', hepsi: 'Karışık' };

/** Kullanılmışları atlayarak rastgele bir öğe seçer. → {i, item} */
export function pick(list, kullanilan, rnd = Math.random) {
  const musait = list.map((_, i) => i).filter(i => !kullanilan.includes(i));
  const havuz = musait.length ? musait : list.map((_, i) => i);
  if (!musait.length) kullanilan.length = 0;
  const i = havuz[Math.floor(rnd() * havuz.length)];
  kullanilan.push(i);
  return { i, item: list[i] };
}
