# Yeni skill yazım kontrol listesi (Atakan revizelerinden, Ekim 2026)

Her yeni kanal skill'i teslimden önce bu listeden geçer. Amaç: skill kullanılırken hiçbir soru işareti kalmasın;
her ayar ve kural "eğer… ise" değil, KESİN yazılır.

## Paket
- [ ] Klasör ve `name:` = kanal adının slug'ı (ör. plain-strength, grid-down-america). Türkçe tarif slug olmaz; description'da tetikleyici olarak kalır.
- [ ] Zip'in en üstünde `<slug>/`, uzantı `.skill`. Teslimde değişen dosyalar + paket boyutu (bayt) yazılır.
- [ ] Ortak dosyalar (POV hattında `references/uretim_kurallari.md`) eldeki orijinalden HİÇ DEĞİŞTİRMEDEN kopyalanır, `cmp` ile doğrulanır.
- [ ] Ortak ya da örnek dosya verilmemişse taklit edilip doldurulmaz: teslimde "şu dosya eksik, gönder" denir, paket bitmiş sayılmaz.

## SKILL.md içeriği (hepsi kesin)
- [ ] Neden çalışıyor: rakip rakamları, tutan/tutmayan videolar (izlenmeyle), tek cümlelik kural, tarih.
- [ ] Doğruluk + sağlık: ortak kuralla uyumlu; kanala özel serbest/yasak listesi açık. Rakam kuralı ile plan/yapı bölümü çelişmez
      (ör. set/tekrar "kaynaktaki genel aralık" olarak serbest; doz, kalori/gram, kilo/santim vaadi yasak).
- [ ] Atakan'ın konu yasakları açıkça yazılır (ör. plain-strength: beslenme tamamen yasak). Karar yoksa sorulur, tahmin edilmez.
- [ ] Bölüm kartı: AÇIK mı KAPALI mı kesin; hangi kalıp (`Number seven, …`, `Mistake two, …`), bir videoda tek kalıp,
      numaralar ardışık (geri sayımsa seven → one), kanca/plan/kapanışta kalıp yok; uygulama NO. kartı + YouTube bölüm listesi çıkarır.
- [ ] Satır uzunluğu ortak kuraldaki 14-26 kelime aralığında (ilk dakika dahil); görsel sayısı + Grok süresi hesaplı, 250 altı.
- [ ] Stil cümlesi yalnızca HER sahnede geçerli olan stili içerir. Sadece bazı sahnelere ait efekt (ör. kas parlaması) stil cümlesine
      girmez, ilgili promptun içine sahne olarak yazılır. Örnek promptlar bu kurala uyar.
- [ ] Stil seçimi rakipten farklıysa gerekçe + risk (ilk 5-10 videoda tıklanma izlenir) yazılır.
- [ ] Tekrar eden sahne tipine (harita, tablo, manken) sabit prompt kalıbı verilir.
- [ ] Grok'un bozduğu şeyler için önlem: karmaşık hareket başlangıç/bitiş pozisyonunda + `correct form, neutral spine`;
      yazı en fazla 3-4 kelime tırnakta; altta boş/beyaz/krem şerit yok.
- [ ] Kaynak kutusu örneği kanala özel verilir (ör. `N: SOURCE: EIA reliability data, SAIDI 2023`); sıralama yöntemi kutuda görünür.
- [ ] Başlık kuralı: rakibin başlığını birebir ya da çok yakın kopyalama yasak; tek tek tıklama kelimeleri yasak değil,
      aynı duygu kendi kelimelerimizle verilir. Kanalın seçim kuralına uyan kalıplar verilir.
- [ ] Kelime sayma komutu Windows uyumlu: `python -X utf8 -c "…" "sıralama.txt"`.
- [ ] Ses (Kokoro sesi + hız), uyarı satırı, teslim klasörü yolu yazılı.
- [ ] Sonda "Uygulama kartı ayarları (Claude Code'da eklenecek)": hat, ses+hız, altyazı, NO. bölüm kartı, geçiş sesi (sfx), gren,
      vinyet, geçiş tipi, karakter onayı (karakterler.txt var/yok), görsel kaynağı. Atakan vermediyse "ÖNERİ, onaylanmadı" etiketi.

## video_fikirleri.md
- [ ] Başlıklar kanalın kendi seçim kuralına uyar (teknik/kas adı başlık yok, sonuç ya da hata çerçevesi).
- [ ] Her fikrin yanında "tez kaynakla doğrulanmazsa bırak" notu; spekülasyona kayabilecek konularda dayanılacak gerçek kaynak yazılı.
- [ ] Yasak konular (ör. beslenme) listede yer almaz; rakibin yaptığı konular en sonda.
