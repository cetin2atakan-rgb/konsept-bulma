# Paket düzeltme kuralları (kullanıcı tercihleri)

- **Assets.txt her pakette sıfırdan yazılır** (kullanıcı isteği, 1 Kasım 2026). Gelen Assets yalnızca format/alan listesi için referanstır; başlık, açıklama, index/chapter, etiketler, pinned comment, thumbnail brief, teaser ve baslik_kaydi, düzeltilmiş Script.txt ve Visuals.txt'e bakılarak yeniden yazılır. Kanal standardı metinler (kurgu uyarısı, persona notu, playlist yer tutucusu) içerik olarak korunur.
- Script ve Visuals düzenlenir, yeniden yaratılmaz: sadece hatalı/çelişkili cümleler, doğrulanamayan iddialar ve tekrar eden şablon kapanışlar değiştirilir.
- Başlıklar ≤100 karakter. Chapter/index süreleri kelime sayısından (150 kelime/dk) hesaplanır.
- Visuals ANCHOR/MATCH metinleri script'te birebir geçmeli, sıra script'le aynı, numaralar kesintisiz.

## Hidden Map America thumbnail formatı (2 Kasım 2026'dan itibaren)
Eski format (sol persona + serif bölge adı + kırmızı "HIDDEN" kurdele) düz kalıyor, CTR düşük. Yeni format, referans "THEY SELL RAIN" tipi:
1. **Tek bir inanılmaz görsel:** videodaki en çarpıcı gerçek bilgiden; drone/kuş bakışı, abartılı ölçek, derinlik, doygun renk.
2. **Ölçek ipucu:** küçük tekne, araba, insan; görseli "gerçek ama inanılmaz" yapar.
3. **Yazı:** 2-4 kelime, ALL CAPS, kalın sans (Anton/Montserrat Black), beyaz + siyah gölge, üstte. Bölge adı değil, merak cümlesi. Başlığı tekrar etmez, tamamlar.
4. **Sarı el çizimi ok:** anomaliyi gösterir.
5. **Avatar:** Walter Hale köşede, şaşkın/işaret eden ifade, beyaz kontur, ana görseli kapatmaz.
6. **Dürüstlük:** sahne videoda anlatılan gerçek bir şey olmalı. Ölçek/renk/açı abartılır, bilgi uydurulmaz (yanıltıcı thumbnail YouTube politikasına takılır).
Assets'te her zaman: Grok arka plan promptu (yazısız) + yazı + ok + avatar yerleşimi + bir A/B alternatifi.

## Teslim kapsamı (7 Kasım 2026'dan itibaren)
- Kullanıcı isteği: "bundan sonra sadece assetsi vermen yeterli her video için, aksi durumda ben bildiririm". Script ve Visuals düzeltilip gönderilmez; yalnızca Assets.txt (Script ve Visuals'a bakarak baştan) yazılır, commit/push edilir ve gönderilir. Script/Visuals'ta bulunan hatalar raporda kısa not olarak belirtilir, Assets bu hataları tekrarlamaz.
