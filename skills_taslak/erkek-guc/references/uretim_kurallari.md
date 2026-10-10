# Üretim kuralları (tüm yeni kanallar için ortak)

## 1. Video Studio'nun beklediği paket (bir klasör = bir video)
Klasörde şu dosyalar olur (dosya adında şu kelimeler geçmesi yeterli, büyük/küçük harf fark etmez):

| Dosya | Zorunlu | İçerik |
|---|---|---|
| `sıralama.txt` | evet | Her satır: `N. Anlatım metni`. Satır N, `N.png` görseline karşılık gelir. Her satır ayrı seslendirilir; satırın görseli o satır boyunca ekranda kalır. |
| `Assets.txt` | evet | Başlık, açıklama, thumbnail promptları, etiketler (aşağıdaki biçim). |
| `prompts.txt` | evet | Her satır: `N. [KARAKTER: Ad] sahne tarifi`. N, sıralama satırı numarasıyla birebir aynı. Grok Bot bunlardan görsel üretir. |
| `karakterler.txt` | yalnızca sabit karakteri olan kanallarda (yoksa oluşturma) | `Ad: tanım` satırları + bir `STIL: …` satırı. Uygulama önce referans sayfalarını üretir, kullanıcı onaylar, sonra sahneler o karakterlere bağlanır. |
| `kaynaklar.txt` | önerilir | `N: SOURCE: Yazar/Kurum, Yıl` ya da `N: SUPPORTED` / `N: MIXED` / `N: POPULAR IDEA`. Satır N başladığında sol üstte küçük kutu çıkar (4,5 sn). Kutu ekranda AYNEN görünür: İngilizce yaz (`SOURCE: Sethna et al., 2017`); Türkçe kelime (`ve ark.`, `Yazar`, `Yıl`, `KAYNAK`) yazma. |
| `avatar.txt` | sadece sunucu avatarlı kanallarda | `N: klip.mp4 full` (tam ekran) ya da `N: klip.mp4 pip` (köşede). Klip dosyaları klasöre ya da `avatar\` alt klasörüne konur. Klibin sesi kullanılmaz; anlatım Kokoro'dan gelir. |
| `kaynak_listesi.md` | evet (insan için) | Her iddia için kaynak adı + bağlantı. Uygulama okumaz; Atakan'ın kontrolü içindir. |

### sıralama.txt kuralları
- Satır başına 14-26 kelime (≈6-10 sn). Çok kısa satırlar görsel sayısını şişirir, çok uzunlar görseli sıkıcı yapar.
- Her satır kendi başına okunabilir, tam bir düşünce olmalı (cümle ortasında bölme). Rakamları harfle yaz ya da Kokoro'nun rahat okuyacağı biçimde (`nineteen eighty-five`, `forty percent`). Kısaltma, emoji, parantez, URL, hashtag yazma.
- Bölüm kartı için satır şu kalıplardan biriyle başlar: `Number three, ...`, `Mistake two, ...`, `Habit one, ...`, `Sign four, ...`, `Reason five, ...`, `Tip two, ...`, `Rule one, ...`, `Myth three, ...`, `Fact two, ...`; Ladder Lives'ta `Level one, ...`. Uygulama bunları NO. 3 / LEVEL 1 kartına çevirir ve YouTube bölüm listesini kendisi çıkarır.
- Tahmini süre: 150 kelime ≈ 1 dk.

### Assets.txt biçimi
```
# Video NN Assets: <başlık>

## TITLE (selected)
<seçilen başlık>

## Title options
1. ...
2. ...
3. ...

## Description
<2-3 paragraf; ilk 2 satır arama için güçlü>
<kanalın uyarı satırı>
<kaynakların kısa listesi>
#hashtag #hashtag #hashtag

## Thumbnail Prompts (3)
1. ...
2. ...
3. ...

## SEO Tags
etiket1, etiket2, ...
```
`## TITLE (selected)` satırının altındaki ilk dolu satır, videonun dosya adı olur (uygulama bu başlığı okur). Başlıkta `:` kullanabilirsin; `/ \ ? * " < >` kullanma. Maksimum ~95 karakter.

### prompts.txt kuralları
- Her görsel ayrı, tek cümlelik net bir sahne: kim, nerede, ne yapıyor, ne hissediyor, kamera. Karakter geçiyorsa `[KARAKTER: Ad]` yer tutucusu kullan (uygulama bunu referans görsele bağlar).
- Ekranda yazı gerekiyorsa tırnak içinde, en fazla 3-4 kelime ve prompta aynen yaz; gerekmedikçe yazı isteme.
- **Her promptun sonuna kanalın stil cümlesini (SKILL.md'deki "Stil cümlesi") aynen ekle.** Grok her görseli bağımsız üretir; `STIL:` satırı yalnızca karakter referans sayfalarında kullanılır, sahne promptlarına otomatik eklenmez. Kanalın görsel dilini bozacak şey (fotogerçekçi vb.) yazma.
- 16:9 yatay kompozisyon, ana konu merkezde ya da üçte bir çizgisinde; görsel kareyi baştan sona doldursun: altta boş, düz beyaz ya da krem şerit bırakma (altyazı görselin üstüne yazılır, ayrı alan gerekmez).

## 2. Araştırma ve doğrulama (zorunlu)
1. Konu verilmişse onu, verilmemişse kanalın kitlesinde işe yarayan, tekrar etmeyen bir konu seç (aynı konuyu iki kez yapma; kullanıcı geçmişi paylaşmadıysa bu konuşmadaki videolara bak).
2. Web araması yap: her önemli iddia için birincil kaynak (araştırma makalesi, kurum raporu, resmi veri). Kaynakta ne yazıyorsa o kadarını söyle; rakamı kaynağındaki gibi yaz.
3. Bir iddiayı kaynağa bağlayamıyorsan **at**. "Psychologists say", "studies show", "experts agree" gibi kaynaksız kalıplar yasak; bunun yerine çalışmanın adı ya da yazarı + yıl.
4. Çelişen bulgular varsa ikisini de söyle ("one study found..., another did not"). "Association, not a guarantee" dili.
5. `kaynak_listesi.md` içine her iddia için: satır numarası, iddia, kaynak, bağlantı yaz. Bağlantısını açıp kontrol edemediğin kaynağı "doğrulanamadı" diye işaretle ve metinden çıkar.

## 3. Sağlık ve iddia kuralı (Atakan'ın kesin kuralı)
- Kesin sağlık, tedavi, şifa iddiası yok: "iyileştirir", "hastalığı yok eder", "kurtarır", "garanti" yasak. Başlıkta da: `cures`, `beats [hastalık]`, `better than [ilaç]`, `doctors hate` yok.
- Dil: "geleneksel olarak kullanıldı", "bir çalışmada ... bulundu, başka bir çalışmada bulunamadı", "ilişkili", "olabilir".
- Teşhis koyma (çocuğa ya da izleyiciye "senin çocuğunda X var" deme). Ciddi konularda (kendine zarar, istismar, ciddi hastalık) ayrıntı verme; kısa ve sakin biçimde uzmana yönlendir.
- Her videonun açıklamasında kanalın uyarı satırı bulunur.
- Kimseye zarar verebilecek talimat yok (zehirli bitki, ilaç dozu, tehlikeli deney).

## 4. Özgünlük
Rakip kanalların video başlıklarını, cümlelerini, karakterlerini, mizah kalıplarını ve slogan/şakalarını **kopyalama**. Aynı konuyu işleyebilirsin; yapı, örnekler, karakterler ve cümleler bizim olmalı. Kanalın sabit bir karakter kadrosu ve görsel dili vardır; değiştirme.

## 5. Teslim kontrol listesi
- [ ] `sıralama.txt` ve `prompts.txt` satır sayıları birebir aynı, numaralar 1'den kesintisiz.
- [ ] Hiçbir satırda emoji/URL/hashtag/parantez yok.
- [ ] Bölüm kartı satırları kalıba uygun; numaralar ardışık.
- [ ] `Assets.txt` içinde `## TITLE (selected)` var.
- [ ] `kaynaklar.txt` numaraları geçerli satırları gösteriyor; her kaynak `kaynak_listesi.md` içinde var.
- [ ] Sağlık/tedavi/kesin iddia kuralı ihlali yok.
- [ ] Toplam kelime sayısı hedef süreye uyuyor.
