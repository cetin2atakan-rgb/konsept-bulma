# Video Studio · Fragman arka planlı GTA videoları · Tam paket

Bu klasörü olduğu gibi diğer Claude hesabına ver. Önce bu dosyayı okusun.

## Klasörde ne var

| Klasör | İçerik | Ne işe yarar |
|---|---|---|
| `01_belge/VIDEO_STUDIO_ENTEGRASYON.md` | Tüm kurallar | Ana belge. Sahne seçimi, görüntü ve ses ayarları, kontrol listesi |
| `02_katalog/catalog_extended_look.json` | 283 sahne | Extended Look: saniye, açıklama, etiket, enerji, kullanılabilir mi |
| `02_katalog/catalog_launch_trailer.json` | 33 sahne | Launch trailer, kare hassasiyetinde |
| `02_katalog/kontakt_sayfalari/` | Etiketli kare sayfaları | Her sahnenin görseli; katalogdaki id'lerle eşleşir |
| `03_referans_kod/tools/match_trailer.py` | Sahne seçme algoritması | Çalışan referans; Video Studio aynısını uygulamalı |
| `03_referans_kod/tools/prep_vo.sh` | Ses dengeleme | Seslendirme → -14,5 LUFS |
| `03_referans_kod/tools/segment_sheets.py` | Yeni fragman ekleme aracı | Kare tablolarını sahnelere böler |
| `03_referans_kod/tools/captions.py` | Altyazı düzeltme örneği | Ses tanımadan gelen cümle zamanlarını temizler |
| `03_referans_kod/tools/make_audio.sh` | Efekt ve müzik üretimi | Lisanssız whoosh, thud ve müzik |
| `03_referans_kod/src/Video.tsx` | Katman sırası | Fragman → karartma → kartlar → altyazı → ses |
| `03_referans_kod/src/kit.tsx` | Animasyon kartları | big, bars, quote, chapter, timeline, store, post… (22 kart türü) |
| `03_referans_kod/src/scenes.ts` | Örnek sahne listesi | "13 Things Rockstar STILL Hasn't Told Us" videosunun kart zamanlaması |
| `03_referans_kod/src/footage.json` | Örnek çıktı | Algoritmanın bu video için seçtiği 178 arka plan sahnesi |
| `03_referans_kod/src/captions.json` | Örnek altyazı zamanları | `[{s, e, t}]` formatı |
| `03_referans_kod/public/` | Font ve efekt sesleri | Oswald fontu, sfx |

Referans kod Remotion 4.0.300 (React → MP4) ile yazıldı. Video Studio başka bir teknolojiyse kurallar aynen, kod uyarlanarak kullanılır.

---

## Diğer hesaba yapıştırılacak mesaj

Aşağıdakini kopyala. `<...>` olan yerleri doldur.

```
Ekteki "video_studio_fragman_paketi" klasörüyle Video Studio'ya "fragman arka planlı video" özelliğini ekleyeceğiz.
Önce BASLA.md ve 01_belge/VIDEO_STUDIO_ENTEGRASYON.md dosyalarını oku.

Hedef: Script ve seslendirme verdiğimde Video Studio şunları yapsın:
1. Seslendirmeyi -14,5 LUFS'a dengelesin (prep_vo.sh ile aynı ayar).
2. Her cümlenin başlangıç ve bitiş saniyesini çıkarsın (captions.json formatında).
3. match_trailer.py'deki algoritmayla her ~3,5 saniyede katalogdan bir sahne seçsin; kurallar birebir aynı olsun.
   Script'te [BG: SAHNE_ID] etiketi varsa o cümlede o sahneyi kullansın; etiketi seslendirmeye göndermesin.
4. Fragmanı sessiz, tam ekran, yavaş zoom ve karartma katmanıyla arka plana koysun (Video.tsx'teki gibi).
5. Animasyon kartlarını üstüne bindirsin: <A: Video Studio'nun kendi kartları | B: kit.tsx'teki kartların aynısı>.
6. Altyazıyı ve sesi (VO + müzik + efekt) eklesin, render etsin.

Fragman dosyalarım bilgisayarımda, kırpılmamış:
- <tam yol>\extended_look.mp4
- <tam yol>\launch_trailer.mp4

Kanal: <kanal adı>, dil: İngilizce, format: yatay 1920x1080, 30 fps.

Önce Video Studio'nun mevcut yapısına göre nasıl entegre edeceğini kısaca anlat (hangi dosyalar değişecek,
yeni hangi ekran/ayar gelecek). Onaylarsam kodla. Bitince bir örnek videoyla test et ve belgedeki kontrol listesini uygula.
```

---

## Senin karar vermen gerekenler (mesajda doldur)

1. **Animasyon kartları:**
   - **A:** Video Studio'nun kendi yazı ve kartları. Daha hızlı entegre olur.
   - **B:** Buradaki kartların aynısı (`kit.tsx`). Görünüm önizlemeyle birebir olur ama port etmek daha uzun sürer.
2. **Fragman dosyalarının tam yolu.** Dosya adları `extended_look.mp4` ve `launch_trailer.mp4` olmalı, yoksa kataloğun `src` alanıyla eşleşmez.
3. **Kanal adı.**

## Bilinmesi gerekenler (diğer Claude için notlar)

- **Saniye hassasiyeti:** Extended Look kataloğu saniyede 1 kareden çıkarıldı; saniyeler ±1 sn. Kesimden 0,3 sn içeriden başlama kuralı sızmayı engelliyor. Launch trailer kare hassasiyetinde.
- **Kart zamanlaması:** `scenes.ts` sadece örnek video için elle zamanlandı. Yeni videolarda kart listesi script'ten ayrıca üretilmeli (hangi cümlede hangi kart: büyük sayı, çubuk grafik, alıntı…).
- **Cümle zamanları:** Referans kodda ses tanıma (ASR) ile çıkarıldı. Seslendirme Video Studio'da Kokoro ile cümle cümle üretiliyorsa zamanlar zaten bilinir; ASR'ye gerek yok.
- **Fragman sesi asla kullanılmaz.** İçindeki lisanslı şarkılar YouTube'un otomatik telif sisteminde (Content ID) talep alır.
- **Asla kullanılmayan sahneler:** Logo, başlık kartı, siyah kare ve kanlı sahneler katalogda `use: "no"` olarak işaretli; seçimde atlanmalı.
- **Yeni fragman gelince:** `segment_sheets.py` ile böl, `catalog_<ad>.json` olarak ekle. Algoritma bütün katalogları otomatik okur.
