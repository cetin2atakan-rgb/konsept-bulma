---
name: "hidden-map-america"
description: "İNGİLİZCE ABD bölgesel coğrafya kanalı Hidden Map America için uçtan uca video paketi üretir (America with Amos'tan türetilmiş v2 formatı: 28-38 dk, 3.900-5.200 kelime, 15'ten 1'e geri sayım, her madde ~280 kelime; dönüşümlü başlık kalıpları; emekli ilçe arazi ölçüm mühendisi Walter Hale birinci tekil; AI manzara + harita noktası + madde kartı; Kokoro am_eric 0.95). Kullanıcı 'Hidden Map America', 'Walter Hale', 'coğrafya kanalı', 'Amos tarzı', 'bölge videosu' dediğinde veya bu kanal için bölge, başlık, script, görsel prompt, assets istediğinde skill adı geçmese bile MUTLAKA kullan. Her video için Script.txt + Visuals.txt + Assets.txt + kaynaklar.md + facts.csv + avatar_metni.txt (avatar_toplu.mp4 için konuşma metni) üretir. Why It's Built That Way, Founder's Ledger, Uncharted Earth ve diğer kanallarla karışmaz; kanal belirsizse önce sor."
---

# Hidden Map America — Üretim Kılavuzu v2.0

> **v2 DEĞİŞİKLİK ÖZETİ (27 Ekim 2026, Atakan onayı):**
> 1. **Süre 28-38 dk, 15 madde (15→1)**, ~3.900-5.200 kelime, 220-300 görsel (v1: 55-70 dk, 25 madde, 400-550 görsel). Amos'un zirvesi 18-22 dk videolardaydı; 1 saati aşınca düşüş başladı.
> 2. **Başlık rotasyonu:** "Is Hiding Something" en fazla 3 videoda 1. Amos tam bu kalıpla çöküyor (son 3 videosu 600-4K).
> 3. **Persona mesleği:** emekli coğrafya öğretmeni (Amos'un birebiri) → **emekli ilçe arazi ölçüm mühendisi (county surveyor)**. İsim (Walter Hale) ve persona.png aynı.
> 4. Bölge havuzu Amos'un yaptıklarına göre yenilendi.
> 5. Fotogerçekçi AI manzara → AI açıklaması + "Altered or synthetic content" kutusu.
> 6. Olgu kontrolü: jeoloji/hidroloji USGS ile çapraz; script içi sayı tutarlılığı.
> 7. Tempo haftada **2**; v2 bu kanalın **7. videosuyla** başlar.
> 8. **Video Studio uyumu kontrol edilecek:** uygulama 15 `[FACT]` satırını ve "number fifteen" başlangıcını kabul ediyor mu, ilk v2 videosunda test et. Avatar anekdot tespiti `I used to…` / `I remember…` kalıplarıyla çalışmaya devam eder (öğretmen kalıpları `my students` / `I taught` artık kullanılmaz).

**27 Ekim güncellemesi (Nexlev):** Amos 2 ayda 11.3K abone, haftalık izlenme 443K → 373K → 705K → 720K → **385K**; son 3 video 606 / 3.2K / 4.1K. İlk hitleri 18-22 dk (South Texas 397K hariç), son videoları 1 saat – 1 saat 48 dk. Tek başlık kalıbı 30 kez kullanıldı.

**Amos'un yaptığı bölgeler (6 ay YAPILMAZ veya farklı alt bölgeye bölünür):** South/Central/North/East/West Texas, Northern Alabama (×2), Western/Eastern North Carolina, Eastern Oklahoma, Southern Missouri, Southern Ohio, Eastern/Western Kentucky, Northern/Southern Georgia, Upstate South Carolina, Southern Illinois, Northern/Western Arkansas, Southwest Virginia, East Tennessee, Southern Louisiana, Northeast Mississippi, Northeast/Western Pennsylvania, West Virginia, Western Maryland, Southern Indiana, Northern Montana.

**Kaynak (19 Ekim 2026):** America with Amos (@AmericawithAmos). Nexlev: faceless (persona illüstrasyon), monetize, 2026 çıkışlı; Güney/Appalachia bölgeleri tutuyor, Batı tutmuyor. South Texas videosu (dd7aLWyZQ_E, 58:05) tam transkript ölçüldü: **7.993 kelime, 138 kelime/dk**, "25 remarkable geographic facts" **Fact 25 → Fact 1** geri sayım, her madde ~300 kelime / 2:15. Açılış: "South Texas is hiding far more than cattle and mesquite. Beneath its thorny brush lie buried beds of uranium, a salt lake the Spanish crown once claimed for the king…" → persona: "I'm Professor Amos Whitaker, a retired geography teacher…". Kapanış: "There is another Texas beneath the familiar one, and most people never know it's there. I'm Amos Whitaker. Thanks for joining me today. And tell me in the comments which South Texas fact genuinely surprised you the most."

**Kanal kimliği (19 Ekim 2026):** Hidden Map America, @hiddenmapamerica. Persona **Walter Hale** (v2: **emekli ilçe arazi ölçüm mühendisi / county surveyor**, 38 yıl, Kentucky; sınır taşları, tapu haritaları, eski yol güzergâhları onun uzmanlığı). Persona görseli Atakan'ın kendi sisteminden (`persona.png`). Slogan "The America most people drive right past." Ses Kokoro `am_eric` 0.95. Yayın **haftada 2** (v2). Kimlik paketi: `kanal_profilleri_2026-10-19.md` bölüm 4; uygulama notu: `video_studio_spec_hiddenmap.md`.

**Yük (v2):** video başına 220-300 Grok görseli; haftada 2 video ≈ 500-600 görsel/hafta.

---

## 0. SABİTLER

| Alan | Değer |
|---|---|
| Anlatıcı | **Walter Hale**, birinci tekil; "I spent thirty-eight years as a county surveyor in Kentucky…"; **saha anekdotu** videoda 3-4 kez ("I used to walk property lines…", "I remember a boundary stone…"). Kurgusal; açıklamada belirtilir. Öğretmen dili ("my students", "I taught", "my classroom") **kullanılmaz**. |
| Dil | İngilizce; sakin, sıcak, sahada yıllar geçirmiş biri; "you" sık ("if you drove south from…"); cümle 12-26 kelime; coğrafi terim → sade karşılık. |
| Süre | **28-38 dk.** Kelime **3.900-5.200** (138 wpm). |
| Yapı | `[1. HOOK + PERSONA INTRO]` → `[FACT 15]` … `[FACT 1]` (15 madde) → `[2. CLOSE + CTA]` (Bölüm 5) |
| Görsel | AI manzara (fotogerçekçi, sinematik, "golden hour"/"overcast" bölgeye göre), harita kartı, kesit şeması; `TYPE: landscape|map|diagram`; 220-300 görsel (6-9 sn), KB açık (Bölüm 7) |
| Kartlar | `[FACT n: Başlık | LAT,LON]` → 1,5 sn madde kartı + `map_region.png` üzerinde kırmızı nokta (koordinat varsa) |
| Persona | **Walter Hale avatar videosu** (16:9, TEK video `avatar_toplu.mp4`): açılışta tam ekran, bazı madde başlarında + saha anekdotlarında köşede (pip), kapanışta tam ekran. Video Studio videoyu Whisper ile parçalara böler, Script'te ilgili cümlelere yerleştirir; o cümleler avatarın KENDİ sesiyle gelir (geri kalanı Kokoro). Avatar videosu yoksa hareketsiz `persona.png` (0:00-0:12 + kapanış 15 sn). Bölüm 8b |
| Ses | Kokoro `am_eric`, hız 0.95 |
| Müzik | Üretilmez/indirilmez; uygulama `Masaüstü\arka plan sesleri\hiddenmap.mp3` dosyasını alır (-25 dB, kart anında -22, son 3 madde -23). Visuals.txt'te müzik satırı yok |
| Yayın | **Haftada 3-4.** 14 günlük stok = 7 video. |
| Hedef | ABD 45-70, bölge halkı + yol tutkunu; RPM 4-8 |
| Kategori | Education |

---

## 1. ÜRETİM AKIŞI

1. **Bölge + başlık** (Bölüm 2-4): tek ABD alt-bölgesi ("Northern Alabama"), Amos'un yapmadığı veya 6+ ay önce yaptığı.
2. **Madde toplama** (Bölüm 6.3): 15 madde → `facts.csv` (no, başlık, lat, lon, kaynak). Kaynaksız madde listeye girmez; 15 bulunamıyorsa bölge büyütülür, madde uydurulmaz.
3. **Script.txt** — Bölüm 5; `[FACT n]` 15→1, her madde ~280 kelime.
4. **Visuals.txt** — Bölüm 7: 220-300 satır; `map_region.png` ve `persona.png` Assets'te.
5. **Assets.txt** — Bölüm 9 (15 maddelik chapters + kaynaklar + REGION + PERSONA_LINE).
6. **avatar_metni.txt** — Bölüm 8b: Script'ten çıkarılan, avatarın konuşacağı parçalar (kullanıcı bunu avatar aracında TEK videoya çevirir, `avatar_toplu.mp4` adıyla klasöre koyar).
7. **QC** — Bölüm 10; **koordinat ve yön kontrolü zorunlu** (yerel izleyici hatayı anında yazar).

**Kullanıcıya teslim edilen dosyalar (bu sırayla söyle):** `Script.txt`, `Visuals.txt`, `Assets.txt`, `uretim_listesi.txt`, `kaynaklar.md`, `facts.csv`, **`avatar_metni.txt`**. Kullanıcının kendisinin koyacakları: `persona.png`, `map_region.png`, **`avatar_toplu.mp4`** (avatar aracında `avatar_metni.txt`'ten üretilmiş tek video), `hiddenmap.mp3` (Masaüstü\arka plan sesleri).

---

## 2. ARAŞTIRMA (haftada bir)

- `youtube_channel_videos` popular + newest — America with Amos. Tutan bölgeler: Güney, Appalachia, Ozarks, Texas; tutmayan: Batı/Pasifik. **Aynı bölgeyi** 6 ay içinde yapma; komşu bölgeyi yap.
- `youtube_video_comments` (Amos son 5): yerel düzeltmeler ("that's actually in the next county") → bizim QC'ye madde; "do [bölge] next" → havuz.
- Kaynak tarama: USGS, state geological survey, NPS, state historical society, county GIS; Wikipedia yalnız yön bulmak için, kaynak olarak yazılmaz.

---

## 3. BÖLGE HAVUZU — SINIFLAR

| Sınıf | Örnek | Ağırlık |
|---|---|---|
| **Güney — Amos'un yapmadıkları** | Middle Tennessee (Nashville Basin), Mississippi Delta, Kentucky Pennyroyal, Natchez Trace koridoru, Alabama Black Belt, Florida Panhandle, Louisiana Kisatchie tepeleri | %35 |
| **Appalachia — alt bölge** | Eastern Panhandle WV (yapıldı), Cumberland Plateau, New River Valley, Blue Ridge Virginia, Northeast Georgia değil (Amos), Allegheny Plateau NY | %20 |
| **Ozark/Ouachita & Plains** | Ouachita Mountains (Arkansas-Oklahoma), Flint Hills Kansas, Sandhills Nebraska, Oklahoma Panhandle | %20 |
| **Orta Batı tuhaflıkları** | Driftless Area, Upper Peninsula, Iron Range Minnesota, Indiana Dunes kıyısı, Loess Hills Iowa | %20 |
| **Deneme (Batı/Kuzeydoğu)** | Palouse, Downeast Maine, Trans-Pecos (Big Bend dışı) — 14'te en fazla 1 | %5 |

Amos'un yaptığı bölge (yukarıdaki liste) 6 ay içinde yapılmaz; yapılacaksa **farklı alt bölgeye** bölünür ve başlıkta o alt bölge adı geçer.

Bölge ölçeği: bir eyaletin 1/3'ü ile 1/2'si; tüm eyalet değil ("Texas" değil "South Texas").

---

## 4. BAŞLIK

Kalıplar (v2 — 5 kalıp dönüşümlü; aynı kalıp art arda ≤2, "Hiding" kalıbı **en fazla 3 videoda 1**):
- A) `[Bölge]: 15 Hidden Facts Most Americans Never Learned`
- B) `Why [Bölge] Looks Nothing Like the Rest of [Eyalet]`
- C) `The Strangest Places in [Bölge] (And Why They Exist)`
- D) `[Bölge]: What the Map Doesn't Show You`
- E) `[Bölge] Is Hiding Something Most Americans Never Notice` (yalnız 3'te 1)

Bölge adı başta; **≤70 karakter hedef**; Amos'un kalıbını birebir kopyalama.

Thumbnail (v2): sol tarafta `persona.png` (bel üstü, krem gömlek), arka planda bölgenin en çarpıcı manzarası, sağda **2-3 kelimelik merak metni** serif ExtraBold krem ("NOT REALLY WV?", "THE WRONG OCEAN", "MOVED 4 TIMES") — **bölge adı ve başlık kelimeleri tekrar edilmez** (bölge zaten başlıkta); küçük eyalet silueti sağ alt, ilgili alan kırmızı. Sabit "HIDDEN" şeridi kalktı.

---

## 5. SCRIPT İSKELETİ — 15 MADDE, ~4.500 KELİME, ~33 DK (v2)

Ölçüm (dd7aLWyZQ_E, v1 kaynağı): hook+persona 90 sn/210 kelime; madde başı ortalama 300 kelime/2:15; kapanış 60 sn/140 kelime; CTA ortada yok. **v2:** aynı madde iskeleti, 15 madde: 10 × ~260 + 5 × ~340 + hook 210 + kapanış 140 ≈ 4.650 kelime ≈ 34 dk.

| Bölüm | Kelime | İçerik |
|---|---|---|
| **[1. HOOK + PERSONA INTRO]** 0:00-1:30 | 210 | **Bölge adı ilk 3 kelimede** + "is hiding far more than [klişe]" → 4-5 madde teaser'ı somut (uranyum yatakları, kralın tuz gölü, okyanustan tuzlu lagün) → "Today we'll count down fifteen remarkable geographic facts about [bölge]." → **persona**: "I'm Walter Hale. I spent thirty-eight years as a county surveyor in Kentucky, walking property lines and reading old maps, and I still can't drive through a county without wondering why the land looks the way it does." → "Let's start at number fifteen." |
| **[FACT 15 … FACT 6]** | 10 × 260 | Her madde aynı iskelet: `[FACT n: Başlık | LAT,LON]` (seslendirilmez) → "Fact twenty-three." (seslendirilir) → **yer/ölçek** cümlesi (ilçe, mesafe, yükseklik) → **neden böyle** (jeoloji/hidroloji/tarih mekanizması, sade) → **insan izi** (kasaba, yol, çiftlik, kaza, dava) → **görünür ipucu** ("if you drive Route 72 west of Huntsville you'll see…") → kapanış köprüsü yok, direkt sonraki fact. Her 4-5 maddede 1 **saha anekdotu** ("I used to walk property lines out here…", "I remember finding a boundary stone from 1820…"). |
| **[FACT 5 … FACT 1]** | 5 × 340 | Bölgenin kimliğini kuran büyük maddeler (en büyük mağara sistemi, tuhaf sınır, yer altı nehri, Camp/Depot gibi federal sır, jeolojik fay). Fact 1 bölgeyi **tek cümlede özetleyen** gerçek; kapanışa köprü. |
| **[2. CLOSE + CTA]** son 60 sn | 140 | "There is another [bölge] beneath the familiar one, and most people never know it's there." → bir cümle kişisel ("After thirty-eight years I still…") → "I'm Walter Hale. Thanks for joining me today." → **yorum sorusu**: "Tell me in the comments which [bölge] fact genuinely surprised you the most." → subscribe tek cümle + sonraki bölge teaser ("Next week we cross the river into Western Kentucky."). |

### 5.1 Anlatım kuralları (transkriptten)
- Madde numarası **yazıyla** seslendirilir ("Fact twenty-three."), ardından kısa duraklama (nokta).
- Her maddede en az 1 **yol/rota/kasaba adı** (izleyici haritada bulabilmeli) ve 1 **rakam** (yıl, metre/feet, mil, nüfus).
- Mesafeler mil + kilometre ilk geçişte; yükseklik feet + metre.
- Yer adları scriptte **resmi yazımıyla** (Tuscumbia, Cahaba, Talladega); fonetik not scripte girmez, `kaynaklar.md`'ye yazılır ve Kokoro test cümlesiyle dinlenir (Bölüm 8).
- Saha anekdotu kısa (2-3 cümle), gerçek kişi adı yok; `I used to…` veya `I remember…` ile başlar (avatar tespiti).
- Nostalji var, siyaset yok; yerel halk övülür, alay yok.
- "Hidden/hiding" ve "most people" her videoda hook + kapanış; ortada tekrar yok.
- CTA ortada yok; video boyunca akış kesilmez.

---

## 6. SCRIPT KURALLARI (kırmızı çizgi)
- **KISALTMA YASAĞI (Script.txt):** Scriptte noktalı kısaltma yok — Dr., Mr., Mrs., St., Mt., Ft., Rt., Hwy., Co., No., U.S., ft., mi., e.g., i.e. YASAK; TTS/hizalama noktayı cümle sonu sanıyor, ses bozuluyor. Yaz: Doctor, Mister, Saint, Mount, Fort, Route, Highway, County, Number, United States, feet, miles, for example. Yer adlarındaki kısaltma da açılır: "Saint Louis", "Fort Payne", "Mount Cheaha", "Route 72", "US Highway 431" (US noktasız büyük harf serbest). Rakam/yıl/ondalık serbest. Kısaltma yalnız görsel promptlarında, `[FACT:]` kart başlığında ve Assets.txt'te serbest. QC'de `grep -nE '\b[A-Za-z]{1,4}\. [A-Za-z]'` ile tara.

### 6.1 Yasaklar
- Özel mülk/korunan alan için **izinsiz giriş teşviki** ("sneak in", "nobody checks the gate"); hassas mağara/arkeolojik alan için tam koordinat verme (ilçe düzeyi yeter).
- Kabile toprakları/kutsal alanlar: NPS/kabile kaynağı yoksa madde yapılmaz; "sacred" sıfatı yalnız kaynak kullanıyorsa.
- Yerel halk/eyalet hakkında stereotip, siyasi yorum, suç oranı.
- Komplo/paranormal gerçek gibi ("they say it's haunted" → yalnız folklor olarak etiketli, en fazla 1 madde).
- Gerçek bir kişiyi taklit; Walter Hale kurgusal, açıklamada belirtilir.

### 6.2 Zorunlu cümleler
- Hook'ta "fifteen remarkable geographic facts about [bölge]".
- Kapanışta "I'm Walter Hale. Thanks for joining me today." + yorum sorusu.
- Açıklamada persona notu + kaynak listesi (Bölüm 9).

### 6.3 Kaynak kuralı
Her madde → `facts.csv` + `kaynaklar.md`: USGS (jeoloji/hidroloji), state geological survey, NPS/USFS, state historical society/encyclopedia (Encyclopedia of Alabama vb.), county GIS/Census (nüfus, mesafe), 1 yerel gazete. Koordinat **kaynaktan** (USGS GNIS); tahmin koordinat yok, bulunamazsa `[FACT n: Başlık]` koordinatsız (harita noktası basılmaz). Açıklamaya 8-12 kaynak.

---

## 7. GÖRSEL SİSTEM — MANZARA + HARİTA + KESİT

### 7.1 Kural: 6-9 sn'de 1 görsel, üç tip
Visuals.txt ≈220-300 satır. `N. IMAGE: img_NNN.png | TYPE: landscape|map|diagram | ANCHOR: "…"`. Oran ≈ landscape %75 / map %10 / diagram %15. KB yalnız landscape'te açık. `gorsel-video-prompt-sistemi` ile üret.

### 7.2 Stil kilitleri (promptun sonuna aynen)
- **landscape:** `photorealistic cinematic landscape photograph, [bölgeye uygun ışık: soft overcast / golden hour / humid haze], 35mm wide angle, natural colors slightly warm, no people in focus, no text, no signs with readable text, no logos, 16:9`
- **map:** `clean vintage-style regional map illustration, cream paper, thin dark lines, subtle relief shading, muted green and tan, no text, no labels, 16:9` (yer adları Video Studio kartından gelir)
- **diagram:** `clear geological cross-section illustration, textbook style, layered strata in muted earth tones, thin black outlines, no text, no labels, 16:9`

### 7.3 Kurallar
- **Bölge doğruluğu**: bitki örtüsü, kaya rengi, nem, mimari bölgeye uygun (Alabama'da kaktüs yok; Appalachia'da düz ufuk yok). Prompt'a bölge adı + mevsim yazılır.
- Gerçek tabela/yol levhası metni yok (yazım hatası riski); tabela varsa boş veya uzak.
- İnsan yalnız uzak/arkadan silüet; yüz yok.
- Her maddede en az 1 **"görünür ipucu"** görseli (yol kenarından bakış) — izleyici "ben oradan geçtim" hissi.
- `map_region.png` tek dosya, tüm video; nokta koordinatı `[FACT]` satırından (LAT,LON). Koordinat sınırları bölge kutusunun içinde değilse QC durdurur.
- `persona.png` yalnız avatar videosu YOKKEN yedek (açılış/kapanış) ve kapak içindir; Visuals'a yazılmaz, Assets'te yol. Avatar videosu varsa persona.png ekrana basılmaz (avatar üstlenir).
- Fact kartı: Video Studio basar; Visuals'ta ayrı satır yok.

---

## 8. SES
- Kokoro `am_eric`, hız 0.95; yaşlı, sıcak, sahada yıllar geçirmiş biri; acele yok. Madde numarası sonrası nokta → doğal duraklama.
- Zor yer adları tek kelime halinde yazılır; Kokoro okuyamıyorsa test cümlesiyle kontrol, gerekirse heceleme ("Talla-dega" değil; yerine "Talladega" bırak ve dinle).
- Müzik `hiddenmap.mp3` (klasörden), -25 dB; kartta -22; Fact 3-1 -23; outro -21.

---

## 8b. AVATAR (toplu video) — Walter Hale gelip gider

Video Studio (Hart düzeni): kullanıcı `Script.txt` ile TEK parça `avatar_toplu.mp4` verir (16:9, tek video). Uygulama videoyu Whisper ile parçalara böler; her parça Script'teki ilgili cümlelere oturur ve o cümleler **avatarın kendi sesiyle** okunur (geri kalanı Kokoro `am_eric`). Avatarın metni Script'ten **BİREBİR** alınır — kelime değiştirme, ekleme, kısaltma yok; aksi halde hizalama bozulur.

### Hangi cümleler avatarın olur (Video Studio'nun otomatik seçtiği kurallar; `avatar_metni.txt` AYNI kurallarla üretilir)
| Parça | Nerede | Mod |
|---|---|---|
| **Açılış** | `[1. HOOK + PERSONA INTRO]` içinde `I'm Walter Hale…` cümlesinden bloğun sonuna (`Let's start at number fifteen.`) | tam ekran |
| **Madde başı** | 15, 10, 5 ve son 3 madde (3, 2, 1): `Fact N.` + sonraki cümle (v1'deki 25/20 v2'de yok) | köşede (pip) |
| **Saha anekdotu** | FACT bloklarındaki birinci tekil cümleler: `I used to…`, `I remember…` (v2'de öğretmen kalıpları `my students` / `my classroom` / `I taught` kullanılmaz) | köşede (pip) |
| **Kapanış** | Son bloğun son ~45 kelimesi (`I'm Walter Hale. Thanks for joining me today.` dahil) | tam ekran |

Toplam ≈ 2-4 dk avatar konuşması (150-600 kelime). Videonun geri kalanı Kokoro.

### Script'i buna göre yaz (plan bozulmasın)
- Hook'ta `I'm Walter Hale.` cümlesi **tek başına bir cümle** olsun ve hook'un SON parçasında (persona cümlesi + `Let's start at number fifteen.`) dursun; teaser cümleleri bundan ÖNCE gelir.
- Her FACT bloğu `Fact twenty-three.` cümlesiyle başlar (zaten kural), ikinci cümle madde cümlesidir; avatar bunları okuyacağı için **kısaltmasız, rakamlar yazıyla** (avatar aracı rakamı yanlış okuyabilir; Script zaten yazıyla).
- Saha anekdotu cümleleri `I used to…` / `I remember…` kalıbını taşısın (3-4 adet) ve **kendi içinde bütün** olsun (1-3 cümle); anekdot FACT bloğunun ilk iki cümlesine denk gelmesin.
- Kapanışın son 45 kelimesi tek başına anlamlı olsun.
- Avatar metninde telaffuz zor yer adı varsa avatar aracı yanlış okuyabilir: Script'te o parçada yer adını sade bırak ya da parçayı başka cümleyle ver.

### `avatar_metni.txt` (skill her video için üretir)
- İçerik: yukarıdaki kurallarla seçilen parçaların METNİ, sırayla, **parçalar arasında bir boş satır**. Başka hiçbir şey yazma (başlık, numara, parantez yok; kullanıcı aynen avatar aracına yapıştırır).
- Ayrıca sohbette kullanıcıya şunu söyle: *"Bu metni avatar aracında TEK videoya çevir (parçalar arasında 1-2 sn sessizlik bırak, sırayı bozma), 16:9, `avatar_toplu.mp4` adıyla video klasörüne koy."*
- `avatar_metni.txt` yazılırken kural uygulaması: açılış = persona cümlesinden hook sonuna; madde başı = ilk iki cümle; anekdot = eşleşen ardışık cümleler; kapanış = sondan ~45 kelime (cümle sınırında).
- Uygulama aynı dosyayı video klasörü eklendiğinde `output\avatar_metni.txt` olarak da yazar; ikisi farklıysa Script değişmiş demektir (Script'i yeniden üretirsen `avatar_metni.txt`'i de yeniden ver, eski avatar videosu geçersiz olur).

---

## 9. ASSETS.TXT
```
## TITLE: Northern Alabama Is Hiding Something Most Americans Never Notice
## ALTERNATİF (2)
## REGION: Northern Alabama
## REGION_BBOX: 34.0,-88.3,35.0,-85.5   (harita noktası doğrulaması için)
## PERSONA_LINE: Walter Hale · retired county surveyor
## PERSONA_IMG: persona.png
## MAP_IMG: map_region.png
## DESCRIPTION
[Satır 1-2 (arama sonucunda görünür): bölge + "15 geographic facts" + en çarpıcı 3 teaser]
⏱ Chapters: 0:00 Intro · [t] Fact 15 · … · [t] Fact 1 · [t] Closing  (süreler Bölüm 10.0 betiğiyle gerçek kelime sayısından)
📚 Sources: 8-12 (USGS, state survey, NPS, historical society, county, gazete)
Walter Hale is a narrator persona. Landscapes, maps and diagrams are AI-generated based on real geography and may simplify details. Sources: USGS, state geological surveys, NPS — listed above. Know this region? Tell us what we missed.
## TAGS (15): [bölge] geography, [eyalet] geography, hidden america, us geography, [madde anahtarları ×6], hidden map america
## PINNED COMMENT: "Which fact surprised you most? And if you live there — what did I miss?"
## THUMBNAIL BRIEF: persona.png sol, arka plan img_NNN (Fact 1 manzarası), 2-3 kelime merak metni krem serif (başlıkla çakışmaz), eyalet silueti
## THUMBNAIL TEXT: [2-3 kelime, başlıkla çakışmaz] (×3 seçenek)
## baslik_kaydi satırı
```
Ek dosya `facts.csv`: `no,title,lat,lon,source` (15 satır, 15→1).

**Yükleme notu:** fotogerçekçi AI manzaralar gerçek yerleri tasvir ettiği için YouTube "Altered or synthetic content" kutusu işaretlenir.

---

## 10.0 TESLİM ÖNCESİ KALİTE KAPISI (ortak — 6 kanalın hepsinde aynı, v2 · 27 Ekim 2026)

Paket bu kapıdan geçmeden teslim edilmez. Teslim mesajında **"KAPI"** başlığıyla 10 maddenin sonucu tek satırda raporlanır.

1. **Başlık uzunluğu:** hedef ≤70 karakter · 70-90 uyarı · **>95 red** (YouTube 100'ü kabul etmez). Alternatif başlıklar da aynı sınıra tabidir. `title.py` (yt-package) varsa lint sonucu pakete yazılır; yoksa `len()`.
2. **Thumbnail yazısı:** ≤3 kelime, başlıktaki hiçbir kelimeyi tekrar etmez (kanal kuralında yazılı istisna yoksa).
3. **Bölümler gerçek kelime sayısından hesaplanır**, hedef tablodan değil. 00:00 ile başlar, ≥3 bölüm, her biri ≥10 sn:
```python
import re
WPM = 138  # bu kanalın ses hızı
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
- [ ] **Kısaltma taraması:** Script.txt'te noktalı kısaltma yok (St./Mt./Ft./Rt./ft./mi. dahil); yer adları açık yazılmış
- [ ] Başlıkta bölge adı başta; ≤70 karakter hedef
- [ ] Kelime 3.900-5.200; 15 `[FACT]` 15→1 eksiksiz; madde 220-380 kelime; Fact 5-1 daha uzun
- [ ] Hook: bölge adı ilk 3 kelime + 4-5 teaser + "fifteen remarkable geographic facts" + persona cümlesi (county surveyor)
- [ ] Kapanış: "another [bölge] beneath the familiar one" + "I'm Walter Hale. Thanks for joining me today." + yorum sorusu + sonraki bölge
- [ ] Her maddede ≥1 yol/kasaba adı + ≥1 rakam; mil+km, feet+metre ilk geçişte
- [ ] 3-4 saha anekdotu (`I used to…` / `I remember…`); öğretmen dili yok; gerçek kişi adı yok; siyaset/stereotip yok
- [ ] Başlık kalıbı A-E'den; "Hiding" son 3 videoda en fazla 1; bölge Amos listesinde değil (veya farklı alt bölge)
- [ ] Olgu kontrolü: jeoloji/hidroloji iddiaları USGS/state survey ile; script içi sayı tutarlılığı ("twice" / "four moves" tipi hatalar)
- [ ] CTA ortada yok
- [ ] **avatar_metni.txt:** hook'ta `I'm Walter Hale…` tek cümle + hook sonunda; madde başları 15/10/5/3/2/1; ≥4 anekdot parçası; kapanış ~45 kelime; metin Script ile BİREBİR; parçalar boş satırla ayrılı; kullanıcıya "avatar_toplu.mp4 adıyla klasöre koy" denmiş
- [ ] facts.csv 15 satır; koordinatlar GNIS/USGS; hepsi REGION_BBOX içinde; hassas alanlarda ilçe düzeyi
- [ ] kaynaklar.md: her madde kaynaklı; açıklamada 8-12 kaynak; Wikipedia kaynak olarak yok
- [ ] Visuals.txt 220-300 satır; TYPE her satırda; landscape ≈%75; stil kilidi; bölge doğruluğu (bitki/kaya/mimari); tabela metni yok; yüz yok
- [ ] Thumbnail: persona + 2-3 kelime merak metni (bölge adı/başlık kelimesi yok); son 5'ten farklı manzara

---

## 11. HAFTALIK VERİ
`youtube-analitik-koc` ile.
- Hafta 1-2: CTR ≥%4 (uzun video, düşük CTR normal). Altındaysa thumbnail manzarası değişir, persona sabit.
- **AVD ≥%30** (34 dk'da ≥10 dk) ve **Fact 10 noktasında (≈13 dk) retention ≥%40**. Altındaysa hook teaser'ları güçlenir, ilk 5 madde (15-11) daha çarpıcı seçilir.
- Bölge sınıfı performansı (Bölüm 3): Güney/Appalachia beklendiği gibi tutuyorsa Deneme sınıfı kapanır.
- Yorumlarda yerel düzeltme → pinned comment + açıklama güncellemesi; tekrar eden hata tipi QC'ye eklenir.
- Haftada tek değişken. Kesim kararı: Bölüm 10.0 madde 10 (10 video + 30 gün; gösterim/CTR/AVD).

## 12. KIRMIZI ÇİZGİLER
- 28-38 dk; 15→1 format; persona Walter Hale (county surveyor); am_eric — 42 gün değişmez.
- Uydurma madde/koordinat asla; 15 bulunamazsa bölge büyür.
- İzinsiz giriş teşviki, hassas alan koordinatı, stereotip asla.
- Amos'un bölgesini 6 ay içinde yapma.
- Yayınlanan video silinmez; hata → pinned comment + açıklama.

## 13. KANAL AYRIMI
| Kanal | Fark |
|---|---|
| Why It's Built That Way | nesne/mühendislik tek soru, 26 dk, persona yok. Burada bölge, 15 madde, Walter Hale. |
| Founder's Ledger | şirket kronolojisi, karikatür. |
| Uncharted Earth (askıda) | dünya ölçeği keşif, gerçek arşiv. Burada ABD alt-bölge, tamamen AI görsel. |
| The Carrow Institute | kurum vaka. |
Kanal belirsizse ÖNCE SOR.
