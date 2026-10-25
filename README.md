# Konsept Bulma – Ekim 2026

> **Video Ajan:** video paketlerini 11 YouTube skill'inden geçiren yerel uygulama → [`video-ajan/`](video-ajan/README.md) (Windows: `video-ajan\baslat.bat`).

Nexlev verisiyle yapılan YouTube konsept/boşluk araştırması.

**Ana çıktı:** [`output/konsept_arastirmasi_2026-10.xlsx`](output/konsept_arastirmasi_2026-10.xlsx)

| Sayfa | İçerik |
|---|---|
| Özet | Kriterler, yöntem, uyarılar |
| Kanallar | 561 kanal: ≤5 ay önce açılmış, monetize, tahmini ≥$1.000/ay. Link, metrik, konsept, son videolar |
| Konseptler | 101 konsept kümesi: yeni kanal sayısı, toplam/ortalama/maks gelir (formül), doygunluk, dış kontrol |
| Fırsatlar | 22 puanlı boşluk / konsept önerisi |
| Rakip Kontrolleri | Canlı YouTube aramaları ve outlier taraması |

## Kriterler
- Kanal açılışı 2026-05-09 sonrası (ilk video tarihiyle çapraz kontrol)
- Para kazanma açık
- Tahmini aylık AdSense ≥ $1.000 (Nexlev tahmini)

## En güçlü 7 fırsat
1. **Görünmeyen Amerika** – faceless yoksulluk/motel/Appalachia belgeselleri (talep 10M+, faceless arz yok)
2. **Hobi-dikey marka yükseliş & çöküş** – golfte Persimmon Archive tek lider; olta, gitar, fotoğraf makinesi, av tüfeği, motosiklet boş
3. **Eyalet-özel tarih kanalı** – Ohio Uncovered 17 videoyla ~$9K/ay; diğer eyaletler boş
4. **Kore/Vietnam/unutulan savaşlar** – WW2 doymuş (14 yeni kanal), Kore Savaşı tek outlier kanal
5. **E-bisiklet POV ünlü mahalleleri** – Yucky Stew tek kanal (~$25K/ay); başka şehirler boş (yerinde çekim gerekir)
6. **Sağlık sınavı hazırlığı (NCLEX vb.)** – 6 videolu kanal ~$13K/ay
7. **Klasik TV derin bilgi** – 0 aboneli kanalın Gilligan's Island videosu 437K

## Ana bulgu
Başarılı bir format 1-3 hafta içinde 10-15 birebir kopya çekiyor (Amish, Haile Selassie çocukları, "cop caught lying in court"); kopyalar 0-2K izlenmede kalıyor. Gerçek boşluk = talebi kanıtlı ama faceless arzı olmayan konu, ya da kanıtlı şablonun henüz girilmemiş komşu dikeye taşınması.

## Sınırlar
- Nexlev ücretsiz planı: arama aracı günde 5 sorgu → 1.137 eşleşen kanalın 500'ü + keşif listesinden 61 kanal alınabildi. Kalan 637 kanal (sayfa 5, 7-12) sonraki gün eklenebilir.
- Gelirler Nexlev tahmini; bazı kanallarda (#1, #2, #3, #6, #16, #42) izlenmeyle orantısız.

## Yeniden üretme
`python3 scripts/build_xlsx.py output/konsept_arastirmasi_2026-10.xlsx` (veri: `data/kanallar_ham.json`, kümeler: `scripts/clusters.py`, fırsatlar: `scripts/opps.py`)
