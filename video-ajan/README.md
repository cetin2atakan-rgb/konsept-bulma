# Video Ajan

Diğer Claude hesabında yazdırdığın video paketini (sıralama.txt, prompts.txt, Assets.txt, kaynaklar.txt…)
11 YouTube skill'inden geçiren yerel uygulama. Ajanlar dosyaları inceler, düzeltmeleri önerir; sen
kabul ettiklerin ayrı bir "son hali" klasörüne yazılır. Orijinal klasörüne dokunulmaz.

## Kurulum (Windows, bir kez)

1. Python 3.10 ya da üstü: https://www.python.org/downloads/ (kurarken **Add python.exe to PATH** kutusunu işaretle).
2. Bu repoyu bilgisayarına indir (GitHub → Code → Download ZIP ya da `git clone`).
3. `video-ajan\baslat.bat` dosyasına çift tıkla. Tarayıcıda `http://127.0.0.1:8765` açılır.

Başka bir şey kurmak gerekmez. Uygulama sadece bu bilgisayardan erişilir.

## Kullanım

1. Soldan **kanalı** seç.
2. Video klasörünü kutuya **sürükle** (ya da klasör yolunu yapıştır).
3. **Tüm ajanları çalıştır.** Her ajanın kartında bulgular, düzeltmeler (önce/sonra farkıyla) ve kopyalanacak çıktılar görünür.
4. Düzeltmeleri gözden geçir: **otomatik** olanlar işaretli gelir (rakamı yazıya çevirme, numaralama,
   stil cümlesi, uyarı satırı…), **öneri** olanlar (yeni hook, başlık, açıklama) işaretsiz gelir. Kutucukla kabul/ret et.
5. **Son hali oluştur** → `video-ajan\calisma\cikti\<paket adı>\` klasörüne yazılır. **ZIP indir** ile de alabilirsin.
   Klasörde `AJAN_RAPORU.md` neyin neden değiştiğini listeler.

## Ajanlar

| Ajan | Ne yapar | Ne zaman çalışır |
|---|---|---|
| Paket kontrolü | Video Studio kuralları: numaralar 1'den kesintisiz, sıralama = prompts satır sayısı, rakamlar yazıya, emoji/URL/parantez temizliği, satır kelime aralığı, bölüm kartı sırası, stil cümlesi, `[KARAKTER: …]`, başlık karakterleri, uyarı satırı, kaynaklar.txt, sağlık iddiası, süre | her pakette |
| yt-script | İlk 15 saniyenin hook puanı (`hookscore.py`), 0:15-0:45'te abone çağrısı, kapanışta tek istek; yapay zekâ açıksa 21 formülden 5 yeni açılış, puanı belirgin yüksekse öneri | her pakette |
| yt-package | Başlık + thumbnail yazısı birlikte (`title.py`): kesilme, tekrar, belirsizlik; yapay zekâ açıksa 10 başlık, en iyi 3 | her pakette |
| yt-seo | Açıklamanın ilk iki satırı, sorgu testi, en fazla 15 etiket | her pakette |
| yt-chapters | YouTube kurallarına uyan bölüm listesi → `bolumler.txt` | her pakette |
| yt-shorts | Kendi başına ayakta duran 20-55 sn'lik parçalar → `shorts.md` | her pakette |
| yt-edit | Kayıt transkriptinden kurgu listesi (`deadair.py`) → `kurgu_listesi.txt` | klasörde `.srt` / `.vtt` varsa |
| yt-retention | İzleyici tutma raporu (`retention.py`) | klasörde Studio'dan indirilen `.csv` varsa |
| yt-comment | Yorum triyajı, cevap taslakları, sabitlenecek yorum → `yorum_cevaplari.md` | adında `yorum` geçen dosya varsa |
| yt-viral | Rakip videoları kendi kanal medyanına göre sırala (`swipe.py`) | `viral.json` varsa |
| yt-audit | Kanaldaki paketlere toplu bakış: tek büyük düzeltme | aynı kanaldan en az 3 paket varsa |
| yt-plan | Haftalık plan (çapa + ucuz video + 3 Short) → `plan.md` | her pakette |

Ajanlar skill'leri repodaki `.claude/skills/yt-*` klasörlerinden okur; kopyaları yok. Skill güncellenirse uygulama da güncellenir.

## Yapay zekâ (isteğe bağlı)

Kontroller ve otomatik düzeltmeler **her zaman ücretsiz** ve internetsiz çalışır. Yazı gerektiren
adımlar (yeni hook, başlık, açıklamanın ilk iki satırı, bölüm adları, Shorts ilk satırları, yorum
cevapları) için sağ üstteki düğmeden birini seç:

- **Kapalı** (varsayılan): sıfır maliyet. Bu adımlar sorunu listeler, öneri yazmaz.
- **Ollama**: ücretsiz, bilgisayarında çalışır. https://ollama.com kur, sonra `ollama pull qwen2.5:14b`.
  Kalite modelin büyüklüğüne ve ekran kartına bağlı.
- **Claude API**: en iyi kalite, ücretli. `pip install anthropic` ve `ANTHROPIC_API_KEY` ortam değişkeni.
  Varsayılan model `claude-opus-5-5`. Daha ucuzu için ayarlarda `claude-haiku-5-5` yaz.

Her çağrı tek ve odaklı: o skill'in SKILL.md talimatı + kanal kuralları + ilgili dosya parçası. Sohbet
geçmişi taşınmadığı için video başına harcanan token, skill'leri sohbete yüklemekten çok daha azdır.

## Kanal ayarları

`kanallar.json` her kanal için: anlatım dili, kelime/dk, satır kelime aralığı, hedef süre, bölüm kartı,
stil cümlesi, açıklama uyarı satırı, sabit karakterler, yasak kelimeler, haftalık saat bütçesi, en iyi
yükleme günü. `sesler\<kanal>.md` yapay zekânın kullandığı ses profilidir.

Last Hatch ve Du, damals için stil cümlesi ve uyarı satırı boş; kanal skill'lerindeki değerleri yaz.

## Ek dosyalar (isteğe bağlı)

Paket klasörüne koyarsan ilgili ajan çalışır:

- `transkript.srt` (ya da `.vtt`, whisper `.json`): kendi kaydının transkripti
- `retention.csv`: YouTube Studio → video → Analytics → Engagement → izleyici tutma grafiği → indir
- `yorumlar.txt`: her yorum ayrı paragrafta
- `viral.json`: `[{"channel": "...", "title": "...", "views": 412000, "url": "..."}]`, kanal başına en az 4 video
