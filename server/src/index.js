/* ============================================================
   Muhabbet — parti oyunları sunucusu (Cloudflare Durable Object)
   Oda kodu bir Durable Object'e karşılık gelir; oyuncular, sıra ve
   oyun durumu orada tutulur. İçerikler js/deck.js'ten gelir — istemci
   ile aynı dosya.
   ============================================================ */
import * as Deck from '../../js/deck.js';

const MAX_OYUNCU = 12;
const AD_UZUNLUK = 14;

export class Oda {
  constructor(state) {
    this.state = state;
    this.soketler = new Map();      // ws -> oyuncuId
    this.T = null;
  }

  /* ---------------- bağlantı ---------------- */
  async fetch(req) {
    const url = new URL(req.url);
    if (req.headers.get('Upgrade') !== 'websocket') {
      return Response.json({ ok: true, oyuncu: this.T ? this.T.oyuncular.length : 0 });
    }
    const id = url.searchParams.get('id') || crypto.randomUUID();
    const ad = (url.searchParams.get('ad') || 'Oyuncu').slice(0, AD_UZUNLUK).trim() || 'Oyuncu';

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    server.accept();

    const hata = this.bagla(server, id, ad);
    if (hata) {
      server.send(JSON.stringify({ t: 'hata', mesaj: hata }));
      server.close(1008, hata);
      return new Response(null, { status: 101, webSocket: client });
    }

    server.addEventListener('message', e => {
      let m; try { m = JSON.parse(e.data); } catch { return; }
      try { this.mesaj(id, m); } catch (ex) {
        try { server.send(JSON.stringify({ t: 'hata', mesaj: String(ex.message || ex) })); } catch {}
      }
    });
    server.addEventListener('close', () => this.kopar(server));
    server.addEventListener('error', () => this.kopar(server));
    return new Response(null, { status: 101, webSocket: client });
  }

  bagla(ws, id, ad) {
    if (!this.T) this.T = this.yeniOda();
    const T = this.T;
    let p = T.oyuncular.find(x => x.id === id);

    if (p) {
      for (const [eski, eid] of this.soketler) {          // aynı kimlikle eski soketi kapat
        if (eid === id) { this.soketler.delete(eski); try { eski.close(1000, 'yeni bağlantı'); } catch {} }
      }
      p.bagli = true;
      p.ad = ad;
    } else {
      if (T.oyuncular.length >= MAX_OYUNCU) return `Oda dolu (en fazla ${MAX_OYUNCU} kişi).`;
      p = { id, ad, bagli: true, puan: 0, katildi: Date.now() };
      T.oyuncular.push(p);
    }
    if (!T.hostId) T.hostId = p.id;
    this.soketler.set(ws, id);
    this.yayinla();
    return null;
  }

  kopar(ws) {
    const id = this.soketler.get(ws);
    this.soketler.delete(ws);
    if (!id || !this.T) return;
    const p = this.T.oyuncular.find(x => x.id === id);
    if (p) p.bagli = false;

    const acik = this.T.oyuncular.filter(x => x.bagli);
    if (acik.length === 0) { this.T = null; return; }        // oda boşaldı → sıfırla
    if (this.T.hostId === id) this.T.hostId = acik[0].id;
    this.nhieKontrol();
    this.yayinla();
  }

  /* ---------------- durum ---------------- */
  yeniOda() {
    return {
      faz: 'lobi', oyun: null, hostId: null, oyuncular: [],
      sise: { tur: 0, aci: 0, hedefId: null, gorev: null, ceviren: null },
      nhie: { seviye: 'hepsi', cumle: null, cevaplar: {}, acik: false, kullanilan: [], tur: 0 },
    };
  }

  oyuncu(id) { return this.T.oyuncular.find(p => p.id === id); }
  host(id) { return this.T.hostId === id; }

  /* ---------------- gelen mesajlar ---------------- */
  mesaj(id, m) {
    const T = this.T;
    if (!T) return;
    const p = this.oyuncu(id);
    if (!p) return;

    switch (m.t) {
      case 'ad': {
        p.ad = String(m.ad || '').slice(0, AD_UZUNLUK).trim() || p.ad;
        this.yayinla(); break;
      }
      case 'oyunSec': {
        if (!this.host(id)) return;
        const oyun = ['sise', 'nhie'].includes(m.oyun) ? m.oyun : null;
        if (!oyun) return;
        T.oyun = oyun;
        T.faz = 'oyun';
        if (oyun === 'sise') T.sise = { tur: 0, aci: 0, hedefId: null, gorev: null, ceviren: null };
        if (oyun === 'nhie') { T.nhie = { seviye: T.nhie.seviye, cumle: null, cevaplar: {}, acik: false, kullanilan: [], tur: 0 }; this.nhieSonraki(); }
        this.yayinla(); break;
      }
      case 'lobi': {
        if (!this.host(id)) return;
        T.faz = 'lobi'; T.oyun = null;
        this.yayinla(); break;
      }

      /* --- şişe çevirmece --- */
      case 'cevir': {
        if (T.oyun !== 'sise' || T.sise.hedefId) return;
        const aday = T.oyuncular.filter(x => x.bagli);
        if (aday.length < 2) return;
        const secilebilir = aday.filter(x => x.id !== id);
        const hedef = secilebilir[Math.floor(Math.random() * secilebilir.length)];
        const i = T.oyuncular.indexOf(hedef);
        const dilim = 360 / T.oyuncular.length;
        const sapma = (Math.random() - 0.5) * dilim * 0.6;    // aynı kişiye denk gelen ufak sapma
        T.sise = {
          tur: T.sise.tur + 1,
          aci: i * dilim + sapma,
          hedefId: hedef.id,
          gorev: Deck.GOREVLER[Math.floor(Math.random() * Deck.GOREVLER.length)],
          ceviren: id,
        };
        this.yayinla(); break;
      }
      case 'siseTamam': {
        if (T.oyun !== 'sise') return;
        T.sise.hedefId = null; T.sise.gorev = null;
        this.yayinla(); break;
      }

      /* --- never have i ever --- */
      case 'nhieSeviye': {
        if (!this.host(id)) return;
        if (['hafif', 'aci', 'hepsi'].includes(m.seviye)) T.nhie.seviye = m.seviye;
        this.yayinla(); break;
      }
      case 'nhieCevap': {
        if (T.oyun !== 'nhie' || T.nhie.acik || !T.nhie.cumle) return;
        T.nhie.cevaplar[id] = !!m.yaptim;
        this.yayinla();
        this.nhieKontrol(); break;
      }
      case 'nhieAc': {
        if (T.oyun !== 'nhie' || !this.host(id)) return;
        this.nhieAc(); break;
      }
      case 'nhieSonraki': {
        if (T.oyun !== 'nhie' || !this.host(id)) return;
        this.nhieSonraki();
        this.yayinla(); break;
      }
    }
  }

  /* ---------------- nhie yardımcıları ---------------- */
  havuz() {
    const s = this.T.nhie.seviye;
    return s === 'hepsi' ? Deck.NHIE : Deck.NHIE.filter(x => x.s === s);
  }

  nhieSonraki() {
    const T = this.T;
    const liste = this.havuz();
    const { item } = Deck.pick(liste, T.nhie.kullanilan);
    T.nhie.cumle = item.t;
    T.nhie.seviyeEtiket = item.s;
    T.nhie.cevaplar = {};
    T.nhie.acik = false;
    T.nhie.tur++;
  }

  /** Bağlı herkes cevapladıysa kendiliğinden açılır. */
  nhieKontrol() {
    const T = this.T;
    if (!T || T.oyun !== 'nhie' || T.nhie.acik || !T.nhie.cumle) return;
    const bekleyen = T.oyuncular.filter(p => p.bagli && T.nhie.cevaplar[p.id] === undefined);
    if (bekleyen.length === 0) this.nhieAc();
  }

  nhieAc() {
    const T = this.T;
    if (T.nhie.acik) return;
    T.nhie.acik = true;
    T.oyuncular.forEach(p => { if (T.nhie.cevaplar[p.id]) p.puan++; });   // "yaptım" sayacı
    this.yayinla();
  }

  /* ---------------- gönderim ---------------- */
  gorunum() {
    const T = this.T;
    return {
      t: 'durum',
      faz: T.faz, oyun: T.oyun, hostId: T.hostId,
      oyuncular: T.oyuncular.map(p => ({ id: p.id, ad: p.ad, bagli: p.bagli, puan: p.puan })),
      sise: T.sise,
      nhie: {
        seviye: T.nhie.seviye, cumle: T.nhie.cumle, seviyeEtiket: T.nhie.seviyeEtiket,
        acik: T.nhie.acik, tur: T.nhie.tur,
        // cevaplar yalnızca açıldığında paylaşılır
        cevaplar: T.nhie.acik ? T.nhie.cevaplar : {},
        cevaplayan: Object.keys(T.nhie.cevaplar),
      },
    };
  }

  yayinla() {
    if (!this.T) return;
    const paket = JSON.stringify(this.gorunum());
    for (const [ws] of this.soketler) { try { ws.send(paket); } catch {} }
  }
}

export default {
  async fetch(req, env) {
    const parts = new URL(req.url).pathname.split('/').filter(Boolean);   // ['oda', KOD, 'ws']
    if (parts[0] !== 'oda' || !parts[1]) return new Response('Muhabbet sunucusu', { status: 200 });
    const kod = parts[1].toUpperCase().slice(0, 12);
    return env.ODA.get(env.ODA.idFromName(kod)).fetch(req);
  },
};
