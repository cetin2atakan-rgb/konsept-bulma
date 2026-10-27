# 6 Skill İçin Değişiklik Listesi (onay için)

Bu dosya sadece listedir; skill'ler henüz değiştirilmedi. Onay sonrası güncel 6 skill zip olarak teslim edilecek.
Dayanak: son 8 pakette düzelttiğim hatalar + 27 Ekim örnek kanal analizi (Nexlev).

---

## A. Altı skill'in hepsine eklenecek ortak bölüm: "Teslim öncesi kalite kapısı"

Her skill'in QC bölümünün başına aynı blok eklenecek. Paket bu kapıdan geçmeden teslim edilmez.

1. **Başlık uzunluğu:** YouTube 100 karakterin üstünü kabul etmiyor. Sınırlar: hedef ≤70, uyarı 70-90, red >95. `title.py` ile lint yapılır, sonuç pakete yazılır. (Carrow Tape 02-03 ve ışık anahtarı videosu 101-102 karakterdi.)
2. **Thumbnail yazısı:** Başlıktaki kelimeleri tekrar etmez, en fazla 3 kelime.
3. **Bölümler gerçek kelime sayısından hesaplanır:** Hedef uzunluk tablosundan değil, script'in gerçek kelime sayısı ÷ ses wpm ile. Python ile hesaplanır; 00:00 ile başlar, en az 3 bölüm, her bölüm en az 10 sn. (Reid #3'te 3.348 kelime 27 dk sanılmıştı, gerçek süre 23,5 dk; Apple'da 1.660 kelime "20 dk" başlıkla gelmişti.)
4. **Başlık iddiası kaynağı aşamaz:** Başlık veya hook'taki iddia, kaynaklar.md'deki çalışmanın söylediğinden güçlü olamaz. (Reid #3: "linked to memory loss" iddiasını destekleyen çalışma yoktu.)
5. **AI açıklaması dürüst:** "original illustrations / hand-drawn originals" ifadeleri yasak; yerine "AI-generated illustrations". Gerçekçi görseller (Carrow arşiv fotoğrafları, Hidden Map manzaraları) için YouTube yükleme ekranındaki "Altered or synthetic content" kutusu işaretlenir.
6. **Görsel tekrar sınırı:**
   - Aynı prompt veya aynı görsel bir videoda en fazla 1 kez yeniden kullanılır. "Wide angle / slightly tighter framing" varyantları da tekrar sayılır.
   - Görsel sayısı bloğun kelime payıyla orantılı olur; kapanışa 85 görsel verilmez.
   - "final shot / closing shot" ifadesi en fazla 2 kez geçer.
7. **ANCHOR = script cümlesinin ilk 5 kelimesi, birebir:** Görsel tarifi anchor olarak yazılmaz.
8. **Olgu kontrol listesi:** Paketle birlikte "KONTROL ET" listesi teslim edilir: doğrulanamayan tarih, sayı ve isimler. Script içi tutarlılık taraması da yapılır ("twice" deyip üç olay anlatmak, "five moves" deyip dört saymak gibi).
9. **Başlık kalıbı rotasyonu:** Aynı başlık kalıbı art arda en fazla 3 videoda kullanılır. Her skill'de en az 3 kalıp tanımlı olur. (Tekrar eden içerik politikası: Eli Holloway bu yüzden uyarı aldı; America with Amos ve Dr. Ares şu an aynı yorgunluğu yaşıyor.)
10. **Kesim kuralı güncellemesi:** "Hafta 6: günlük 1.000 izlenme yoksa durur" kuralı kalkar. Built On You ilk 7 hafta toplam ~290 izlenmede kaldı, sonra patladı. Yeni kural: **10 video ve 30 gün** dolunca gösterim ve tıklanma oranına bakılır. Karar sinyali izlenme sayısı olmaz.

---

## B. Kanal bazlı değişiklikler

### 1. dr-marcus-reid  ⚠️ (en büyük değişiklik)

| # | Şu an | Değişiklik | Neden |
|---|---|---|---|
| 1 | "I've spent over two decades in preventive cardiovascular medicine", "my patient data" | **Kaldırılır.** Yerine "I've spent years reading the research on…" | Kurgusal kişiye gerçek klinik deneyim iddiası, YouTube'un tıbbi yanlış bilgi ve aldatıcı uygulama politikalarına giriyor |
| 2 | Başlık kuralı: "[UZMAN] Warns", "her 4 videodan en az 2'si Cardiologist", urolog/nörolog rotasyonu | **Kaldırılır.** Uzmanlık etiketi yok. Yeni kalıplar: soru-cevap ("What's the REAL Ideal Blood Pressure After 65?"), pratik hayatta kalma ("How to Survive Choking When You're Alone"), eşik/sayı | Reid #3'te kardiyolog → nörolog geçişi buradan geldi. Ares'in video sayısı 46'dan 31'e düştü, kaldırma işareti olabilir |
| 3 | Konu sınıfı "NEVER / pills that raise stroke risk" %20 | İlaç korkusu kısmı çıkar. Pay "Tek başına hayatta kalma" (%10 → %20) ve "Sayı/eşik" sınıflarına geçer | Ares'te ilaç korkusu videoları en riskli içerik; sağlam hitler pratik bilgi videoları (boğulma 205K, tansiyon 379K) |
| 4 | QC'de "uzman etiketi var" maddesi | "Uzmanlık iddiası yok" ve "başlık iddiası ≤ kaynak" maddeleri | — |
| 5 | Kara tahta prompt'u "nothing else written", ama SKETCH'lerde etiket yazıları var | SKETCH için "no words, no numbers, no labels" kuralı. "magnifying-glass-free" gibi nesne adını anan negatif ifadeler yasak | Reid #3 üretim listesinde gördüm |
| 6 | Assets şablonunda sabit bölüm süreleri (2:25, 4:40…) | Gerçek kelime sayısından hesaplanır (ortak kural 3) | Reid #3'te 1-3 dk kayma vardı |
| 7 | Açıklamada persona notu en altta | **2. satıra** çıkar | Arama sonucunda görünür kısım |
| 8 | Yayın haftada 7 | Haftada 3-4 önerisi (aşağıdaki kapasite notuna bak) | — |
| 9 | Kaynak bölümü 18 Ekim verisi | 27 Ekim güncellemesi: Ares zirveyi geçti, yeni videoları 2-4K | — |

**Senin kararın gereken konu:** "Dr." unvanının kendisi de tıbbi yetki ima ediyor.
- **(a) Asgari seçenek:** İsim kalır, ama klinik iddia hiç olmaz ve persona notu 2. satırda durur.
- **(b) Önerim:** Unvanı bırakıp "Marcus Reid · Health After 60" gibi bir anlatıcıya geçmek. Kanal adı ve avatarı da değişir.

### 2. arsiv-kasetleri (The Carrow Institute)

| # | Şu an | Değişiklik |
|---|---|---|
| 1 | Skill'de kasetler **1978, Nevada**, ama Tape 03 script'i **23 Temmuz 1977** diyor | Tek yıla sabitlenir (önerim 1977, çünkü yayınlanan kasetler öyle) |
| 2 | Başlık 70-100 karakter | **≤90**, çünkü "\| The Carrow Institute, Tape NN" eki ~32 karakter yiyor. Ön kısım ≤58 karakter |
| 3 | Thumbnail metni "TAPE 03 · 1952" (başlığı tekrar ediyor) | Anomaliden 2-3 kelime ("SWIRLED, NOT CRUSHED"); kaset numarası küçük köşe yazısı olarak kalır |
| 4 | Görsel kuralı 100-180 görsel, tekrar sınırı yok | Ortak kural 6 + "fotoğrafa geri dönüş" yalnız script o fotoğrafa geri dönüyorsa, `REUSE` etiketiyle (Tape 02'de görsellerin ~%70'i tekrardı) |
| 5 | Açıklama şablonunda sabit "Real historical persons appear in dramatized form" | Yalnız script'te gerçek, isimli kişi geçiyorsa yazılır |
| 6 | Gerçek kişi kuralı: "ölmüş kişiler dramatize edilebilir" | Gerçek isimli kişiye **kurgu olay atfedilmez** (uydurma ifade, uydurma ölüm, kayıp). Gerçek kişi yalnız belgelenmiş gerçeklerle anılır (Tape 02'de çiftçi Mac Brazel'in hikâyesi kurgulanmıştı) |
| 7 | Model verisi: Eastham büyüyor | 27 Ekim: Eastham düşüşte (haftalık 927K → 130K); gerçek olaya bağlı bölümler kazanıyor, uydurma vakalar çöküyor. **Kural:** her kaset ünlü bir gerçek vakaya bağlı, başlık vaka adı ve yılla başlar |
| 8 | Eastham'a yakınlık | Ayrışma maddeleri: anlatıcının fotoğraf değerlendirme uzmanlığı öne çıkar, Eastham'ın jargonu ("disposition blank" vb.) azaltılır, ses filtresi farklılaşır |
| 9 | YouTube kutusu | Gerçekçi sahte arşiv fotoğrafları için "Altered or synthetic content" kutusu zorunlu |

### 3. founders-ledger

| # | Şu an | Değişiklik |
|---|---|---|
| 1 | Kelime aralığı 2.900-3.300 ama Apple script'i 1.660 geldi | Kelime kapısı katılaşır: alt sınırın altındaysa Assets yazılmaz, script uzatılır. Başlıktaki dakika gerçek süreyle uyuşmak zorunda |
| 2 | "Illustrations are original drawings" zorunlu cümlesi | "Illustrations are AI-generated in a comic style." |
| 3 | Konu ağırlıkları | Built On You verisi: Amazon 259K, Toyota 122K, Walmart 84K iyi; Nintendo 7.4K zayıf. Tüketici teknolojisi %15 → %5, perakende ve otomotiv artar |
| 4 | "Built On You'nun yaptığı şirket" listesi yok | Liste eklenir: Amazon, Walmart, Toyota, Microsoft, Costco, Tesla, Nintendo, Nike (90 gün yapılmaz) |
| 5 | Tek sabit başlık kalıbı | Kalıp korunur ama 15. videodan itibaren 2 yedek kalıp devreye girer ("How [X] Almost Went Bankrupt", "The Man Who Built [X]") |
| 6 | "Today" rakamları | Piyasa değeri, gelir ve çalışan sayısı üretim tarihinde yeniden kontrol edilir; kaynaklar.md'ye tarih yazılır (Apple'da "close to three trillion" eskimişti) |

### 4. one-year-stronger

| # | Şu an | Değişiklik |
|---|---|---|
| 1 | Konu ağırlığı: tek alışkanlık %45, A vs B %25 | **Ters çevrilir: A vs B %55, "ne kadar yeter" soruları %20, tek alışkanlık %15, yaş kıyası %10.** Model verisi: karşılaştırmalar 36K-828K, tek alışkanlık 3.3K-3.5K |
| 2 | Ana başlık kalıbı "A Year of X After 50" | Öncelik: "A Year of [A] vs a Year of [B] After 50", "[A] or [B] After 50: Which Does More?", "Once a Week vs 3 Times After 50: How Much Is Enough?" |
| 3 | Thumbnail metni sabit "1 YEAR" | Her videoda farklı 2-3 kelime, başlıkla çakışmaz |
| 4 | "Illustrations are hand-drawn style originals" | "Illustrations are AI-generated; narration is AI-assisted." + About'ta açık AI notu (model kanal böyle yapıyor ve büyüyor) |
| 5 | Model verisi | 27 Ekim güncellemesi (SimpleProfessor 3 haftada 1,26M izlenme) |

### 5. why-its-built-that-way

| # | Şu an | Değişiklik |
|---|---|---|
| 1 | İlk 14 video: elektrik 4, ulaşım 3, bina 3, mutfak 2, standart 2 | **Elektrik/ev tesisatı 9, bina/ev 3, standartlar 2, ulaşım 0.** Weirdward'da trenler 5-6K, elektrik 128K-1.4M |
| 2 | "Weirdward'ın yaptığı sorular" listesi yok | Liste eklenir: 60/50 Hz, Japonya 50/60, 120V, nötr tel (×2), fiş delikleri, solid vs stranded, izolatör diskleri, hat topları, inverter, direnç, volt-amper-watt, 3 faz, evde elektrik, anten, pil |
| 3 | Kapanış genellemesinde sabit örnekler (ray genişliği, sol şerit, QWERTY) | Örnekler her videoda değişir ve olgu kontrolünden geçer (ray genişliği videosunun kapanışındaki sürüş tarafı efsanesi ve İsveç hatası buradan çıktı) |
| 4 | Standart/yönetmelik iddiaları | NEC/IEC maddesi kaynaklar.md'ye **madde metniyle** yazılır (ışık anahtarı videosunda NEC 404.7 yanlış okunmuştu) |
| 5 | "Diagrams and illustrations are original" | AI açıklaması |
| 6 | Başlık uzunluğu sınırı yok | Ortak kural 1 (ışık anahtarı başlığı 101 karakterdi) |

### 6. hidden-map-america  ⚠️

| # | Şu an | Değişiklik |
|---|---|---|
| 1 | Başlık her videoda "[Bölge] Is Hiding Something…" | **Amos tam bu kalıpla çöküyor** (son 3 videosu 600-4K). 5 kalıp rotasyonu: "25 Hidden Facts", "Why [Bölge] Looks Nothing Like the Rest of [Eyalet]", "The Strangest Places in [Bölge]", "[Bölge]: What the Map Doesn't Show You", "Hiding" kalıbı en fazla 3 videoda 1 |
| 2 | Süre 55-70 dk, 25 madde, 400-550 görsel | **Önerim: 28-38 dk, 15 madde (15→1), ~220-280 görsel.** Amos'un zirvesi 18-22 dk videolarda; 1 saati aşınca düşüş başladı. Üretim yükü de yarıya iner |
| 3 | Bölge havuzu | Amos'un yaptığı bölgeler havuzun çoğunu yemiş (Güney iç ve Appalachia neredeyse tamamen). Yeni havuz: yapılmamış alt bölgeler (Driftless, Sandhills, Upper Peninsula, Palouse, Natchez Trace koridoru, Big Bend dışı Trans-Pecos, Kentucky Pennyroyal…) + 6 ayı geçmiş olanlar |
| 4 | Persona: emekli coğrafya öğretmeni (Amos'un birebiri) | Mesleği değişir. Önerim: **emekli ilçe arazi ölçüm mühendisi (county surveyor)**. İsim ve persona.png aynı kalır, değişen yalnız geçmiş cümleleri ve anekdotlar ("my survey crew" vb.) |
| 5 | "Illustrations are original drawings" | Fotogerçekçi AI manzaralar için AI açıklaması + "Altered or synthetic content" kutusu |
| 6 | Olgu kontrolü | Jeoloji ve hidroloji iddiaları USGS ile çapraz kontrol; script içi sayı tutarlılığı taraması (Panhandle'da kıta bölünme çizgisi, "twice"/üç girişim hataları) |

**Senin kararın gereken konular:** süre (55-70 dk mı, 28-38 dk mı) ve persona mesleği.

---

## C. Kapasite notu (karar senin)

Skill'lerdeki yayın sıklıkları toplamı haftada **~27 video** ediyor: Reid 7, Built 7, Stronger 3,5, Ledger 2,3, Carrow 3,5, Hidden Map 3,5. Sadece Hidden Map ve Reid'in görsel yükü haftada ~3.000 görsel.

Önerdiğim başlangıç temposu (ilk 30 gün): Stronger 3, Built 3, Ledger 2, Carrow 2, Hidden Map 2, Reid 2 = **haftada 14 video**. 30 gün verisiyle tutan kanalın temposu artar.

---

## Onay için 4 soru

1. **Dr. Marcus Reid:** "Dr." unvanı kalsın mı (a), yoksa unvansız anlatıcıya mı geçelim (b)?
2. **Hidden Map:** Süre 28-38 dk ve 15 madde olsun mu? Persona "emekli arazi ölçüm mühendisi" olsun mu?
3. **Carrow:** Yıl 1977'de mi sabitlensin?
4. **Tempo:** Haftada 14 videoluk başlangıç temposunu skill'lere yazayım mı?
