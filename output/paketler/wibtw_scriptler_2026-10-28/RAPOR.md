# 7 script · düzeltme raporu (28 Ekim 2026)

Düzeltilmiş dosyalar: `<konu>_Script.txt`. Orijinaller: `orijinal/`.

## Bütün script'lerde ortak sorun: aynı kapanış

Yedi script'in altısında kapanış aynıydı: demiryolu ray genişliği + yolun sol/sağ tarafı + QWERTY klavye, ardından "The details change. The pattern does not." cümlesi. Yedisinde de bu cümle ya da çok yakın bir hali vardı. Aynı kanalda art arda yayınlanınca hem izleyici fark eder, hem de YouTube'un tekrar eden içerik (şablon) riskini büyütür.

Her kapanışı konunun kendisine bağlı, farklı örneklerle yeniden yazdım:
- **Priz:** Şekliyle güvenlik sağlayan nesneler (üç uçlu fiş, dizel tabanca ağzı, hastane gaz bağlantıları).
- **Kurutucu:** Aynı evdeki "rastgele görünen" sayılar (sigorta boyutları, su ısıtıcısı ayarı, merdiven yükseklikleri).
- **Trafik ışığı:** Mesajı hem renkle hem şekille veren yol işaretleri (dur, yol ver, okul otobüsü sarısı).
- **Tren kornası:** Aynı sebeple sabitlenmiş uyarı sesleri (duman alarmı, geri vites bipi, siren).
- **Yangın musluğu:** Ölçümü renge çeviren diğer sistemler (kazı öncesi zemin renk kodu, boru renk bantları, manometre).
- **Çatal:** Sofradaki diğer nesnelerin tarihi (ucu yuvarlatılmış yemek bıçağı, kaşık boyları).
- **Baker's dozen:** Kapanış zaten farklıydı; sadece kalıp cümle ve tekrar eden CTA değiştirildi.

"If you want to see another case where a small decision locked in consequences for a century" CTA'sı iki script'te birebir aynıydı; ikisini de değiştirdim.

## Script bazında düzeltmeler

### outlet_slots: Why Is One Slot on Your Outlet Bigger Than the Other?
- **Ölçü çelişkisi:**
  - Hook "bir inçin onda birinden biraz az" diyordu, ikinci bölüm "on altıda bir", Today bölümü "5/32 inç ve 1/4 inç". Bu üçü birbirini tutmuyor.
  - Doğrusu: dar (faz) yuva yaklaşık 1/4 inç, geniş (nötr) yuva yaklaşık 5/16 inç; fark yaklaşık 1/16 inç.
  - Üçünü buna göre düzelttim.
- **Kaldırılan cümle:** "Seyahat adaptörleri polariteyi korur" cümlesini çıkardım. Birçok adaptör korumaz, yanlış bilgi olurdu.

### dryer_outlet: Why Does Your Dryer Need a Different Outlet…?
- **Kaldırılan ifadeler:**
  - "Wikipedia'da ortaklaşa tutulan bir madde" ifadesi; script'in içinde kaynak olarak Wikipedia anmak güvenilirliği düşürür.
  - "1996 kod revizyonunun gerekçesinde doğrudan NFPA kayıtlarına atıf" iddiası; doğrulanamıyor.
- **CTA:** "worth fifteen minutes" yazıyordu; video yaklaşık 24-25 dakika. "a few minutes" yaptım.
- **Başlık (senin karar vermen gerekiyor):** 79 karakter, masaüstünde kesilir. Öneri: `Why Does Your Dryer Need a Different Outlet?` (44 karakter).

### traffic_lights: Why Are Traffic Lights Always Red on Top?
- **Yinelenen paragraf (en büyük hata):** Lester Wire paragrafı neredeyse kelimesi kelimesine iki kez yazılmıştı. Kısa olanı sildim.
- **Kesinlik dengesi:** Script, "kırmızı üstte, çünkü 1935 komitesi renk körlerini düşündü" iddiasını kesin bir belge varmış gibi sunuyordu. Konum tutarlılığının renk körlerine faydası yaygın kabul görüyor, ama 1935 komitesinin gerekçesi olarak yazılı bir kayıt bilmiyorum. Bunun yerine iki gerekçeyi verdim:
  - Görünürlük: en önemli işaret en üstte durur; kamyon, dal ya da kar arkasında kalmaz.
  - Renk körlüğü: asıl önemli gerekçe olarak anlatılıyor, ama komitenin yazılı kararı gibi sunulmuyor.
- **Garrett Morgan patenti:** "Patent numarası kaynaklarda tutarsız" diyordu. Patent numarası 1.475.024, Kasım 1923; net yazdım.
- **Dil:** Sürücü için "He" yerine "They".

### train_horns: Why Do Train Horns Always Sound the Same Pattern?
- **Morse hatası:** Script "kalıp Q harfine uymuyor" diyordu. Uyuyor: uluslararası Morse'ta Q = uzun-uzun-kısa-uzun, birebir aynı. Doğru çürütme şu: dönemin Amerikan demiryolları ve telgrafı farklı bir kod (American Morse) kullanıyordu, ve hiçbir kural kitabı kornayı Morse'a bağlamıyor. Buna göre yeniden yazdım.
- **Florida 1984 yasağı:** "Kazalar yaklaşık %60 arttı" yazıyordu. FRA'nın raporuna göre etkilenen geçitlerde kazalar **yaklaşık üç katına çıktı** (yaklaşık %195 artış). İki yerde düzelttim.
- **Train Horn Rule tarihi:** "2006 ve 2007'de tam yürürlük" yazıyordu. Doğrusu: 2004'te geçici kural, 2005'te nihai kural, aynı yaz yürürlük.
- **Doğrulayamadığım için kaldırdığım ya da yumuşattığım iddialar:**
  - "2026'da kesinleşen federal kural": kaldırdım.
  - "Yaklaşık 2.000 sessiz bölge": "yüzlerce" yaptım.
  - "2017'de 500'den fazla sessiz bölgeyi inceleyen denetim": "birkaç yüz sessiz bölgeyi kapsayan federal inceleme" yaptım.

### hydrant_caps: Why Do Fire Hydrants Have Different Colored Caps?
- **1872 Boston yangını:** Hortum vidalarının uymaması asıl Baltimore 1904'ün dersi. Boston için bu iddia belgeli değil. Boston paragrafını bunu iddia etmeyecek şekilde düzelttim; Baltimore anlatımı aynen duruyor.
- **Eksik şehir adı:** "Holly sistemini şehre satmıştı" diyordu, şehir yazmıyordu. "Lockport" ekledim.
- **Kaldırılan iddia:** "New Orleans'ta hâlâ çalışan Holly musluğu" iddiasını doğrulanamadığı için çıkardım.
- **Doğru olanlar:** NFPA 291 renk sınıfları (mavi 1.500+, yeşil 1.000-1.499, turuncu 500-999, kırmızı 500 altı galon/dakika, 20 psi artık basınç) doğru.

### fork_tines: Why Do Forks Have Exactly Four Tines?
- **İçerik:** Sağlam; belirsizlikler zaten dürüstçe işaretlenmiş (Theophano, Catherine de' Medici, Bryson).
- **Değişen:** Sadece kapanış. Eski kapanıştaki "ray genişliği at arabası tekerlek izlerinden gelir" yaygın bir efsane; bu kanalın efsane yaymaması gerekir.

### bakers_dozen: Why Is a Baker's Dozen 13, Not 12?
- **Yanlış terim:** "Oven spring" fırında ekmeğin kabarmasıdır, ağırlık kaybı değil. Doğrusu "bake loss". LABEL'ı ve cümleyi düzelttim.
- **1307 tüzüğü:** "1307'de I. Edward döneminde London Bakers'a tüzük" iddiasından emin değilim. Bildiğim kadarıyla Bakers' Company'nin bilinen ilk kraliyet tüzüğü çok daha geç (15. yüzyıl). Tarihe bağlamadan "14. yüzyıl başında yetki verilmişti" şeklinde yumuşattım.

## Senin kontrol etmen gerekenler (benim doğrulayamadıklarım)
- **outlet_slots:** Hubbell'in polarize fiş patent numarası (1.180.648). Script zaten "kaynaklarda tutarsız" diyor.
- **train_horns:**
  - Makinist anekdotları (John Cheaves, "Dutch" Eiford, Gus Manning)
  - Beatrice Streb mektubu
  - Charles Kimball / Charles Benter testleri
- **bakers_dozen:** Thomas Nashe 1596'daki ilk kullanımın almanaklarla ilgili olması.
- **traffic_lights:** Potts sinyalinin The Henry Ford müzesinde olduğu. Script bunu zaten tek kaynaklı diye işaretliyor.

## Uzunluklar (kelime, dakikada 150 kelimeyle)
outlet 3.762 (~25 dk) · dryer 3.720 (~25) · traffic 3.600 (~24) · train 3.574 (~24) · hydrant 3.581 (~24) · fork 3.669 (~24,5) · baker 3.935 (~26)
