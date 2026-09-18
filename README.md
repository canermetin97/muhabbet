# Muhabbet

Kalabalık bir masada, herkes kendi telefonundan oynadığı parti oyunları.
Oda kodunu paylaş, katıl, oyna. Kurulum yok, derleme adımı yok, bağımlılık yok.

**Canlı:** https://canermetin97.github.io/muhabbet/

## Oyunlar

| Oyun | Durum | Nasıl çalışır |
|---|---|---|
| **Şişe Çevirmece** | hazır | Şişe herkesin telefonunda aynı anda aynı kişiye döner; seçilene bir görev düşer. |
| **Ben Hiç…** | hazır | Cümle herkese gider, herkes gizlice cevaplar, son kişi de cevaplayınca hepsi birden açılır. |
| **Tabu** | yakında | Kelimeyi yalnızca anlatan görür; karşı takım yasaklıları görüp ihlali yakalar. |
| **Bil Bakalım!** | yakında | Cevabı sayı olan bir soru; en yakın tahmini yapan kazanır. |
| **Apti** | yakında | Kuralları netleşince eklenecek. |

## Nasıl oynanır

Biriniz **Yeni Oda Kur** der, çıkan 5 haneli kodu paylaşır. Diğerleri aynı menüden
kodu girip katılır. Odayı kuran kişi oyunu seçer. En fazla 12 kişi.

Bağlantın koparsa sayfayı yenilediğinde aynı yerine ve puanına dönersin.
Oda tamamen boşalınca sıfırlanır.

## Yapı

| Dosya | İçerik |
|---|---|
| `js/deck.js` | **Tek kaynak içerik:** cümleler, görevler. Sunucu da bunu kullanır. |
| `js/room.js` | Oda bağlantısı: kimlik, WebSocket, yeniden bağlanma. Kural işletmez. |
| `js/sise.js` · `js/nhie.js` | Oyun görünümleri. |
| `js/app.js` | Ekran yönlendirme. |
| `server/src/index.js` | Otoriter sunucu (Cloudflare Worker + Durable Object). |

Sunucu otoriter: cümleleri ve hedefleri o seçer, cevapları o toplar. **Kimin ne
cevapladığı, herkes cevaplayana kadar hiçbir telefona gönderilmez** — erken sızma olmaz.

## Geliştirme

```bash
python3 -m http.server 4322                  # istemci
cd server && npx wrangler dev --port 8788 --local   # sunucu (hesap gerekmez)
```

## Yayına alma

```bash
git push                                     # istemci → GitHub Pages
cd server && npx wrangler deploy             # sunucu → Cloudflare
```

`index.html` içindeki `?v=N` ile `sw.js` içindeki `SURUM` **birlikte** artırılmalı,
yoksa tarayıcı eski dosyaları servis etmeye devam eder.

## İçerik eklemek

`js/deck.js` düz bir liste. Yeni cümle ya da görev eklemek için diziye bir satır
eklemek yeterli; `seviye` alanı `hafif` ya da `aci` olabilir.
