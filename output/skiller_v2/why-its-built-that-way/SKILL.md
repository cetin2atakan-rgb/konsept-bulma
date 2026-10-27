---
name: "why-its-built-that-way"
description: "İNGİLİZCE 'gündelik şeylerin tuhaf mühendislik/tarih nedeni' kanalı Why It's Built That Way için uçtan uca video paketi üretir (Weirdward Bound formatı birebir: 'Why Does America Use 60 Hz…' soru başlığı, 25-27 dk, 3.700-4.100 kelime, 145 kelime/dk; somut rakam hook → soru → tarih (kişiler, yıllar) → asıl neden → ya olmasaydı → bugün → genelleme + end-screen işareti; sahne + şema görselleri, [LABEL:] terim bandı, LABELS ok/etiket; Kokoro am_puck 1.0). Kullanıcı 'Why It's Built That Way', 'neden böyle kanalı', 'Weirdward tarzı', 'mühendislik tarihi videosu', 'bugünün Built videosu' dediğinde veya bu kanal için konu, başlık, script, görsel prompt, assets istediğinde skill adı geçmese bile MUTLAKA kullan. Her video için Script.txt + Visuals.txt + Assets.txt + kaynaklar.md üretir. Geniş konu çatısıyla başlar, tutan sınıfa daralır. Founder's Ledger, Hidden Map America ve diğer kanallarla karışmaz; kanal belirsizse önce sor."
---

# Why It's Built That Way — Üretim Kılavuzu v2.0

> **v2 DEĞİŞİKLİK ÖZETİ (27 Ekim 2026, Atakan onayı):**
> 1. **Daralma erkene çekildi:** Weirdward verisi net — elektrik/ev tesisatı 128K-1.4M, tren/ulaşım 5-6K, tarih/yaşam 2-11K. Sonraki 14 video: elektrik 9, bina/ev 3, standart 2, ulaşım 0.
> 2. Weirdward'ın yaptığı sorular listesi (90 gün yapılmaz).
> 3. Kapanış genellemesindeki örnekler her videoda değişir ve olgu kontrolünden geçer (sabit "railroad gauge / driving on the left / QWERTY" üçlüsü kalktı).
> 4. Standart/yönetmelik iddiası kaynaklar.md'ye **madde metniyle** yazılır.
> 5. "Diagrams and illustrations are original" → AI açıklaması.
> 6. Başlık ≤70 karakter hedef.
> 7. Tempo haftada **3**; v2 bu kanalın **7. videosuyla** başlar. Stoktaki ray genişliği videosu varsa elektrik videolarından sonraya konur.

**Kaynak (19 Ekim 2026):** Weirdward Bound (@WeirdwardBound). Nexlev: faceless, monetize, 2026 çıkışlı; tutan videolar elektrik ağırlıklı (60 Hz, nötr tel, fiş delikleri). 60 Hz videosu (7voH3cm2h1M, 27:30) tam transkript ölçüldü: **3.987 kelime, 145 kelime/dk**. Açılış: "Every single day, the electricity flowing through the walls of your home pulses at a very specific rhythm… 60 times per second… 50 times per second. And that difference, those 10…" Kapanış: genelleme ("railroad track gauges, driving on the left, the QWERTY keyboard. The details change, the pattern does not.") + end screen işareti ("that video is on screen"). CTA ortada yok.

**Kanal kimliği (19 Ekim 2026):** Why It's Built That Way, @whyitsbuiltthatway. Slogan "Everyday things have reasons. Most of them are strange." Ses Kokoro `am_puck` 1.0. Yayın **haftada 3** (v2). Kimlik paketi: `kanal_profilleri_2026-10-19.md` bölüm 3; uygulama notu: `video_studio_spec_whyitsbuilt.md`.

**Atakan kararı (19 Ekim):** "ilk başta genişten başlayalım, tutan konsepte göre daraltırız." **v2 (27 Ekim):** model kanalın verisi daralmayı şimdiden gösterdi, elektrik ağırlığa geçildi (Bölüm 3).

**27 Ekim güncellemesi (Nexlev):** Weirdward 65K abone, son 3 haftada haftada ~900K izlenme. Kazananlar: 60 vs 50 Hz 1.4M · US 120V 307K · neutral wire 287K · solid vs stranded 177K · plug prong holes 163K · antenna before radio 128K · neutral thinner 74K. Kaybedenler: train wheels 6K · railroad friction bearings 5.6K · malls 4.4K · saloon girls 4.2K · Viagra 1.9K · Japan 50/60 Hz 4.1K (aynı konunun tekrarı).

**Weirdward'ın yaptığı sorular (90 gün YAPILMAZ):** 60/50 Hz, Japonya 50/60 Hz, 60 Hz Kuzey Amerika, ABD 120V, nötr tel ne yapar, nötr neden ince, fiş deliği, solid vs stranded, izolatör diskleri, hattaki toplar, inverter, direnç/Ohm, volt-amper-watt, 3 faz 6 terminal, evde elektrik baştan sona, anten, pil, rebar teli, korsan uydu TV, GPS, plastik, tren tekerleği, sürtünme yatağı.

---

## 0. SABİTLER

| Alan | Değer |
|---|---|
| Anlatıcı | Üçüncü şahıs, meraklı mühendis-tarihçi; "you/your home/your wall" sık; "I" yok; persona yok. |
| Dil | İngilizce; açıklayıcı, rakam yoğun, hafif mizah ("and that is why your toaster…"). Cümle 10-24 kelime. |
| Süre | **25-27 dk.** Kelime **3.700-4.100** (145 wpm). |
| Yapı | 7 blok: HOOK → THE QUESTION → HISTORY → THE REAL REASON → WHAT IF → TODAY → CLOSE (Bölüm 5) |
| Görsel | İki tip: `TYPE: scene` (dönem sahnesi, sinematik illüstrasyon, Ken Burns açık) ve `TYPE: diagram` (koyu gri #1C2228 zemin, ince beyaz çizgi teknik şema, tek vurgu turkuaz, Ken Burns kapalı, `LABELS` ile ok+etiket) (Bölüm 7) |
| Bantlar | `[LABEL: terim]` → alt bantta terim 3 sn (caption modülü); video başına 15-25 |
| Ses | Kokoro `am_puck`, hız 1.0 |
| Müzik | Üretilmez/indirilmez; uygulama `Masaüstü\arka plan sesleri\whyitsbuilt.mp3` dosyasını alır (-24 dB; `[4. THE REAL REASON]` -21). Visuals.txt'te müzik satırı yok |
| Yayın | **Haftada 3** (v2; 6 kanal toplamı 14). 14 günlük stok = 6 video. |
| Hedef | ABD/UK/Kanada/Avustralya/Almanya 25-54 erkek ağırlıklı; RPM 4-7 |
| Kategori | Education |

---

## 1. ÜRETİM AKIŞI

1. **Soru + başlık** (Bölüm 2-4): izleyicinin evinde/şehrinde **bugün** gördüğü bir şey; tek soru.
2. **Kaynak toplama** (Bölüm 6.3): karar anı (yıl, kişi, kurum), rakamlar, standart belgesi, 2 ikincil kaynak → `kaynaklar.md`.
3. **Script.txt** — Bölüm 5, 7 blok, `[LABEL:]` satırları.
4. **Visuals.txt** — Bölüm 7: 250-320 satır, scene/diagram oranı ~60/40, diagram'larda `LABELS`.
5. **Assets.txt** — Bölüm 9.
6. **QC** — Bölüm 10; **rakam/birim + sol-sağ/polarite taraması zorunlu** (elektrik videolarında hata hızlı yakalanır).

---

## 2. ARAŞTIRMA (haftada bir)

- `youtube_channel_videos` popular + newest — Weirdward Bound; ikincil: Practical Engineering, Technology Connections (uzun oyuncu, format farklı ama **soru havuzu**). Tutan soru sınıfını not et.
- `youtube_video_comments` (Weirdward son 5): "do a video on X" → havuz; düzeltme yorumları → o konuda ekstra kaynak.
- Hafta 4: bizim 14 videonun sınıf bazlı AVD/CTR → Bölüm 3 ağırlıkları yeniden yazılır (daralma kararı burada).

---

## 3. KONU HAVUZU — SINIFLAR (geniş başlangıç)

| Sınıf | Örnek (Weirdward'ın yapmadıkları) | Sonraki 14'te |
|---|---|---|
| **Elektrik/ev tesisatı** | GFCI prizindeki TEST/RESET düğmesi, ana şalter neden 200 amper, 240V kurutucu prizi neden farklı, alüminyum kablo dönemi, üç uçlu fiş ne zaman zorunlu oldu, ark arızası sigortası (AFCI), elektrik sayacı nasıl ölçer, sigorta vs şalter, topraklama çubuğu, ışık anahtarı yönü (ABD vs İngiltere), polarize fiş neden bir ucu geniş | **9** |
| **Bina/ev** | 8 ft tavan, Amerikan evlerinin ahşap olması, rögar kapağı yuvarlak, 2x4 kereste neden 2x4 değil, su ısıtıcısı tankı neden 40 galon | **3** |
| **Standartlar** | A4 vs Letter, 12 saatlik saat, mil/inç | **2** |
| **Ulaşım** | (model kanalda 5-6K; yalnız 30 gün verisi tutarsa denenir) | **0** |

Kural: izleyici nesneyi **evinden çıkmadan** görebilmeli veya her gün geçtiği yerde olmalı. Soyut bilim ("neden gökyüzü mavi") bu kanal değil.

---

## 4. BAŞLIK

Kalıplar: `Why Does America Use 60 Hz While Europe Uses 50 Hz?` (karşılaştırma sorusu) · `What Does the Neutral Wire Actually Do?` (actually) · `Why Train Wheels Are Shaped Like That (It's Not What You Think)` (parantez kancası) · `Why Did Early Electric Homes Keep Blowing Up?` (tarihsel şok). Soru işareti veya parantez zorunlu; rakam varsa başlıkta (60 Hz, 4 ft 8.5 in). Clickbait yok; soru dürüst, video cevaplıyor.

Thumbnail: koyu zemin, tek nesne büyük teknik çizim (fiş, tekerlek, tel), turkuaz vurgu, metin 2-4 kelime beyaz ExtraBold ("60 Hz vs 50 Hz", "WHY?"), yüz yok.

---

## 5. SCRIPT İSKELETİ — 7 BLOK, 3.900 KELİME, 26 DK

Ölçüm (7voH3cm2h1M): hook 40 sn, soru 2 dk, tarih **en uzun blok** (~10 dk, isimler ve yıllar), asıl neden 5 dk, what-if 3 dk, bugün 3 dk, kapanış 1,5 dk. Bölüm kartı yok; `[N. BLOK]` etiketleri chapters.txt'e.

| Dk | Blok | Kelime | İçerik |
|---|---|---|---|
| 0:00-0:45 | **[1. HOOK]** | 110 | **Somut rakam, izleyicinin evinde**: "Every single day, the electricity flowing through the walls of your home pulses at a very specific rhythm… 60 times per second." → karşıtlık (Avrupa 50) → "And that difference… [sonuç]: your clocks, your motors, your video frame rates." Soru henüz yok. |
| 0:45-2:45 | **[2. THE QUESTION]** | 290 | Soruyu açıkça kur: "So why?" → sezgisel cevabın yanlış olduğunu söyle ("It is not because one is better.") → yol haritası tek cümle ("To understand, we have to go back to a lab in New Jersey in 1882.") → `[LABEL: frequency]` ilk terim bandı. |
| 2:45-12:30 | **[3. HISTORY]** | 1.450 | Kronolojik, **isim + yıl + yer** yoğun: Edison 1882 Pearl Street DC; Tesla/Westinghouse AC; 1891 Frankfurt; AEG 50 Hz kararı; Westinghouse 60 Hz; 1890'lar frekans savaşı (133 Hz, 25 Hz Niagara); Californian 50 Hz 1948'e kadar. Her 90-120 kelimede 1 sahne değişimi; teknik terim → sade karşılık. 8-12 `[LABEL:]`. Bir "insan" anekdotu (mühendisin notu, patent kavgası). |
| 12:30-17:30 | **[4. THE REAL REASON]** | 730 | **Asıl neden** çoğu zaman sıkıcı/tesadüfi: ark lambası titremesi, trafo demiri, "60 was a round number in a 60-second minute". Mühendislik mekanizması burada en derin, şema ağırlıklı (diagram %70). Müzik yükselir. "The real reason is less heroic than the legend." |
| 17:30-20:30 | **[5. WHAT IF]** | 440 | Karşı-olgu: ya herkes 50 olsaydı? Motor boyutu, saat, Japonya'nın ikiye bölünmüş şebekesi (50/60) gerçek örnek olarak. Kilitlenme maliyeti rakamla (ne kadar harcanır değiştirmek?). |
| 20:30-24:00 | **[6. TODAY]** | 500 | Bugün izleyicinin evinde iz: cihaz etiketi 50/60 Hz, seyahat adaptörü, kamera flicker, inverterler. "Next time you look at the back of your charger…" |
| 24:00-26:00 | **[7. CLOSE + CTA]** | 280 | **Genelleme kalıbı**: "This is the same pattern as [3 benzer örnek — **her videoda farklı, kanalın kendi videoları öncelikli**, efsaneye dayanan örnek yok (“sürüş tarafı kılıç eli” gibi), olgu kontrollü; “never revisited” deme: İsveç 1967'de sağa geçti]. The details change. The pattern does not." → tek cümle tez (küçük bir mühendislik kararı, yüz yıl kilitlenme) → **end-screen işareti**: "If you want to see another case where a small decision locked in consequences for a century, that video is on screen." → kısa like/subscribe + yorum sorusu ("What is the strangest standard in your country?"). |

### 5.1 Anlatım kuralları (transkriptten)
- Hook'ta soru yok, **rakam** var; soru 2. blokta.
- HISTORY'de her paragraf **kişi + yıl + yer**; isimsiz "engineers decided" yasak, kaynaklı isim şart.
- Sezgisel yanlış cevap **söylenir ve çürütülür** ("you might think… but").
- Teknik terim ilk geçişte `[LABEL:]` + sade karşılık aynı cümlede.
- Birimler hem metrik hem imperial ilk geçişte ("4 feet 8 and a half inches, about 1.4 meters").
- CTA ortada yok; kapanış genellemesi 3 örnekle, son cümle end-screen işareti.
- Mizah kuru, cümle sonunda; alay yok.
- Tahmin/efsane → "the popular story says… the records show…" ayrımı her videoda ≥1.

---

## 6. SCRIPT KURALLARI (kırmızı çizgi)
- **KISALTMA YASAĞI (Script.txt):** Scriptte noktalı kısaltma yok — Dr., Mr., Mrs., St., Jr., vs., etc., Inc., Co., No., U.S., U.K., a.m./p.m., e.g., i.e., ft./in./Hz. YASAK; TTS/hizalama noktayı cümle sonu sanıyor, ses bozuluyor. Yaz: Doctor, Mister, Saint, versus, and so on, Incorporated, Company, Number, United States, United Kingdom, in the morning, for example, feet, inches, hertz. Rakam/yıl/ondalık serbest (8.5 yerine 'eight and a half' tercih). Kısaltma yalnız görsel promptlarında, `LABELS`/`[LABEL:]` metninde ve Assets.txt'te serbest (orada "60 Hz" yazılır). QC'de `grep -nE '\b[A-Za-z]{1,4}\. [A-Za-z]'` ile tara.

### 6.1 Yasaklar
- Elektrik/gaz/yapı konularında **yap-kendin talimatı**: "unscrew the panel and touch…" yok; "a licensed electrician" ifadesi tehlikeli konuda zorunlu.
- Doğrulanmamış efsaneyi gerçek gibi anlatmak (Edison fil hikâyesi vb.) → "popular story / records show" ayrımı.
- Marka karalaması; ürün tavsiyesi/affiliate.
- Gerçek logo çizimi (görsel 7.3).
- Komplo dili ("they don't want you to know").

### 6.2 Zorunlu cümleler
- Tehlikeli altyapı konusunda (elektrik, gaz, yapı): "Do not test this at home; this is work for a licensed electrician."
- CLOSE'da genelleme kalıbı + end-screen işareti.

### 6.3 Kaynak kuralı
**Standart/yönetmelik iddiası** (NEC, IEC, BS) → kaynaklar.md'ye **madde numarası + madde metni** (veya güvenilir özet) yazılır; script madde metninin söylediğinden fazlasını söylemez (ışık anahtarı videosunda NEC 404.7'nin kapsamı yanlış okunmuştu). Her tarih/isim/rakam → `kaynaklar.md`: standart belgesi (IEEE, IEC, NEC, ANSI, ISO), patent numarası ve yılı (Google Patents), kurum tarihçesi, müze/arşiv (Smithsonian, IET, Deutsches Museum), 1 akademik tarih makalesi, 2 ikincil. Açıklamaya 6-10 kaynak. Çelişen tarih → "around 1891"; bulunamayan isim → paragraf yeniden yazılır, uydurulmaz.

---

## 7. GÖRSEL SİSTEM — SAHNE + ŞEMA

### 7.1 Kural: sahne başına 1 görsel, tip belirtilir
Visuals.txt ≈250-320 satır (4-7 sn). `N. IMAGE: img_NNN.png | TYPE: scene|diagram | ANCHOR: "…"`; diagram satırına isteğe bağlı `| LABELS: A@(x,y) "Neutral"; B@(x,y) "Phase"` (x,y 0-1 normalize; Video Studio ok+etiket basar). Oran ≈ scene %60 / diagram %40; `[4. THE REAL REASON]` diagram %70. `gorsel-video-prompt-sistemi` ile üret.

### 7.2 Stil kilitleri (promptun sonuna aynen)
- **scene:** `cinematic period illustration, painterly realism, muted warm palette, historically accurate clothing and machinery, soft volumetric light, no text, no logos, no recognizable real faces, 16:9`
- **diagram:** `clean technical diagram, thin white line art on dark slate background (#1C2228), single teal accent (#2FB8B0), isometric or cross-section view, blueprint feel, no text, no labels, no numbers, 16:9`

### 7.3 Kurallar
- Diagram'da **metin/rakam yok**; etiketler Video Studio `LABELS` ile basılır (yazım hatası riski sıfır).
- **Her diagram'ın `LABELS` satırı O GÖRSELE ÖZGÜ olmalı.** Aynı etiket metnini/koordinatını bir sonraki diagram'a KOPYALAMA (örnek pakette 10 şemanın hepsinde `A@(0.32,0.45) "Blade"; B@(0.68,0.45) "Hole"` vardı: video boyunca her 3. görselde aynı yazı tekrar etti). Etiket, o şemanın promptunda çizilen parçaya karşılık gelsin; koordinatı o parçanın görseldeki yerine göre ver. Aynı nesne iki şemada gerçekten gerekiyorsa en fazla 1 kez tekrar et; ≥3 şemada aynı LABELS olursa uygulama uyarı verir.
- **Polarite/yön**: scriptte left/right, phase/neutral, clockwise geçen her cümle için prompt yönü belirtir; LABELS koordinatı yöne uygun.
- Gerçek kişiler (Edison, Tesla) **dönem sahnesi içinde silüet/uzak plan**, portre yok; adı kartta değil scriptte.
- Logo/marka yok; cihaz jenerik.
- Aynı şema farklı açıdan 2-3 kez kullanılabilir (öğrenme sürekliliği), tamamen aynı görsel ardışık 2 kez olmaz.
- Hook ve TODAY: izleyicinin evi (duvar, priz, şarj cihazı) modern scene.

### 7.4 Bant kuralı
`[LABEL: alternating current]` → terim alt bantta 3 sn, ≤24 karakter; video başına 15-25; aynı terim 1 kez.

---

## 8. SES
- Kokoro `am_puck`, hız 1.0; meraklı, net, soru cümlelerinde yükselme. Rakamlar scriptte yazıyla okunabilir biçimde ("sixty hertz").
- Müzik `whyitsbuilt.mp3` (klasörden), -24 dB; REAL REASON -21; CLOSE son 20 sn end screen altında -20.

---

## 9. ASSETS.TXT
```
## TITLE: Why Does America Use 60 Hz While Europe Uses 50 Hz?
## ALTERNATİF (2)
## DESCRIPTION
[2 cümle: soru + kısa cevap vaadi (cevabı vermeden)]
⏱ Chapters: 7 blok
📚 Sources: 6-10 (standart/patent/arşiv/makale)
Illustrations and diagrams are AI-generated. Sources are listed above. If you know a detail we missed, say it in the comments — corrections are welcome.
## TAGS (15): [konu] explained, why [konu], history of [konu], engineering explained, weird history, …, built that way
## PINNED COMMENT: yorum sorusu + "Corrections welcome; we update the description."
## END SCREEN: işaret edilen bizim videomuz (stoktan en yakın sınıf)
## THUMBNAIL BRIEF: koyu zemin, tek nesne teknik çizim (img_NNN diagram), turkuaz vurgu, metin "60 Hz vs 50 Hz"
## THUMBNAIL TEXT: 2-4 kelime
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
WPM = 145  # bu kanalın ses hızı
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
- [ ] **Kısaltma taraması:** Script.txt'te noktalı kısaltma yok (Hz./ft./in./U.S. dahil); birimler yazıyla
- [ ] Başlık soru/parantez, ≤70 karakter hedef; nesne izleyicinin evinde/yolunda; Weirdward listesinde değil (90 gün); sınıf elektrik ağırlığına uygun
- [ ] Kelime 3.700-4.100; 7 blok; HISTORY en uzun (1.300-1.600)
- [ ] Hook rakam var soru yok; soru 2. blokta; sezgisel yanlış cevap çürütüldü
- [ ] HISTORY'de her paragraf isim+yıl+yer, hepsi kaynaklı; "popular story / records show" ≥1
- [ ] Tehlikeli konuda "licensed electrician" cümlesi
- [ ] CLOSE: 3 örnekli genelleme (örnekler önceki videodan farklı, olgu kontrollü, efsane yok) + "The details change, the pattern does not" + end-screen işareti + yorum sorusu; CTA ortada yok
- [ ] Standart/yönetmelik iddiaları kaynaklar.md'de madde metniyle
- [ ] 15-25 `[LABEL:]`, ≤24 karakter, tekrar yok
- [ ] Visuals.txt 250-320 satır; TYPE her satırda; diagram oranı %35-45; diagram'da metin yok; LABELS koordinat 0-1 ve HER şemada farklı (kopya yok); **polarite/yön** scriptle uyumlu
- [ ] Gerçek kişi portresi yok; logo yok
- [ ] Thumbnail koyu + tek nesne + turkuaz + 2-4 kelime; son 5'ten farklı nesne

---

## 11. HAFTALIK VERİ
`youtube-analitik-koc` ile.
- Hafta 1-2: CTR ≥%5; altındaysa thumbnail nesnesi büyür/metin kısalır.
- **AVD ≥%35** (26 dk'da ≥9 dk). Altındaysa HISTORY 1.450 → 1.200, REAL REASON öne (12:30 → 10:30).
- **Daralma (v2'de uygulandı):** elektrik ağırlığı başladı. 30 gün sonra bina/standart videoları elektrik medyanının yarısının altındaysa elektrik %80'e çıkar; adı değişmez.
- End-screen tıklama oranı: işaret edilen videonun sınıfı not edilir.
- Haftada tek değişken. Kesim kararı: Bölüm 10.0 madde 10 (10 video + 30 gün; gösterim/CTR/AVD).

## 12. KIRMIZI ÇİZGİLER
- 25-27 dk; scene+diagram stili; am_puck; soru başlığı — 42 gün değişmez (sınıf ağırlığı değişebilir, format değişmez).
- Kaynaksız isim/yıl asla; efsane gerçek gibi anlatılmaz.
- Yap-kendin elektrik/gaz talimatı asla.
- Weirdward başlıkları birebir kopyalanmaz.
- Yayınlanan video silinmez; hata → pinned comment + açıklama güncellemesi.

## 13. KANAL AYRIMI
| Kanal | Fark |
|---|---|
| Founder's Ledger | şirket kronolojisi, kurucu karikatürü, 20 dk. Burada nesne/standart, şema. |
| Hidden Map America | coğrafya, persona, 30-35 dk geri sayım. Burada persona yok, tek soru. |
| The Carrow Institute | kurum vaka/arşiv. Burada mühendislik nedeni. |
Kanal belirsizse ÖNCE SOR.
