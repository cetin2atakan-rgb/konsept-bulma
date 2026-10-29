# DEVAM NOTU (yeni oturum önce bunu okusun) · 28 Ekim 2026

Repo: `cetin2atakan-rgb/konsept-bulma`, dal: `claude/gifted-galileo-84urzi`. Tüm iş bu dalda.
Kullanıcıyla Türkçe konuş. Kısa ve dürüst ol. Doğrulanmamış bilgiyi doğru gibi sunma.

## 1. Kullanıcı ve hedef

- Birden fazla faceless İngilizce YouTube kanalı yönetiyor (ABD kitlesi). Hedef: **yılbaşına (en geç Ocak-Şubat) kadar ayda $1.500 reklam geliri**, böylece ruh sağlığını bozan işinden ayrılabilmek. Duygusal olarak önemli; gerçekçi ve veriye dayalı konuş.
- Para kazanan tek kanal: **Eli Holloway | The Old Ways Remembered** (5.500 abone, 65+ ABD erkek, RPM ~$7,3). Plan: `output/eli_holloway_teshis_plan.md`, `output/yilbasi_1500_plani.md`.
- Diğer kanallar ve v2 skill'leri: `output/skiller_v2/`, kanal kararı `output/bes_kanal_karari_2026-10-27.md`.
- Kullanıcı Script/Visuals/Assets yükleyince: düzeltilmiş Assets.txt üret, `output/paketler/<konu>/` altına kaydet, gönder ve sorunları raporla (başlık ≤100 karakter, ANCHOR'lar script'te geçiyor mu, bölüm zamanları kelime sayısından, olgu hataları).

## 2. ŞU ANKİ İŞ: GTA 6 haber videoları (artık videoları bu oturum üretiyor)

Kullanıcı bundan sonra GTA videolarını **burada** render etmemizi istiyor. Diğer Claude hesabı ve Video Studio artık bu işte yok.

**Proje:** `gta6-edit/` (Remotion 4.0.300, React → MP4). Oku: `gta6-edit/README.md`, `gta6-edit/trailers/README.md`, `gta6-edit/trailers/VIDEO_STUDIO_ENTEGRASYON.md` (tüm kurallar burada).

**Akış:**
1. `tools/prep_vo.sh <seslendirme.mp3>` → `public/audio/vo.wav` (-14,5 LUFS).
2. Altyazı zamanları → `src/captions.json` `[{s,e,t}]`. Bu ortamda Whisper/HF modelleri indirilemiyor (HuggingFace engelli). Mevcut video için zamanlar `tools/segs.json`'dan geldi. Yeni videoda: script cümleleri + sesin sessizlik analizi (ffmpeg silencedetect) ile eşle, ya da kullanıcıdan SRT iste.
3. Kart listesi `src/scenes.ts` (kart türleri `src/kit.tsx`: big, bars, quote, chapter, timeline, store, post, people…). Yeni videoda script'ten üret.
4. `python tools/match_trailer.py` → `src/footage.json` (3,5 sn'de bir fragman sahnesi; etiket eşleşmesi; tekrar yok; launch trailer +1 öncelik). `--only launch_trailer` seçeneği var.
5. Render: `bash tools/render_chunks.sh Video1 out/video1.mp4` (2500 karelik sessiz parçalar + ayrı ses, sonra birleştirir; çökerse tekrar çalıştır, biten parçaları atlar). Tek parça render bu ortamda 2400. karede bellekten çöktü. 8 dk video ≈ 30 dk. İki render'ı aynı anda çalıştırma.
6. Ölç: `ffmpeg -i out.mp4 -af ebur128 -f null -` → hedef -14/-15 LUFS.

**Fragmanlar** (`public/trailers/`, git'e konmaz, telif):
- `launch_trailer.mp4`: kullanıcı yükledi (720p, 90 sn). Bu oturumda vardı; yeni oturumda yok, kullanıcıdan tekrar iste ya da Drive'dan indir.
- `extended_look.mp4`: **İLK İŞ.** Kullanıcı 627 MB orijinali Drive'a koyacak ve link verecek. Yeni oturumda ağ izni açık olmalı: `curl -L "https://drive.usercontent.google.com/download?id=<ID>&export=download&confirm=t" -o gta6-edit/public/trailers/extended_look.mp4`. Engelli çıkarsa B planı: kullanıcı 1080p ara kalite yapıp (`-an -crf 24 -vf scale=-2:1080`) 2 dk'lık parçalar halinde yükler, sen `concat` ile birleştirirsin. Toplam süre 26:45 olmalı.
- Extended Look gelince: kesim noktalarını kare hassasiyetinde bul (`select='gt(scene,0.25)',showinfo`), `trailers/catalog_extended_look.json` start/end değerlerini güncelle (şu an ±1 sn, 1 fps karelerden). id'ler ve açıklamalar korunur.

**Kataloglar:** `trailers/catalog_extended_look.json` (283 sahne, 269 kullanılabilir), `trailers/catalog_launch_trailer.json` (33 sahne, 29 kullanılabilir). `use:"no"` = logo, başlık kartı, siyah kare, kan.

**Kurallar:** Fragman sesi her zaman kapalı (Content ID). Logo ve başlık kartı yok. Kartlar fragmanın üstünde, arka plan karartılmış. Altyazı 58 px.

**28 Ekim durumu:** Extended Look 14 parça halinde yüklendi, birleştirildi (26:46, 60 fps, 720p). Kataloglar `tools/refine_cuts.py` ile kare hassasiyetinde. Video 1 final (`out/video1.mp4`, -15,6 LUFS) ve dikey Short 1 (`src/Short.tsx`, composition `Short1`, `out/short1.mp4`, 57 sn, dosya boyutu bölümü + uzun videoya yönlendiren son kart) render edilip kullanıcıya gönderildi. Short yükleme notu: `output/paketler/gta6_video01_13_things/short1_yukleme.md`. Fragman ve ses dosyaları yeni oturumda yine yok.

**28-29 Ekim: Video 2 ve 3 de render edildi ve gönderildi.** Proje artık çok videolu: her videonun verisi `src/v1.ts`, `src/v2/`, `src/v3/` (scenes + captions.json + footage.json), composition'lar `Video1/Video2/Video3/Short1` (`src/Root.tsx`). Ses dosyaları `public/audio/vo.wav`, `vo2.wav`, `vo3.wav` (git'te yok).
- **Altyazı zamanlaması artık otomatik:** `pip install pocketsphinx` (PyPI açık, model paketin içinde) → senaryodaki `> ` satırlarını `tools/vN/vo_script.txt` yap → `python3 tools/align_script.py vo16.wav tools/vN/vo_script.txt tools/vN/words.json` (16 kHz mono wav) → `tools/vN/captions_vN.py` (ekranda rakam gösteren DISPLAY listesi) → `src/vN/captions.json`. Video 2 ve 3'te tüm kelimeler hizalandı, sessizlik noktalarıyla örtüşüyor.
- Fragman eşleme: `python tools/match_trailer.py --captions src/vN/captions.json --out src/vN/footage.json --avoid src/v(N-1)/footage.json --every 4.0 --pin 0=EXT_162`.
- Render: `bash /home/user/konsept-bulma/gta6-edit/tools/render_chunks.sh VideoN out/videoN.mp4` (mutlak yol kullan). Render sürerken `src/`'ye dokunma: her parça kodu yeniden derliyor.
- Paketler: `output/paketler/gta6_video02_preload_trap/`, `output/paketler/gta6_video03_frame_rate/` (Assets.txt + script.md).

**Mevcut video (Video 1):** "13 Things Rockstar STILL Hasn't Told Us About GTA 6", seslendirme 8:06. Kullanıcı Extended Look gelince bu videonun final render'ını bekliyor. Yayından önce doğrulanmamış iddiaları kullanıcıya hatırlat: Stephen Root/AP, Rob Nelson 30 fps (kartta "on 60 fps" yazıyor, çelişki), 34 parçalık albüm, harita "3x/2x/5x" kaynakları. GTA 6 çıkışı 19 Kasım 2026.

## 3. Diğer açık işler

- **whatif-studio/**: kodla animasyonlu "What If" videoları (cartoon / insan karakter stili). Demolar `output/whatif_demolar/`. Kullanıcı onaylarsa ilk 8-10 dk video ve skill.
- **Rule Files konsepti**: `output/rule_files_analiz_ve_konsept.md`. Öneri: "After-Dark Almanac" konseptini önce Eli'de tek videoyla test etmek (paket henüz hazırlanmadı).
- **You Made It (3D Shorts)** incelendi: kodla aynı kalite zor; Blender denemesi önerildi, kullanıcı karar vermedi.
- Kontrol tarihleri: 16 Kasım, 30 Kasım, 14 Aralık, 31 Aralık (`yilbasi_1500_plani.md`).

## 4. Ortam notları

- Kokoro TTS ağırlıkları GitHub releases'tan indirildi (thewh1teagle/kokoro-onnx model-files-v1.0); scratchpad yeni oturumda boş olur.
- Playwright Chromium hazır: `/opt/pw-browsers/...chrome-headless-shell`.
- Sohbete video yükleme ~12 MB'a kadar çalıştı, 33 MB çalışmadı. Resim, mp3 ve rar çalışıyor (rar için `apt-get install unar`).
- Commit sonu satırları (system reminder'daki attribution) eklenmeli. Model adı commit'e yazılmaz.
