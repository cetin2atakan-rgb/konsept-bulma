# Video Studio entegrasyonu: fragman görüntülü GTA videoları

Bu belge, Video Studio'ya "script'e göre fragmandan sahne seçip arka plana koyma" özelliğini eklemek
için gereken her şeyi anlatır. Referans uygulama bu repoda çalışıyor (`gta6-edit/`); Video Studio
aynı kuralları uygularsa aynı sonucu verir. Kod tarafındaki adlar İngilizce bırakıldı.

---

## 1. Genel akış

```
Script.txt + seslendirme (mp3/wav)
   │
   ├─ 1. Ses normalize   → vo.wav  (-14,5 LUFS, tepe -1,5 dB)
   ├─ 2. Altyazı / zaman → captions.json  [{s, e, t}]  (cümle başına başlangıç-bitiş saniyesi)
   ├─ 3. Sahne seçimi    → footage.json   [{at, dur, src, from}]   ← bu belgenin ana konusu
   ├─ 4. Animasyon kartları (mevcut scenes listesi: big, bars, quote, chapter ...)
   └─ 5. Render: [fragman katmanı] → [karartma] → [kartlar] → [altyazı] + [VO + müzik + efekt]
```

## 2. Dosyalar

| Dosya | Ne | Nerede |
|---|---|---|
| `catalog_extended_look.json` | Extended Look'un 283 sahnesi | `gta6-edit/trailers/` |
| `catalog_launch_trailer.json` | Launch trailer'ın 33 sahnesi | `gta6-edit/trailers/` |
| `extended_look.mp4`, `launch_trailer.mp4` | Orijinal fragmanlar, **hiç kırpılmamış** | Senin bilgisayarında, Video Studio'nun fragman klasörü |
| `match_trailer.py` | Seçim algoritmasının referans kodu | `gta6-edit/tools/` |

Fragman dosyaları **kırpılmamalı**. Katalogdaki saniyeler orijinal dosyanın başından sayılır.

### 2.1 Katalog satırı (her sahne)

```json
{
  "id": "LT_009",
  "src": "launch_trailer",          // dosya adı (uzantısız)
  "start": 25.7, "end": 27.2,       // saniye; Extended Look ±1 sn, launch trailer kare hassasiyetinde
  "dur": 1.5,
  "desc": "Lucia leaning out of red convertible, Jason driving in sunglasses, towers behind (iconic)",
  "tags": ["lucia","jason","car","convertible","daytime","iconic","driving"],
  "energy": "calm",                 // calm | tense | action
  "use": "yes",                     // "no" = asla kullanma (logo, siyah kare, başlık kartı, kan)
  "note": ""
}
```

### 2.2 Çıktı: footage.json (Video Studio'nun üreteceği ya da okuyacağı liste)

```json
[ { "at": 0.0,  "dur": 2.4, "src": "extended_look",  "from": 476.3, "id": "EXT_082" },
  { "at": 2.4,  "dur": 3.5, "src": "launch_trailer", "from": 26.0,  "id": "LT_009" } ]
```
`at` = videodaki başlangıç saniyesi, `dur` = süre, `from` = fragmanın kaçıncı saniyesinden başlanacağı.

---

## 3. Sahne seçme kuralları

1. **Kesim ritmi:** Yaklaşık **3,5 saniyede** bir yeni sahne. Sahne kısaysa, kullanılabilir süresi bitince erken kes.
2. **Kullanılabilir pencere:** `from = start + 0,3` ve en fazla `dur - 0,6` saniye. Böylece önceki ya da sonraki sahneden kare sızmaz.
3. **Puanlama:** O 3,5 saniyelik pencerede seslendirmede geçen kelimeler alınır (captions.json'dan).
   - Bölüm 4'teki her konu için: kelime kalıbı eşleşirse, sahnenin etiketlerinden o konunun etiket listesinde olan her biri için **+3**.
   - Genel şehir etiketleri (city, street, driving, skyline, daytime, vice-city) için **+0,5**.
   - Sahne `gameplay-ui` (oyun menüsü ya da HUD) ya da `dark` (çok karanlık) ise **-1,5**.
   - Sahne launch trailer'dansa **+1**. Sinematik görüntü öncelikli.
   - Eşitliği bozmak için 0-0,8 arası rastgele bir değer eklenir (seed sabit tutulursa sonuç tekrarlanabilir).
4. **Tekrar yok:** Bir sahne, kullanılmamış sahne kaldığı sürece ikinci kez seçilmez.
5. **Asla kullanılmayanlar:** `use: "no"` olanlar, yani GTA VI ve PS5 logoları, "Rockstar Games Presents" yazısı, siyah geçişler ve kanlı kareler.
6. **Enerji uyumu (öneri):** Aksiyon cümlelerinde ("shootout, chase, explosion") `action` enerjili, sakin anlatımda `calm` sahneleri öne al. Referans kod bunu etiketlerle dolaylı yapıyor; Video Studio'da açık bir kural olarak eklenebilir.

### Script'e özel elle seçim (isteğe bağlı)

Bir cümlede mutlaka belirli bir sahne istiyorsan Script'te o cümlenin sonuna şu etiketi ekle:
`[BG: LT_018]`. Video Studio bu etiketi görünce o pencerede otomatik seçimi atlayıp o sahneyi kullanmalı.
Etiket seslendirmeye **girmemeli**; TTS'e göndermeden önce temizlenmeli.

---

## 4. Script'te ne geçerse hangi sahneler

Kalıplar küçük harfe çevrilmiş metinde aranır (regex). Son sütun, o konu için en iyi eşleşen sahnelerden ilk 8'idir; tam liste katalogdadır.

| Konu | Kelime kalıbı (regex) | Aranan etiketler | Örnek sahneler |
|---|---|---|---|
| Harita / Leonida / dünya büyüklüğü | `\bmap|leonida|world|square miles|bigger|size of|everglades|keys\b` | aerial, skyline, city, vice-city, swamp, everglades, keys, map | LT_032 (73.17–88.03 sn), EXT_129 (740–748 sn), EXT_169 (985–997 sn), EXT_271 (1542–1546 sn), EXT_082 (476–479 sn), EXT_098 (568–570 sn), EXT_199 (1139–1142 sn), EXT_213 (1211–1213 sn) |
| Dosya boyutu / konsol / PS5 / Xbox / depolama | `\bfile size|install|gb\b|gigs?|storage|download|console|ps5|xbox|pro\b|enhanced` | gameplay, driving, hud, traffic, city | EXT_088 (525–536 sn), EXT_086 (503–514 sn), EXT_087 (514–525 sn), EXT_132 (767–777 sn), EXT_133 (777–787 sn), EXT_163 (934–942 sn), EXT_062 (377–380 sn), EXT_130 (748–757 sn) |
| FPS / performans | `frame|fps|30|60|performance|smooth` | driving, chase, racing, traffic, gameplay | EXT_163 (934–942 sn), EXT_086 (503–514 sn), EXT_088 (525–536 sn), EXT_162 (926–934 sn), EXT_087 (514–525 sn), EXT_130 (748–757 sn), EXT_131 (757–767 sn), EXT_132 (767–777 sn) |
| Lucia | `lucia` | lucia | LT_009 (25.73–27.2 sn), LT_018 (39.8–41.7 sn), LT_026 (59.27–62.53 sn), LT_027 (62.53–63.4 sn), LT_031 (72.13–73.17 sn), EXT_002 (4–14 sn), EXT_003 (14–24 sn), EXT_004 (24–35 sn) |
| Jason | `jason` | jason | LT_009 (25.73–27.2 sn), LT_018 (39.8–41.7 sn), EXT_002 (4–14 sn), EXT_003 (14–24 sn), EXT_004 (24–35 sn), EXT_005 (35–45 sn), EXT_006 (45–56 sn), EXT_007 (56–66 sn) |
| Seslendirme / oyuncu kadrosu / cameo | `voice|cast|actor|actress|cameo|celebrit|plays|role` | character, closeup, dialogue, characters | EXT_155 (898–900 sn), EXT_157 (903–906 sn), LT_003 (6.33–9.33 sn), LT_005 (11.27–13.57 sn), EXT_007 (56–66 sn), EXT_022 (175–180 sn), EXT_030 (223–225 sn), EXT_106 (622–629 sn) |
| Radyo / müzik / albüm | `radio|music|station|album|song|track|artist` | car, driving, nightclub, party, neon, convertible | LT_009 (25.73–27.2 sn), LT_016 (37.37–38.37 sn), LT_020 (44.43–46.33 sn), EXT_086 (503–514 sn), EXT_186 (1057–1059 sn), EXT_196 (1117–1125 sn), EXT_218 (1223–1226 sn), EXT_060 (367–369 sn) |
| Online / çok oyunculu | `online|multiplayer|players|friends` | party, crowd, racing, activities, friends | EXT_187 (1059–1067 sn), EXT_195 (1112–1117 sn), EXT_215 (1215–1219 sn), EXT_218 (1223–1226 sn), EXT_237 (1386–1388 sn), EXT_280 (1570–1574 sn), LT_016 (37.37–38.37 sn), LT_020 (44.43–46.33 sn) |
| Bütçe / para / fiyat | `budget|money|billion|million|cost|price|\$|dollars|paid` | money, luxury, heist, duffel-bag, jewelry-store | LT_019 (41.7–44.43 sn), EXT_025 (199–202 sn), EXT_033 (231–234 sn), EXT_189 (1077–1083 sn), LT_011 (28.77–32.17 sn), LT_014 (34.43–35.83 sn), EXT_041 (259–268 sn), EXT_042 (268–274 sn) |
| Çıkış tarihi / ertelenme / ön sipariş / geri sayım | `release|november|launch|date|delay|pre-?order|days? left|days? from` | skyline, sunset, iconic, night | LT_032 (73.17–88.03 sn), EXT_271 (1542–1546 sn), EXT_279 (1567–1570 sn), LT_018 (39.8–41.7 sn), LT_027 (62.53–63.4 sn), EXT_116 (669–683 sn), EXT_182 (1042–1044 sn), EXT_212 (1204–1211 sn) |
| PC sürümü | `\bpc\b|computer` | skyline, aerial, night | LT_032 (73.17–88.03 sn), EXT_271 (1542–1546 sn), LT_030 (67.9–72.13 sn), EXT_098 (568–570 sn), EXT_129 (740–748 sn), EXT_198 (1132–1139 sn), EXT_212 (1204–1211 sn), EXT_213 (1211–1213 sn) |
| Polis / suç / soygun | `police|cops|wanted|crime|robber|heist|steal` | robbery, police, heist, chase, shootout | LT_021 (46.33–48.27 sn), EXT_141 (834–838 sn), EXT_142 (838–844 sn), EXT_143 (844–853 sn), EXT_144 (853–857 sn), EXT_145 (857–860 sn), EXT_162 (926–934 sn), EXT_164 (942–947 sn) |
| Sosyal medya / telefon / yayın | `social media|phone|influencer|stream|viral|post` | phone, social-media, livestream | EXT_066 (387–401 sn), EXT_091 (541–544 sn), EXT_191 (1089–1101 sn), EXT_192 (1101–1106 sn), LT_005 (11.27–13.57 sn), EXT_010 (87–97 sn), EXT_011 (97–108 sn), EXT_029 (220–223 sn) |
| Plaj / Vice City / okyanus / tekne | `beach|vice city|miami|ocean|boat` | beach, vice-city, ocean, boat, jetski | LT_023 (54.53–56.43 sn), EXT_181 (1040–1042 sn), EXT_193 (1106–1109 sn), EXT_280 (1570–1574 sn), LT_003 (6.33–9.33 sn), LT_004 (9.33–11.27 sn), LT_021 (46.33–48.27 sn), LT_029 (66.43–67.9 sn) |
| Görev / hikâye | `mission|story|campaign|gives|boss` | dialogue, characters, heist, deal | EXT_007 (56–66 sn), EXT_111 (642–648 sn), EXT_151 (879–885 sn), EXT_170 (997–1005 sn), LT_005 (11.27–13.57 sn), LT_011 (28.77–32.17 sn), LT_014 (34.43–35.83 sn), LT_018 (39.8–41.7 sn) |
| Gece / kulüp / parti | `night|club|party` | nightclub, party, night, neon | EXT_186 (1057–1059 sn), LT_016 (37.37–38.37 sn), LT_020 (44.43–46.33 sn), EXT_214 (1213–1215 sn), EXT_215 (1215–1219 sn), EXT_218 (1223–1226 sn), EXT_222 (1241–1249 sn), EXT_224 (1258–1271 sn) |
| Araba / sürüş | `car|drive|driving|vehicle` | car, driving | LT_009 (25.73–27.2 sn), EXT_060 (367–369 sn), EXT_086 (503–514 sn), EXT_087 (514–525 sn), EXT_088 (525–536 sn), EXT_130 (748–757 sn), EXT_131 (757–767 sn), EXT_132 (767–777 sn) |
| Silah / çatışma | `gun|weapon|shoot` | gun, shootout | LT_028 (63.4–66.43 sn), LT_031 (72.13–73.17 sn), EXT_043 (274–284 sn), EXT_044 (284–289 sn), EXT_127 (729–732 sn), EXT_141 (834–838 sn), EXT_143 (844–853 sn), EXT_144 (853–857 sn) |
| Fragman / Rockstar / resmi açıklama | `trailer|rockstar|official|confirm` | iconic, skyline, city | LT_032 (73.17–88.03 sn), EXT_271 (1542–1546 sn), EXT_279 (1567–1570 sn), EXT_082 (476–479 sn), EXT_087 (514–525 sn), EXT_089 (536–539 sn), EXT_098 (568–570 sn), EXT_128 (732–740 sn) |

Hiçbir kalıp eşleşmezse genel şehir görüntüleri seçilir: sokak, sürüş, silüet.

---

## 5. Görüntü katmanı kuralları

- **Ölçek:** Sahne ekranı tam kaplar (cover). Her sahnede yavaş zoom: %103'ten %110'a.
- **Karartma:** Kartlar ve altyazı okunsun diye üstüne iki katman gelir.
  - Dikey gradyan: üst #0b0716 %60 → orta %40 → alt %80 opaklık.
  - Kenar kararması: merkez şeffaf, kenarlar siyah %67.
- **Sıra (alttan üste):** fragman → karartma → animasyon kartları → bölüm etiketi → altyazı.
- **Kartlar** kendi panel arka planlarıyla gelir. "big" gibi panelsiz büyük yazılar karartma sayesinde okunur.
- **Geçiş:** Sahneler arası düz kesim. Kart girişinde zaten "whoosh" efekti var.

## 6. Ses kuralları

- **Fragman sesi her zaman kapalı.** İçindeki lisanslı şarkılar YouTube'un otomatik telif sisteminde (Content ID) talep alır.
- **Seslendirme:** loudnorm I=-14,5, TP=-1,5, LRA=11 (`tools/prep_vo.sh`). Toplam mix yaklaşık **-14/-15 LUFS** çıkar; ölçtüğümüz önizleme -15,0.
- **Müzik:** Kodla üretilmiş müzik %13 seviyede, döngüde. Efektler: kart geçişinde whoosh %18, bölüm kartında %45 + thud %50.

## 7. Altyazı

- Oswald 500, **58 px**, beyaz, alttan 56 px, yarı saydam siyah kutu (#000 %70), en fazla 1.500 px genişlik.
- Cümle başına bir altyazı; 0,1 sn yumuşak giriş.

## 8. Yeni fragman eklemek

1. 1 fps ile kare tablosu çıkar: `ffmpeg -i X.mp4 -vf "fps=1,scale=384:-2,tile=6x5" X_%02d.jpg`
   ya da video yüklenebiliyorsa kesim noktalarını doğrudan bul: `select='gt(scene,0.25)',showinfo`.
2. `tools/segment_sheets.py` ile sahnelere böl. Her sahneye `desc`, `tags`, `energy` ve `use` yaz.
3. `catalog_<ad>.json` olarak kaydet. Seçim algoritması `trailers/catalog_*.json` dosyalarının hepsini otomatik okur.

## 9. Telif ve platform notları

- Görüntüyü kısa parçalar halinde kullan (en fazla ~3,5 sn, aynı sahne tekrar etmiyor). Üstüne yorum ve animasyon ekle.
- Logo ve başlık kartlarını kullanma; katalogda zaten `use: "no"` olarak işaretli.
- Buna rağmen Take-Two/Rockstar telif talebi gelebilir. Gelirin paylaşılması ya da engellenmesi riski vardır.

## 10. Kontrol listesi (render öncesi)

- [ ] Fragman dosyaları kırpılmamış ve adları katalogdaki `src` ile aynı
- [ ] footage.json'da `use: "no"` sahne yok, tekrar eden id yok
- [ ] Hiçbir sahne 3,5 saniyeden uzun değil
- [ ] Fragman sesi kapalı, mix -14 / -15 LUFS
- [ ] Script'teki `[BG: …]` etiketleri TTS metninden temizlenmiş
