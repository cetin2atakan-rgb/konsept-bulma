---
name: "founders-ledger"
description: "İNGİLİZCE şirket tarihi kanalı Founder's Ledger için uçtan uca video paketi üretir (Built On You formatı birebir: 'The ENTIRE History of X in 20 Minutes', 19-21 dk, 2.900-3.300 kelime, 153 kelime/dk; bugünkü sahne → tez → ölçek şoku → 'imkânsız olması gereken' → kurucu doğumundan bugüne kronoloji → tek kelimelik tez; düz çizgi-roman illüstrasyon, kurucu karikatürü; Kokoro am_liam 0.97; Video Studio info_card yıl kartları). Kullanıcı 'Founder's Ledger', 'şirket tarihi kanalı', 'Built On You tarzı', 'ENTIRE History videosu', 'bugünün Ledger videosu' dediğinde veya bu kanal için konu, başlık, script, görsel prompt, assets istediğinde skill adı geçmese bile MUTLAKA kullan. Her video için Script.txt + Visuals.txt + Assets.txt + kaynaklar.md üretir. Why It's Built That Way, Hidden Map America, One Year Stronger ve diğer kanallarla karışmaz; kanal belirsizse önce sor."
---

# Founder's Ledger — Üretim Kılavuzu v2.0

> **v2 DEĞİŞİKLİK ÖZETİ (27 Ekim 2026, Atakan onayı):**
> 1. **Kelime kapısı sert:** 2.900 altı script için Assets yazılmaz, script uzatılır (Apple 1.660 kelimeyle "20 dk" başlığa gelmişti). Başlıktaki dakika gerçek süreye eşit olmak zorunda.
> 2. "Illustrations are original drawings" → **"Illustrations are AI-generated in a comic style."**
> 3. Konu ağırlığı Built On You verisine göre: perakende/otomotiv artar, tüketici teknolojisi azalır.
> 4. Built On You'nun yaptığı şirketler listesi (90 gün yapılmaz).
> 5. "Today" rakamları üretim gününde yeniden kontrol, tarihli.
> 6. 15. videodan sonra 2 yedek başlık kalıbı.
> 7. Tempo haftada **2**; v2 bu kanalın **7. videosuyla** başlar.

**Kaynak (19 Ekim 2026):** Built On You (@BuiltonYou). Nexlev: faceless, monetize, 2026 çıkışlı, tek format ("The ENTIRE History of X in 20 Minutes"). Amazon videosu (jOo8wSIeGus, 20:00) tam transkript olarak ölçüldü: **3.057 kelime, 153 kelime/dk**, bölüm kartı yok, geçişler cümleyle. Thumbnail: sol üst kurucu karikatürü, sağ üst şirket adı dev serif + yıl aralığı + pul ikonu, düz renk arka plan. Görsel stil ekran görüntüsüyle doğrulandı: **düz çizgi-roman illüstrasyon, kalın dış hat, mat renkler** (Atakan kararı: "biz de bu tarz yapalım").

**Kanal kimliği (19 Ekim 2026):** Founder's Ledger, @foundersledger. Slogan "Every company. From the first idea to the last balance sheet." Ses Kokoro `am_liam` 0.97. Yayın **haftada 2** (v2). Kimlik paketi: `kanal_profilleri_2026-10-19.md` bölüm 1; uygulama notu: `video_studio_spec_foundersledger.md`.

**27 Ekim güncellemesi (Nexlev):** Built On You 6 Ekim'de açıldı (ilk 7 hafta toplam ~290 izlenme), 8 videoda 10K abone, haftada ~230K izlenme. Videolar: Amazon 259K · Toyota 122K · Walmart 84K · Microsoft 73K · Costco 27K · Tesla 16K (4 gün) · Nintendo 7.4K · Nike (yeni). ABD'li izleyicinin günlük hayatındaki dev markalar kazanıyor; oyun/teknoloji zayıf. Videolar 19-21 dk, haftada ~2.

**Built On You'nun yaptığı şirketler (90 gün YAPILMAZ):** Amazon, Walmart, Toyota, Microsoft, Costco, Tesla, Nintendo, Nike. Haftalık araştırmada liste güncellenir (About'ta adı geçen IKEA, McDonald's, Stripe, Coca-Cola yakında gelebilir; yapmadan önce kontrol et).

**Kazandıran:** başlık kalıbı sabit (ENTIRE + süre vaadi), herkesin **bugün kullandığı** ABD şirketi, kurucuyu doğumundan alıp bugüne tek oturuşta götürmek, somut rakam ve tarih yoğunluğu, tek kelimelik tez. Kaybettiren: izleyicinin tanımadığı şirket, B2B, yabancı marka, "ders çıkaran" motivasyon dili.

---

## 0. SABİTLER

| Alan | Değer |
|---|---|
| Anlatıcı | Üçüncü şahıs, isimsiz; "we/us" yalnız kapanışta ("From a bell in a garage to a dot on your map… See you at the next build."). Persona yok. |
| Dil | İngilizce; sakin belgesel; "you" hook ve kapanışta, ortada nadir. Kısa bildirim cümleleri + ara ara 30-40 kelimelik ritim cümlesi. |
| Süre | **19-21 dk sabit.** Kelime **2.900-3.300** (153 wpm). Başlıkta "in 20 Minutes" yazar; 19:00 altı ve 21:30 üstü yayınlanmaz. |
| Yapı | 8 blok: HOOK → FOUNDER → FIRST STORE → GROWTH → CRISIS → EMPIRE → TODAY → CLOSE (Bölüm 5) |
| Görsel | **Düz çizgi-roman illüstrasyon**: kalın siyah dış hat, mat 5-6 renk palet, grenli kâğıt dokusu; kurucu **karikatür** (asla fotogerçekçi); sahne başına 1 görsel, 150-200 görsel (Bölüm 7) |
| Kartlar | `[CARD: yıl · metin]` → Video Studio sağ üst lacivert info_card 2,5 sn (video başına 10-16 kart) |
| Ses | Kokoro `am_liam`, hız 0.97, nötr Amerikan belgesel |
| Müzik | Üretilmez/indirilmez; uygulama `Masaüstü\arka plan sesleri\foundersledger.mp3` dosyasını alır (-24 dB, CRISIS bloğunda -21). Visuals.txt'te müzik satırı yok |
| Yayın | **Haftada 2** (v2; 6 kanal toplamı 14). 14 günlük stok = 4 video. |
| Hedef | ABD 25-54 erkek ağırlıklı; RPM 4-8 (business/education) |
| Kategori | Education |

---

## 1. ÜRETİM AKIŞI

1. **Şirket seçimi + başlık** (Bölüm 2-4): Built On You'nun yapmadığı, ABD'de günlük kullanılan şirket; 1 başlık (kalıp sabit), 2 alternatif alt-vaat.
2. **Kaynak toplama** (Bölüm 6.3): kuruluş tarihi, kurucu doğum/ölüm, ilk mağaza adresi/yılı, halka arz yılı ve değeri, kriz yılı, bugünkü gelir/çalışan/piyasa değeri, en az 2 mahkeme/dava veya resmi belge → `kaynaklar.md`. Rakamsız iddia scripte girmez.
3. **Script.txt** — Bölüm 5, 8 blok, `[CARD:]` satırları yerleştirilmiş.
4. **Visuals.txt** — Bölüm 7: 150-200 satır, kurucu karakter kilidi ilk satırda tanımlı.
5. **Assets.txt** — Bölüm 9 (bölüm zaman damgası + kaynak listesi açıklamanın belkemiği).
6. **QC** — Bölüm 10; **tarih/rakam çapraz kontrol + logo/alıntı taraması zorunlu.**

---

## 2. ARAŞTIRMA (haftada bir)

- `youtube_channel_videos` popular + newest — Built On You. Son 30 günde en çok izlenen şirket sınıfını havuza yaz; **aynı şirketi yapma** (izleyici aynı videoyu iki kez izlemez), aynı sınıftan komşu şirketi yap (Amazon yapılmış → Costco, UPS).
- `youtube_video_comments` (Built On You son 5 video): "do X next" istekleri doğrudan havuza; düzeltme yorumları ("the date was actually…") → o konuda ekstra kaynak kontrolü.
- `search_niche_finder_channels` "company history documentary" ile ayda bir yeni klon çıkmış mı bak; başlık kalıbı çakışmasında alt-vaat değiştir.

---

## 3. KONU HAVUZU — SINIFLAR

| Sınıf | Örnek | Ağırlık |
|---|---|---|
| **Perakende (ABD günlük)** | Home Depot, Target, Kroger, Dollar General, Walgreens, Sears (çöküş), Kmart (çöküş) | %35 |
| **Yemek/içecek** | McDonald's, Starbucks, Coca-Cola, Chick-fil-A, Domino's, Hershey, Kellogg's | %25 |
| **Otomotiv/ev/sanayi** | Ford, General Motors, Harley-Davidson, John Deere, Caterpillar, Whirlpool, Lowe's | %20 |
| **Lojistik/ulaşım** | UPS, FedEx, Greyhound, Southwest | %10 |
| **Tüketici teknolojisi** | Apple, Kodak (çöküş), Sony — oyun şirketi yok | %10 |

Kural: izleyici şirketin ürününü **bu hafta** kullanmış olmalı. Yabancı merkezli şirket ancak ABD'de günlük ise (Nintendo, Sony, IKEA).

---

## 4. BAŞLIK

Kalıp **sabit**: `The ENTIRE History of [Şirket] in [N] Minutes` — **N = gerçek süre** (Bölüm 10.0 betiği; 19:xx → "19", 20:xx → "20", 21:xx → "21"). "ENTIRE" büyük. **15. videodan sonra** (veya 3 video üst üste CTR <%4) rotasyon: `How [Şirket] Almost Went Bankrupt` · `The Man Who Built [Şirket]` · `[Şirket]: The Complete Story in [N] Minutes`. Aynı kalıp art arda ≤3 kuralı 15. videodan itibaren geçerli. Şirket adı resmi yazımıyla (McDonald's, Chick-fil-A). Başlıkta rakam/yıl yok; yıl thumbnail'de.

Thumbnail (model birebir; **Bölüm 10.0 madde 2'nin yazılı istisnası:** şirket adı + yıl aralığı thumbnail'de kalır, başka kelime eklenmez): sol üst kurucu karikatürü (illüstrasyondan), sağ üst şirket adı serif ExtraBold krem/siyah, altında "1962 – 2026", köşede pul ikonu; düz tek renk arka plan (şirketin rengine yakın ama logo yok). Metin: yalnız şirket adı + yıl.

---

## 5. SCRIPT İSKELETİ — 8 BLOK, 3.050 KELİME, 20 DK

Ölçüm (jOo8wSIeGus): hook 90 sn/230 kelime; kronoloji bloklar arasında eşit tempo; kapanış 60 sn. Bölüm kartı yok; her blok başında `[N. BLOK]` etiketi (seslendirilmez, chapters.txt'e gider).

| Dk | Blok | Kelime | İçerik |
|---|---|---|---|
| 0:00-1:30 | **[1. HOOK]** | 230 | **Bugünkü duyusal sahne**: "Open the tracking page on an Amazon order tonight and you won't see a store. You'll see a dot…" (izleyicinin bu hafta yaşadığı an) → **tez cümlesi**: "Behind that dot is a company built on [tek kelime]." → **ölçek şoku** 2-3 rakam: gelir, çalışan, günlük işlem → **"what should be impossible"**: aynı dönemde ölen 3-4 rakip adı ("Sears, Toys R Us, Borders…") → **soru**: "So how did a [kitap satan web sitesi] become…?" → "This is the entire history of X." |
| 1:30-4:00 | **[2. FOUNDER]** | 380 | Kurucu **doğumundan**: yıl, kasaba, aile işi, çocukluk alışkanlığı (garajda motor, gazete dağıtımı), ilk işi, kırılma anı (bir rakam görür/bir şey okur). `[CARD: 1964 · Jeff Bezos born, Albuquerque]`. Ebeveyn adları yalnız kaynaklıysa. |
| 4:00-7:00 | **[3. FIRST STORE]** | 460 | İlk mekân: adres/şehir, yıl, kaç metrekare, ilk gün cirosu, ilk çalışan sayısı, ilk ürün. Komik/garip detay (garajdaki zil, kapı masası). `[CARD: 1995 · First sale: a textbook]`. Para: kimden, ne kadar, hangi şartla. |
| 7:00-10:00 | **[4. GROWTH]** | 460 | 3-5 yıllık büyüme: mağaza sayısı yıl yıl, halka arz (yıl, fiyat, toplanan para), ilk rakip kavgası, kültür kuralı (iki pizza, 10 ayak kuralı). 3-4 `[CARD]`. |
| 10:00-13:00 | **[5. CRISIS]** | 460 | Neredeyse batış: yıl, borç/hisse düşüşü rakamı, dava/soruşturma (mahkeme belgesi kaynaklı), kurucunun kararı, kaç kişi işten çıkarıldı. **Ağır olmasına izin ver**; müzik burada yükselir. "In [yıl], the company was [N] months from running out of cash." |
| 13:00-16:00 | **[6. EMPIRE]** | 460 | Kriz sonrası sıçrayış: yan iş (AWS, Walmart Supercenter), satın almalar, yeni ülke, kurucunun ayrılması/ölümü ve halefi. Tez kelimesi burada 2. kez. |
| 16:00-19:00 | **[7. TODAY]** | 420 | Bugün: gelir, çalışan, mağaza/kullanıcı, piyasa değeri (`[CARD: 2026 · $X revenue · N employees]`), açık eleştiri 1 paragraf (sendika, antitröst, çevre) **kaynaklı**, kurucu bugün ne yapıyor. |
| 19:00-20:00 | **[8. CLOSE + CTA]** | 180 | **Kapanış üçlüsü**: "It was never really about [X]. It was never about [Y]. It was built on [tek kelime]." → hook sahnesine dönüş ("From a bell in a garage to a dot on your map.") → "If it clicked, like and subscribe for the full story of more companies, one founder at a time." → **yorum sorusu** izleyicinin kişisel anısı ("what was the first thing you ever ordered from Amazon?") → "See you at the next build." |

### 5.1 Anlatım kuralları (transkriptten)
- **CTA yalnız kapanışta.** Ortada like/subscribe/retention kancası yok (model hiç kullanmıyor).
- Her 100 kelimede en az 1 somut rakam veya yıl. Video başına ~45 rakam; yuvarlanmış ("about 1.5 million employees") ama kaynaklı.
- Zaman akışı tek yönlü, flashback yok. Blok geçişi cümleyle: "Then came 2001."
- Kurucu **insan**: zaafı, tuhaf alışkanlığı, bir kez yanıldığı yer anlatılır; kahramanlaştırma ve "lesson for entrepreneurs" dili yok.
- Alıntı yalnız **kaynaklı ve kelimesi kelimesine**; yoksa dolaylı anlatım ("he later said he regretted the price"). Uydurma alıntı YASAK.
- Tez kelimesi 3 kez: hook, EMPIRE, CLOSE. Tek kelime (impatience, repetition, trust, cheapness).
- Cümle 10-22 kelime; teknik/finans terimi → hemen sade karşılık ("an IPO, the day a private company starts selling shares to the public").

---

## 6. SCRIPT KURALLARI (kırmızı çizgi)
- **KISALTMA YASAĞI (Script.txt):** Scriptte noktalı kısaltma yok — Dr., Mr., Mrs., Ms., St., Jr., Sr., vs., etc., Inc., Co., Corp., Ltd., No., U.S., a.m./p.m., e.g., i.e. YASAK; TTS/hizalama noktayı cümle sonu sanıyor, ses bozuluyor. Yaz: Doctor, Mister, Missus, Saint, Junior, Senior, versus, and so on, Incorporated, Company, Corporation, Limited, Number, United States, in the morning/at night, for example. Şirket adındaki nokta da yazıyla: "Amazon dot com", "Walmart Incorporated". Rakam/yıl/ondalık serbest (3.5 yerine 'three point five' tercih). Kısaltma yalnız görsel promptlarında, `[CARD:]` metninde ve Assets.txt'te serbest. QC'de `grep -nE '\b[A-Za-z]{1,4}\. [A-Za-z]'` ile tara.

### 6.1 Yasaklar
- Uydurma alıntı, uydurma diyalog, "he thought to himself".
- Yaşayan kişi hakkında kaynaksız kişisel iddia (sağlık, evlilik, suç). Mahkeme kararı varsa karar dili.
- Hisse tavsiyesi, "buy/sell", fiyat tahmini. Açıklamada "Not financial advice."
- Resmi logo, ambalaj, maskot çizimi (görsel kuralı 7.3); scriptte marka adı serbest.
- Motivasyon/ders dili: "the lesson here is", "if you want to succeed".

### 6.2 Zorunlu cümleler
- Hook'ta "This is the entire history of [Şirket]."
- CLOSE'da "See you at the next build."
- Açıklamada: "Sources are listed above. Illustrations are AI-generated in a comic style. Not financial advice."

### 6.3 Kaynak kuralı
Her tarih/rakam → `kaynaklar.md`: SEC 10-K/S-1 (halka arz, gelir, çalışan), şirket tarihçesi sayfası, kurucu biyografisi/memuar (yazar, yıl, sayfa), mahkeme kararı (CourtListener), Britannica/Smithsonian/müze arşivi, 2 büyük gazete. Açıklamaya 6-10 kaynak "Sources" başlığıyla. İki kaynak çelişirse yuvarla ve "roughly" de; bulunamayan rakam **silinir**.

---

## 7. GÖRSEL SİSTEM — DÜZ ÇİZGİ-ROMAN

### 7.1 Kural: sahne başına 1 görsel, kurucu her karede aynı
Visuals.txt ≈150-200 satır (6-8 sn). Her satır: `N. IMAGE: img_NNN.png | ANCHOR: "ilk 5 kelime"` + isteğe bağlı `| CARD: yıl | metin`. Video Studio Ken Burns uygular (`gorsel-video-prompt-sistemi` ile üret).

### 7.2 Stil kilidi (her promptun sonuna aynen eklenir)
`flat comic-book illustration, bold black outlines, flat muted color palette (navy, cream, brick red, mustard, teal), subtle paper grain, no gradients, no photorealism, no text, no logos, 16:9`

### 7.3 Kurucu karakter kilidi
Visuals.txt 1. satırından önce bir `CHARACTER:` satırı: yaş aralığı, saç, gözlük, giysi, tipik duruş — **karikatür, gerçek yüz kopyası değil** ("a caricature inspired by a 1990s tech founder: shaved head, grey sweater, wide grin"). Her kurucu promptunda bu satır tekrar edilir; yaşlanma blok blok ("now in his fifties, grey at the temples").
- Logo, ambalaj, maskot, gerçek reklam **çizilmez**; mağaza tabelası düz renkli boş veya "GENERAL STORE" gibi jenerik metin. Marka adı yalnız kart metninde.
- Mekân sahneleri: dönem doğru (1960'lar arabası, 1990'lar CRT), kalabalık yüzler basit.
- Rakam sahneleri: grafik değil **metafor** (para yığını, uzayan kuyruk, haritada çoğalan noktalar); gerçek rakam kartta.
- CRISIS bloğunda palet soğur (lacivert/gri ağırlık), EMPIRE'da ısınır.

### 7.4 Kart kuralı
`[CARD: 1997 · IPO at $18 a share]` — kart metni ≤40 karakter, yıl zorunlu. Video başına 10-16 kart; aynı 60 saniyede 2'den fazla kart yok.

---

## 8. SES
- Kokoro `am_liam`, hız 0.97. Nötr Amerikan belgesel; soru cümlelerinde hafif yükselme.
- Rakamlar yazıyla okunur mu kontrol: "1.5 million" → "one point five million" scriptte yazılı.
- Müzik: `foundersledger.mp3` (klasörden otomatik), -24 dB, `[5. CRISIS]` -21, CLOSE son 20 sn end screen altında -20.

---

## 9. ASSETS.TXT
```
## TITLE: The ENTIRE History of Walmart in 20 Minutes
## ALTERNATİF (2)
## DESCRIPTION
[1 cümle: şirket + tez kelimesi]
[2 cümle: ne anlatılıyor, hangi yıllar]
⏱ Chapters: (chapters.txt'ten 8 blok)
📚 Sources: (6-10, kurum/yazar/yıl/link)
Every Founder's Ledger episode tells the full story of one company… Not financial advice.
## TAGS (15): [şirket] history, history of [şirket], [kurucu] story, company history, business documentary, …
## PINNED COMMENT: yorum sorusu tekrar + "Which company should we build next?"
## THUMBNAIL BRIEF: kurucu karikatürü sol üst (img_NNN), arka plan tek renk #HEX, metin "[ŞİRKET]" + "[yıl] – 2026", STAMP: [nötr ürün ikonu: shopping cart / burger / box]
## THUMBNAIL TEXT: [ŞİRKET] | 1962 – 2026
## baslik_kaydi satırı
```

---

## 10.0 TESLİM ÖNCESİ KALİTE KAPISI (ortak — 6 kanalın hepsinde aynı, v2 · 27 Ekim 2026)

Paket bu kapıdan geçmeden teslim edilmez. Teslim mesajında **"KAPI"** başlığıyla 10 maddenin sonucu tek satırda raporlanır.

1. **Başlık uzunluğu:** hedef ≤70 karakter · 70-90 uyarı · **>95 red** (YouTube 100'ü kabul etmez). Alternatif başlıklar da aynı sınıra tabidir. `title.py` (yt-package) varsa lint sonucu pakete yazılır; yoksa `len()`.
2. **Thumbnail yazısı:** ≤3 kelime, başlıktaki hiçbir kelimeyi tekrar etmez (kanal kuralında yazılı istisna yoksa).
3. **Bölümler gerçek kelime sayısından hesaplanır**, hedef tablodan değil. 00:00 ile başlar, ≥3 bölüm, her biri ≥10 sn:
```python
import re
WPM = 153  # bu kanalın ses hızı
raw = open("Script.txt", encoding="utf-8").read()
secs = []
for line in raw.splitlines():
    s = line.strip()
    m = re.match(r"^\[(.+?)\]$", s)
    if m and not re.match(r"(CARD|STUDY|LABEL)", m.group(1)):
        secs.append([m.group(1), 0]); continue
    if secs and s and not s.startswith("["):
        secs[-1][1] += len(s.split())
t = 0
for name, w in secs:
    print(f"{int(t//60)}:{int(t%60):02d}  {name}  ({w} kelime)"); t += w / WPM * 60
print("TOPLAM SÜRE", f"{int(t//60)}:{int(t%60):02d}")
```
4. **Başlık ve hook iddiası kaynağı aşamaz:** kaynaklar.md'deki çalışma/belge ne söylüyorsa en fazla o. "Linked in studies" diyorsan o bağı gösteren çalışma kaynaklar.md'de olmalı.
5. **AI açıklaması dürüst:** "original drawings / original illustrations / hand-drawn originals" **yasak**. Yaz: "Illustrations are AI-generated." Gerçekçi görsel kullanan kanalda yükleme ekranındaki **"Altered or synthetic content"** kutusu işaretlenir (kanal kuralında belirtilir).
6. **Görsel tekrar sınırı:** aynı prompt/görsel bir videoda en fazla **1 kez** yeniden kullanılır; "wide angle / slightly tighter framing / different angle" varyantları tekrar sayılır. Görsel sayısı her bloğun kelime payıyla orantılı (±%20); kapanışa şişirilmiş görsel verilmez; "final shot / closing shot" ifadesi en fazla 2 kez.
7. **ANCHOR = script cümlesinin ilk 5 kelimesi, birebir.** Görsel tarifi ANCHOR olarak yazılmaz.
8. **KONTROL ET listesi:** doğrulanamayan her tarih, sayı, isim pakette ayrı listede teslim edilir. Script içi tutarlılık taraması: sayılan şey sayıyla eşleşiyor mu ("twice" deyip üç olay, "five moves" deyip dört hareket yok), aynı olgu iki yerde farklı rakamla geçmiyor mu.
9. **Başlık kalıbı rotasyonu:** `baslik_kaydi.txt`'e bak; aynı başlık kalıbı art arda **en fazla 3** videoda. (Tekrar eden içerik politikası; Eli Holloway kanalı bu yüzden uyarı aldı.)
10. **Tempo ve değerlendirme:** 6 kanalın toplam başlangıç temposu **haftada 14 video** (bu kanalın payı Bölüm 0 "Yayın" satırında). Kesim/konsept kararı izlenme sayısıyla verilmez: **10 video + 30 gün** dolunca gösterim, CTR ve ortalama izlenme yüzdesiyle verilir. v2 formatına geçilen video (kanalın 7. videosu) sayaç başlangıcıdır.

## 10. KALİTE KONTROL (kanala özel)
- [ ] **Kısaltma taraması:** Script.txt'te noktalı kısaltma yok; şirket adı noktası yazıyla
- [ ] Başlık kalıbı birebir; şirket ABD'de günlük kullanılan; Built On You aynı şirketi yapmamış
- [ ] **Kelime 2.900-3.300 (sert kapı: altındaysa Assets yazılmaz, script uzatılır)**; 8 blok etiketi; blok süreleri ±30 sn; başlıktaki dakika = gerçek süre
- [ ] Şirket Built On You listesinde değil (90 gün)
- [ ] TODAY rakamları (gelir, çalışan, piyasa değeri) üretim gününde kontrol edildi, kaynaklar.md'de "as of [tarih]"
- [ ] Hukuki dil: "found guilty" yalnız ceza davasında; hukuk davasında "found liable" / "settled"
- [ ] Hook: duyusal sahne + tez + ölçek şoku + ölü rakipler + soru + "This is the entire history of"
- [ ] Tez kelimesi 3 kez (hook/EMPIRE/CLOSE); kapanış üçlüsü + "See you at the next build" + kişisel yorum sorusu
- [ ] CTA yalnız kapanışta
- [ ] Her 100 kelimede ≥1 rakam/yıl; her rakam kaynaklar.md'de; çelişen rakam "roughly"
- [ ] Alıntı taraması: tırnak içindeki her cümle kaynaklı; yoksa dolaylı anlatıma çevrildi
- [ ] 10-16 `[CARD]`, metin ≤40 karakter, yıl var, 60 sn'de ≤2
- [ ] Visuals.txt 150-200 satır; CHARACTER satırı var; her kurucu promptunda tekrar; stil kilidi her promptta; logo/maskot/ambalaj yok
- [ ] Thumbnail: karikatür + şirket adı + yıl aralığı + pul; logo yok; son 5 kapaktan farklı renk
- [ ] Açıklama: chapters + 6-10 kaynak + sabit alt metin

---

## 11. HAFTALIK VERİ
`youtube-analitik-koc` ile.
- Hafta 1-2: CTR ≥%5 hedef; altındaysa arka plan rengi/kurucu ifadesi değişir; kalıp rotasyonu yalnız 15. videodan sonra.
- **AVD ≥%40** (20 dk'da ≥8 dk). Altındaysa hook'taki ölü rakip listesi kısalır, FIRST STORE öne çekilir.
- Hangi sınıf (Bölüm 3) kazanıyor → 4. haftada ağırlık güncelle.
- Yorumlarda "do X next" sayımı → havuz sırası.
- Haftada tek değişken. Kesim kararı: Bölüm 10.0 madde 10 (10 video + 30 gün; gösterim/CTR/AVD).

## 12. KIRMIZI ÇİZGİLER
- 19-21 dk; çizgi-roman stili; am_liam — 42 gün değişmez. Başlık kalıbı 15. videoya kadar sabit, sonra rotasyon (Bölüm 4).
- Uydurma alıntı/diyalog asla; kaynaksız rakam silinir.
- Logo/maskot/ambalaj çizimi asla.
- Built On You'nun yaptığı şirketi 90 gün içinde yapma.
- Yayınlanan video silinmez; tarih hatası → pinned comment düzeltmesi.

## 13. KANAL AYRIMI
| Kanal | Fark |
|---|---|
| Why It's Built That Way | nesne/mühendislik "neden", şema ağırlıklı, 26 dk. Burada şirket kronolojisi, karikatür. |
| Hidden Map America | coğrafya, persona Walter Hale, 30-35 dk geri sayım. Burada persona yok. |
| The Carrow Institute | kurum/tarih vaka, arşiv estetiği. Burada şirket biyografisi. |
| One Year Stronger | sağlık/egzersiz, el çizimi. |
Kanal belirsizse ÖNCE SOR.
