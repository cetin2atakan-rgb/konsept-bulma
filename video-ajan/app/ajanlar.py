"""Paket kontrolü + 11 YouTube skill ajanı.

Her ajan bir rapor döndürür:
  durum       tamam | uyari | hata | atlandi
  ozet        tek cümle
  bulgular    [{seviye, mesaj, satir?}]
  duzeltmeler [{id, dosya, tur, anahtar, eski, yeni, neden, otomatik}]
  bloklar     [{baslik, metin}]  (kopyalanacak çıktı)

Düzeltmeler hiçbir zaman doğrudan diske yazılmaz. Arayüzde kabul edilenler, "Son hali oluştur"
denince çıktı klasörüne yazılır.
"""
import re
from collections import Counter

import araclar
import llm
from paket import Paket, numarali_satirlar
from sayilar import cardinal, rakamlari_yaziya

# ------------------------------------------------------------------------------------------------
# yardımcılar


def rapor(aid, ad):
    return {"id": aid, "ad": ad, "durum": "tamam", "ozet": "", "bulgular": [], "duzeltmeler": [],
            "bloklar": []}


def bulgu(r, seviye, mesaj, satir=None):
    r["bulgular"].append({"seviye": seviye, "mesaj": mesaj, "satir": satir})
    if seviye == "hata":
        r["durum"] = "hata"
    elif seviye == "uyari" and r["durum"] == "tamam":
        r["durum"] = "uyari"


def duzelt(r, dosya, tur, anahtar, eski, yeni, neden, otomatik=False):
    r["duzeltmeler"].append({
        "id": f"{r['id']}-{len(r['duzeltmeler']) + 1}", "dosya": dosya, "tur": tur,
        "anahtar": anahtar, "eski": eski, "yeni": yeni, "neden": neden, "otomatik": otomatik,
    })


def kelime(t):
    return len(t.split())


def sn(t, wpm):
    return kelime(t) / wpm * 60.0


def mmss(t):
    t = int(round(t))
    h, m, s = t // 3600, (t % 3600) // 60, t % 60
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m}:{s:02d}"


def zamanlar(satirlar, wpm):
    """Her satırın tahmini başlangıç saniyesi (Kokoro, satır arası ~0.3 sn)."""
    out, t = [], 0.0
    for n, metin in satirlar:
        out.append((n, t, metin))
        t += sn(metin, wpm) + 0.3
    return out, t


def sistem(skill, k, ek=""):
    kural = [
        f"Channel: {k['ad']}. Narration language: {k['dil']}.",
        f"Each narration line must be {k['satir_min']}-{k['satir_max']} words and a complete thought.",
        "The narration is read by a text-to-speech voice: write every number as words, "
        "no digits, abbreviations, emoji, parentheses, URLs, hashtags, $, % or &.",
        "Never invent a number, a result, a quote or a source. If the input does not support a "
        "claim, leave it out.",
        "No health, cure or guarantee claims.",
    ]
    if k["yasak_kelimeler"]:
        kural.append("Never use: " + ", ".join(k["yasak_kelimeler"]) + ".")
    s = (f"You are running the {skill} skill inside a local video-package editor. There is no chat "
         "and no follow-up question: do the task once, using the skill below.\n\n"
         f"<skill name=\"{skill}\">\n{araclar.skill_metni(skill)}\n</skill>\n\n"
         "<channel_rules>\n" + "\n".join(kural) + "\n</channel_rules>\n")
    if k["ses"]:
        s += f"\n<voice_profile>\n{k['ses']}\n</voice_profile>\n"
    if ek:
        s += "\n" + ek + "\n"
    return s + "\nRespond with a single JSON object only. No prose before or after it."


def anlatim_temizle(t, k=None):
    if k is None or k.get("rakam_yaziya", True):
        t, _ = rakamlari_yaziya(t)
    return re.sub(r"\s+", " ", t.replace("(", "").replace(")", "")).strip()


def yz_hatasi(r, e):
    bulgu(r, "uyari", f"Yapay zekâ adımı yapılamadı: {e}")


def yz_kapali_notu(r, ne):
    bulgu(r, "bilgi", f"Yapay zekâ kapalı: {ne} için öneri üretilmedi. Ayarlardan Ollama ya da "
                      "Claude açılırsa bu adım da çalışır.")


SAYI_KELIME = {cardinal(i): i for i in range(1, 41)}
KART = re.compile(r"^(Number|Mistake|Habit|Sign|Reason|Tip|Rule|Myth|Fact|Level|Day|Step|Lesson|"
                  r"Secret|Signal|Thing|Way|Trick)\s+([a-z\-]+)\s*[,:.]", re.I)


def kart(metin):
    m = KART.match(metin.strip())
    if m and m.group(2).lower() in SAYI_KELIME:
        return m.group(1).capitalize(), SAYI_KELIME[m.group(2).lower()]
    return None


# ------------------------------------------------------------------------------------------------
# 0. Paket kontrolü (Video Studio kuralları)

EMOJI = re.compile("[\U0001F000-\U0001FAFF☀-➿️‍]")
URL = re.compile(r"https?://\S+|www\.\S+")
KISALTMA = re.compile(r"\b[A-Z]{2,6}s?\b")
KISALTMA_SERBEST = {"I", "OK", "TV", "AM", "PM", "US", "USA", "UK", "AI"}
SAGLIK = [r"\bcures?\b", r"\bcured\b", r"\bbeats? (cancer|diabetes|depression|anxiety|disease)",
          r"\bbetter than (medicine|drugs?|pills?|ozempic)", r"\bdoctors hate\b", r"\bguarantee",
          r"\bmiracle\b", r"\bheals? (cancer|diabetes|disease)", r"\breverses? (aging|diabetes|disease)"]
BASLIK_YASAK = '/\\?*"<>|'
TR_KAYNAK = [("ve ark.", "et al."), ("ve ark", "et al."), ("KAYNAK:", "SOURCE:"), ("Kaynak:", "SOURCE:"),
             ("Yazar", "Author"), ("Yıl", "Year")]


def paket_kontrol(p: Paket, k, ctx):
    r = rapor("paket", "Paket kontrolü")
    sira, prom = p.siralama(), p.prompts()
    if not p.yol("siralama"):
        bulgu(r, "hata", "sıralama.txt bulunamadı. Dosya adında 'sıralama' geçmeli.")
    if not p.yol("prompts"):
        bulgu(r, "hata", "prompts.txt bulunamadı.")
    if not p.yol("assets"):
        bulgu(r, "hata", "Assets.txt bulunamadı.")
    if k["karakterler"] and not p.yol("karakterler"):
        bulgu(r, "uyari", "Bu kanalın sabit karakteri var ama karakterler.txt yok.")
    if not p.yol("kaynak_listesi"):
        bulgu(r, "uyari", "kaynak_listesi.md yok (kaynak kontrolü için gerekli).")
    if not sira:
        r["ozet"] = "Paket okunamadı."
        return r

    # numaralama
    for dosya, satirlar in (("siralama", sira), ("prompts", prom)):
        if satirlar and [n for n, _ in satirlar] != list(range(1, len(satirlar) + 1)):
            yeni = "\n".join(f"{i}. {t}" for i, (_, t) in enumerate(satirlar, 1)) + "\n"
            duzelt(r, dosya, "dosya", None, p.metin(dosya), yeni,
                   f"{dosya} numaraları 1'den kesintisiz değildi, yeniden numaralandı.", True)
            satirlar[:] = [[i, t] for i, (_, t) in enumerate(satirlar, 1)]
    if prom and len(prom) != len(sira):
        bulgu(r, "hata", f"sıralama {len(sira)} satır, prompts {len(prom)} satır. Satır sayıları "
                         "birebir aynı olmalı (her satır bir görsel).")

    # anlatım satırları
    kisa, uzun = [], []
    for n, t in sira:
        yeni = t
        yeni = URL.sub("", yeni)
        yeni = EMOJI.sub("", yeni)
        yeni = yeni.replace("#", "").replace("&", " and ").replace("(", "").replace(")", "")
        if k["rakam_yaziya"]:
            yeni, _ = rakamlari_yaziya(yeni)
        elif re.search(r"\d", yeni):
            bulgu(r, "uyari", "Satırda rakam var; seslendirme için yazıyla yaz.", n)
        yeni = re.sub(r"\s+", " ", yeni).strip()
        if yeni != t:
            duzelt(r, "siralama", "satir", n, t, yeni,
                   "Seslendirme için: rakam yazıya, emoji/URL/hashtag/parantez/& temizlendi.", True)
        kisalt = [w for w in KISALTMA.findall(yeni) if w.rstrip("s") not in KISALTMA_SERBEST]
        if kisalt:
            bulgu(r, "uyari", f"Kısaltma: {', '.join(sorted(set(kisalt)))}. Açık yaz ya da harf harf "
                              "(E I A).", n)
        w = kelime(yeni)
        if w < k["satir_min"]:
            kisa.append(n)
        elif w > k["satir_max"]:
            uzun.append(n)
        for desen in SAGLIK:
            if re.search(desen, yeni, re.I):
                bulgu(r, "hata", f"Sağlık/kesin iddia kuralı: '{re.search(desen, yeni, re.I).group(0)}'", n)
        for y in k["yasak_kelimeler"]:
            if re.search(r"\b" + re.escape(y) + r"\b", yeni, re.I):
                bulgu(r, "hata", f"Kanal için yasak kelime: '{y}'", n)
    if kisa:
        bulgu(r, "uyari", f"{len(kisa)} satır {k['satir_min']} kelimeden kısa (görsel sayısını şişirir): "
                          + ", ".join(map(str, kisa[:15])) + ("…" if len(kisa) > 15 else ""))
    if uzun:
        bulgu(r, "uyari", f"{len(uzun)} satır {k['satir_max']} kelimeden uzun (görsel çok uzun kalır): "
                          + ", ".join(map(str, uzun[:15])) + ("…" if len(uzun) > 15 else ""))

    # bölüm kartları
    kartlar = [(n, kart(t)) for n, t in sira if kart(t)]
    if k["bolum_karti"]:
        if not kartlar:
            bulgu(r, "uyari", "Bu kanalda bölüm kartı açık ama 'Number three, …' kalıbında satır yok.")
        else:
            turler = {c[0] for _, c in kartlar}
            if len(turler) > 1:
                bulgu(r, "uyari", f"Bir videoda tek kalıp kullanılmalı; bulunanlar: {', '.join(sorted(turler))}.")
            sayilar = [c[1] for _, c in kartlar]
            artan = list(range(sayilar[0], sayilar[0] + len(sayilar)))
            azalan = list(range(sayilar[0], sayilar[0] - len(sayilar), -1))
            if sayilar not in (artan, azalan):
                bulgu(r, "uyari", "Bölüm kartı numaraları ardışık değil: "
                                  + ", ".join(f"{n}. satır={c[1]}" for n, c in kartlar))

    # promptlar
    stil = k["stil_cumlesi"].strip()
    karakter_adlari = set()
    kt = p.metin("karakterler")
    for line in kt.splitlines():
        m = re.match(r"^\s*([^:]+):", line)
        if m and m.group(1).strip().upper() != "STIL":
            karakter_adlari.add(m.group(1).strip())
    for n, t in prom:
        if stil and not t.rstrip(" .").endswith(stil.rstrip(" .")):
            yeni = t.rstrip(" ,.") + ", " + stil
            duzelt(r, "prompts", "satir", n, t, yeni, "Kanalın stil cümlesi promptun sonuna eklendi.", True)
        for ad in re.findall(r"\[KARAKTER:\s*([^\]]+)\]", t):
            if karakter_adlari and ad.strip() not in karakter_adlari:
                bulgu(r, "hata", f"[KARAKTER: {ad}] karakterler.txt içinde yok.", n)

    # Assets
    if p.yol("assets"):
        for gerek in ("TITLE", "Title options", "Description", "Thumbnail", "SEO Tags"):
            if p.assets_bolum(gerek) is None:
                bulgu(r, "hata" if gerek == "TITLE" else "uyari", f"Assets.txt içinde '## {gerek}' bölümü yok.")
        baslik = p.baslik()
        if baslik:
            temiz = re.sub(r"\?\s+(?=\w)", ": ", baslik)
            temiz = "".join(c for c in temiz if c not in BASLIK_YASAK).strip()
            if temiz != baslik:
                eski = p.assets_bolum("TITLE")
                duzelt(r, "assets", "bolum", "TITLE (selected)", eski, eski.replace(baslik, temiz, 1),
                       "Başlık dosya adı olacağı için / \\ ? * \" < > | çıkarıldı (ortadaki ? yerine :).", True)
            if len(temiz) > 95:
                bulgu(r, "uyari", f"Başlık {len(temiz)} karakter; en fazla ~95 olmalı.")
            for desen in SAGLIK:
                if re.search(desen, temiz, re.I):
                    bulgu(r, "hata", f"Başlıkta sağlık/kesin iddia: '{re.search(desen, temiz, re.I).group(0)}'")
        aciklama = p.assets_bolum("Description")
        uyari = k["uyari_satiri"].strip()
        if aciklama is not None and uyari and uyari not in aciklama:
            duzelt(r, "assets", "bolum", "Description", aciklama, aciklama.rstrip() + "\n\n" + uyari,
                   "Kanalın uyarı satırı açıklamaya eklendi.", True)

    # kaynaklar
    kay = p.metin("kaynaklar")
    if kay:
        yeni_kay = kay
        for tr, en in TR_KAYNAK:
            yeni_kay = yeni_kay.replace(tr, en)
        if yeni_kay != kay:
            duzelt(r, "kaynaklar", "dosya", None, kay, yeni_kay,
                   "Kaynak kutusu ekranda aynen görünür: Türkçe kelimeler İngilizceye çevrildi.", True)
        for line in kay.splitlines():
            m = re.match(r"^\s*(\d+)\s*:", line)
            if m and not (1 <= int(m.group(1)) <= len(sira)):
                bulgu(r, "hata", f"kaynaklar.txt satır {m.group(1)}'i gösteriyor ama sıralama {len(sira)} satır.")

    # süre
    toplam = sum(kelime(t) for _, t in sira)
    dk = toplam / k["wpm"]
    lo, hi = k["hedef_dk"]
    gorsel_saat = len(sira) * k["gorsel_sn"] / 3600
    r["bloklar"].append({"baslik": "Paket özeti", "metin":
                         f"{len(sira)} satır / görsel · {toplam} kelime · ~{dk:.1f} dk "
                         f"({k['wpm']} kelime/dk) · Grok ~{gorsel_saat:.1f} saat"})
    if dk < lo or dk > hi:
        bulgu(r, "uyari", f"Tahmini süre {dk:.1f} dk; kanal hedefi {lo}-{hi} dk.")
    if len(sira) > 250:
        bulgu(r, "uyari", f"{len(sira)} görsel; 250'yi geçmemeli. Satırları uzat.")
    oto = sum(1 for d in r["duzeltmeler"] if d["otomatik"])
    hata = sum(1 for b in r["bulgular"] if b["seviye"] == "hata")
    r["ozet"] = f"{oto} otomatik düzeltme, {hata} hata, {len(r['bulgular']) - hata} uyarı/bilgi."
    return r


# ------------------------------------------------------------------------------------------------
# 1. yt-script: ilk 15 saniye, dönüş, kapanış

DONUS_YASAK = r"\b(subscribe|welcome to|before we get started|smash|like button|hit the bell|" \
              r"my name is|in today's video|don't forget to)\b"
ISTEK = r"\b(subscribe|comment|check out|like this video|share this|watch this next|join)\b"


def acilis_cumlesi(metin):
    """hookscore.py tek bir konuşma cümlesini puanlar (9-24 kelime). İlk cümleyi, gerekirse 24 kelimeye kadar alır."""
    m = re.match(r"(.+?[.!?])(\s|$)", metin.strip())
    cumle = m.group(1) if m else metin.strip()
    w = cumle.split()
    if len(w) < 9:
        w = metin.split()[:24]
    return " ".join(w[:30])


def hook_satirlari(sira, wpm, hedef=15.0):
    out, t = [], 0.0
    for n, metin in sira:
        if t >= hedef or len(out) >= 4:
            break
        out.append([n, metin])
        t += sn(metin, wpm)
    return out


def yt_script(p, k, ctx):
    r = rapor("yt-script", "yt-script · senaryo")
    sira = p.siralama()
    if not sira:
        r["durum"], r["ozet"] = "atlandi", "sıralama.txt yok."
        return r
    wpm = k["wpm"]
    hook = hook_satirlari(sira, wpm)
    hook_metin = " ".join(t for _, t in hook)
    hp = araclar.hook_puani(acilis_cumlesi(hook_metin))
    r["bloklar"].append({"baslik": f"Mevcut açılış (satır {hook[0][0]}-{hook[-1][0]}, ~15 sn)",
                         "metin": hook_metin + "\n\nPuanlanan hook cümlesi: " + hp["hook"] + "\n\n" + puan_panel(hp)})
    if hp["bant"] == "WEAK":
        bulgu(r, "uyari", f"Hook puanı {hp['puan']} (WEAK). En zayıf: {hp['zayif']} → {hp['oneri']}")
    elif hp["bant"] == "WORKABLE":
        bulgu(r, "bilgi", f"Hook puanı {hp['puan']} (WORKABLE). En zayıf: {hp['zayif']} → {hp['oneri']}")
    else:
        bulgu(r, "bilgi", f"Hook puanı {hp['puan']} (STRONG).")

    zaman, toplam = zamanlar(sira, wpm)
    for n, t0, metin in zaman:
        if t0 > 45:
            break
        m = re.search(DONUS_YASAK, metin, re.I)
        if m:
            bulgu(r, "uyari", f"0:15-0:45 arasında '{m.group(0)}': kanal tanıtımı / abone çağrısı 0:30 "
                              "düşüşünün en yaygın sebebi. Çıkar.", n)
    son = [t for n, t0, t in zaman if t0 > toplam - 60]
    istekler = sorted({m.lower() for t in son for m in re.findall(ISTEK, t, re.I)})
    if len(istekler) > 1:
        bulgu(r, "uyari", f"Kapanışta {len(istekler)} ayrı istek var ({', '.join(istekler)}). Tek istek bırak.")
    baslik = p.baslik()
    if baslik:
        bw = {w for w in re.findall(r"[a-z']{4,}", baslik.lower())} - {"that", "this", "with", "your", "what", "when"}
        hw = set(re.findall(r"[a-z']{4,}", hook_metin.lower()))
        if bw and not (bw & hw):
            bulgu(r, "uyari", "Hook başlığın verdiği sözü doğrulamıyor (başlıktaki hiçbir anahtar kelime "
                              "ilk 15 saniyede geçmiyor). İnsanlar 0:08'de bu yüzden çıkar.")
    r["bloklar"].append({"baslik": "Süre", "metin": f"~{toplam / 60:.1f} dk ({wpm} kelime/dk), "
                                                    f"150 kelime/dk ile ~{sum(kelime(t) for _, t in sira) / 150:.1f} dk"})

    if not llm.acik():
        yz_kapali_notu(r, "5 yeni hook")
    else:
        formuller = araclar.hook_formulleri()
        f_ozet = "\n".join(f"- {f['name']}: {f['shape']} Fails when: {f['fails_when']}"
                           for f in formuller["hooks"])
        devam = " ".join(t for n, t in sira[len(hook):len(hook) + 4])
        user = (f"Video title: {baslik}\n\nCurrent opening ({len(hook)} narration lines, the first fifteen "
                f"seconds):\n" + "\n".join(f"{i}. {t}" for i, (_, t) in enumerate(hook, 1)) +
                f"\n\nWhat comes right after (keep it consistent with this):\n{devam}\n\n"
                f"The 21 hook formulas:\n{f_ozet}\n\n"
                f"Write FIVE alternative openings, each from a different formula. Each opening must be "
                f"exactly {len(hook)} narration lines, each line {k['satir_min']}-{k['satir_max']} words, "
                f"and must lead naturally into the text that follows. Confirm the title's promise in the "
                f"first sentence, open a question the viewer cannot close, prove the payoff exists.\n"
                'JSON: {"hooks": [{"formula": "formula name", "lines": ["line 1", "..."]}]}')
        try:
            cevap = llm.sor(sistem("yt-script", k), user)
            adaylar = []
            for h in cevap.get("hooks", [])[:5]:
                lines = [anlatim_temizle(x, k) for x in h.get("lines", []) if str(x).strip()]
                if len(lines) != len(hook):
                    continue
                if any(not (k["satir_min"] - 2 <= kelime(x) <= k["satir_max"] + 2) for x in lines):
                    continue
                sc = araclar.hook_puani(acilis_cumlesi(" ".join(lines)))
                adaylar.append((sc["puan"], h.get("formula", ""), lines, sc))
            adaylar.sort(key=lambda a: -a[0])
            if not adaylar:
                bulgu(r, "uyari", "Yapay zekânın hook önerileri satır kurallarına uymadı.")
            for i, (pu, formul, lines, sc) in enumerate(adaylar[:2], 1):
                r["bloklar"].append({"baslik": f"Hook önerisi {i} · {formul} · {pu} {sc['bant']}",
                                     "metin": "\n".join(lines) + "\n\n" + puan_panel(sc)})
            if adaylar and adaylar[0][0] >= hp["puan"] + 5:
                pu, formul, lines, sc = adaylar[0]
                for (n, eski), yeni in zip(hook, lines):
                    duzelt(r, "siralama", "satir", n, eski, yeni,
                           f"Hook {hp['puan']} → {pu} ({formul}). Görsel promptu da kontrol et.")
            elif adaylar:
                bulgu(r, "bilgi", f"En iyi öneri {adaylar[0][0]} puan; mevcut hook ({hp['puan']}) "
                                  "yeterince geride değil, değiştirme önerilmedi.")
        except llm.YapayZekaYok as e:
            yz_hatasi(r, e)
    r["ozet"] = f"Hook {hp['puan']}/100 ({hp['bant']}), formül: {hp['formul']}."
    return r


def puan_panel(hp):
    return "\n".join(f"{k:<12} {v:3d}  {'#' * (v // 5)}" for k, v in hp["ozellikler"].items()) + \
        f"\nVERDICT      {hp['puan']:3d}  {hp['bant']}\nformula      {hp['formul']}\n" \
        f"weakest      {hp['zayif']} - {hp['oneri']}"


# ------------------------------------------------------------------------------------------------
# 2. yt-package: başlık + thumbnail birlikte

def thumb_metinleri(p):
    t = p.assets_bolum("Thumbnail") or ""
    return [m for m in re.findall(r"[\"“]([^\"”]{2,40})[\"”]", t)]


def baslik_panel(c):
    s = [f"\"{c['title']}\"  {c['chars']} karakter  puan {c['score']}/100"]
    s += [f"  x {a:<12} {b}" for a, b in c["issues"]]
    s += [f"  ok           {g}" for g in c["good"]]
    return "\n".join(s)


def temiz_baslik(t):
    t = re.sub(r"^\s*\d+[.)]\s*", "", str(t)).strip().strip('"').strip()
    t = re.sub(r"\?\s+(?=\w)", ": ", t)
    return "".join(c for c in t if c not in BASLIK_YASAK).strip()


def yt_package(p, k, ctx):
    r = rapor("yt-package", "yt-package · başlık + thumbnail")
    baslik = p.baslik()
    if not baslik:
        r["durum"], r["ozet"] = "atlandi", "Assets.txt içinde seçili başlık yok."
        return r
    thumbs = thumb_metinleri(p)
    thumb = thumbs[0] if thumbs else None
    c = araclar.baslik_kontrol(baslik, thumb)
    r["bloklar"].append({"baslik": "Seçili başlık", "metin": baslik_panel(c) +
                         (f"\n  thumbnail yazısı: \"{thumb}\"" if thumb else "\n  thumbnail promptunda yazı yok")})
    for a, b in c["issues"]:
        bulgu(r, "uyari" if a in ("duplicate", "length", "shouting", "thumb-length") else "bilgi", f"{a}: {b}")
    secenekler = [temiz_baslik(x) for x in (p.assets_bolum("Title options") or "").splitlines() if x.strip()]
    if secenekler:
        sirali = sorted((araclar.baslik_kontrol(x, thumb) for x in secenekler), key=lambda x: -x["score"])
        r["bloklar"].append({"baslik": "Başlık seçenekleri (puana göre)",
                             "metin": "\n\n".join(baslik_panel(x) for x in sirali)})
        if sirali[0]["score"] > c["score"] + 8:
            bulgu(r, "bilgi", f"Seçeneklerden \"{sirali[0]['title']}\" ({sirali[0]['score']}) seçili başlıktan "
                              f"({c['score']}) yüksek puanlı.")

    if not llm.acik():
        yz_kapali_notu(r, "10 başlık + thumbnail yazısı")
    else:
        ilk = " ".join(t for _, t in p.siralama()[:12])
        user = (f"Current title: {baslik}\nCurrent title options:\n" + "\n".join(secenekler) +
                f"\nThumbnail image prompts:\n{p.assets_bolum('Thumbnail') or '-'}\n\n"
                f"Opening of the narration:\n{ilk}\n\n"
                "Write TEN titles for this exact video. Max 95 characters, never use / \\ ? * \" < > |. "
                "Do not promise anything the narration does not deliver. Then write the thumbnail text "
                "(max three words, different words from the winning title, same promise) and a one "
                "paragraph thumbnail brief: expression, framing, the three words, background contrast at "
                "feed size.\n"
                'JSON: {"titles": ["..."], "thumbnail_text": "...", "thumbnail_brief": "..."}')
        try:
            cevap = llm.sor(sistem("yt-package", k), user)
            tt = (cevap.get("thumbnail_text") or "").strip().strip('"') or thumb
            adaylar = [temiz_baslik(x) for x in cevap.get("titles", []) if str(x).strip()]
            adaylar = [x for x in adaylar if 10 <= len(x) <= 95]
            puanli = sorted((araclar.baslik_kontrol(x, tt) for x in adaylar), key=lambda x: -x["score"])
            if puanli:
                r["bloklar"].append({"baslik": "Yeni başlıklar · ilk 3",
                                     "metin": "\n\n".join(baslik_panel(x) for x in puanli[:3])})
                if tt:
                    r["bloklar"].append({"baslik": "Thumbnail", "metin":
                                         f"Yazı: {tt}\n\n{cevap.get('thumbnail_brief', '').strip()}"})
                kazanan = puanli[0]
                c2 = araclar.baslik_kontrol(baslik, tt)
                if kazanan["score"] >= c2["score"] + 8:
                    eski = p.assets_bolum("TITLE")
                    duzelt(r, "assets", "bolum", "TITLE (selected)", eski,
                           eski.replace(baslik, kazanan["title"], 1),
                           f"Başlık puanı {c2['score']} → {kazanan['score']}.")
                eski_ops = p.assets_bolum("Title options")
                yeni_ops = "\n".join(f"{i}. {x['title']}" for i, x in enumerate(puanli[:3], 1))
                if eski_ops is not None:
                    duzelt(r, "assets", "bolum", "Title options", eski_ops, yeni_ops,
                           "title.py ile puanlanan en iyi üç başlık.")
            else:
                bulgu(r, "uyari", "Yapay zekânın başlıkları kurallara uymadı.")
        except llm.YapayZekaYok as e:
            yz_hatasi(r, e)
    r["ozet"] = f"Başlık {c['score']}/100, {len(c['issues'])} sorun."
    return r


# ------------------------------------------------------------------------------------------------
# 3. yt-seo: açıklamanın ilk iki satırı, etiketler, sorgu testi

def ilk_iki(aciklama):
    satirlar = [x for x in aciklama.splitlines() if x.strip()]
    return satirlar[:2]


def yt_seo(p, k, ctx):
    r = rapor("yt-seo", "yt-seo · açıklama + etiket")
    aciklama = p.assets_bolum("Description")
    if aciklama is None:
        r["durum"], r["ozet"] = "atlandi", "Assets.txt içinde Description yok."
        return r
    baslik = p.baslik()
    iki = ilk_iki(aciklama)
    etiket = p.assets_bolum("SEO Tags") or ""
    etiketler = [x.strip() for x in re.split(r"[,\n]", etiket) if x.strip()]
    if len(etiketler) > 15:
        bulgu(r, "uyari", f"{len(etiketler)} etiket; 15 yeterli, fazlası işe yaramaz.")
        duzelt(r, "assets", "bolum", "SEO Tags", etiket, ", ".join(etiketler[:15]),
               "Etiketler ilk 15 ile sınırlandı (yt-seo).")
    if not iki:
        bulgu(r, "hata", "Açıklama boş.")
    else:
        bw = {w for w in re.findall(r"[a-z']{4,}", baslik.lower())} - {"that", "this", "with", "your", "what", "when", "where", "which"}
        iw = set(re.findall(r"[a-z']{4,}", " ".join(iki).lower()))
        eksik = sorted(bw - iw)
        if bw and len(eksik) > len(bw) / 2:
            bulgu(r, "uyari", "Açıklamanın ilk iki satırı başlığın anahtar kelimelerini taşımıyor: "
                              + ", ".join(eksik) + ". Arama özeti bu iki satırdır.")
    r["bloklar"].append({"baslik": "Açıklamanın görünen kısmı", "metin": "\n".join(iki) or "-"})

    if not llm.acik():
        yz_kapali_notu(r, "sorgu testi + ilk iki satır + etiketler")
    else:
        ilk = " ".join(t for _, t in p.siralama()[:15])
        user = (f"Title: {baslik}\nCurrent description:\n{aciklama}\n\nCurrent tags: {etiket}\n\n"
                f"Opening of the narration:\n{ilk}\n\n"
                "1) Write the three search queries a real person types that this video should win. "
                "2) Rewrite ONLY the first two lines of the description so they contain the words of "
                "those queries and say what the video gives them. Same language as the description. "
                "3) Up to fifteen tags for disambiguation only.\n"
                'JSON: {"queries": ["...", "...", "..."], "first_two_lines": ["line 1", "line 2"], '
                '"tags": ["..."], "title_has_query_words": true}')
        try:
            cevap = llm.sor(sistem("yt-seo", k), user)
            sorgular = [str(x) for x in cevap.get("queries", [])][:3]
            yeni_iki = [str(x).strip() for x in cevap.get("first_two_lines", []) if str(x).strip()][:2]
            if sorgular:
                r["bloklar"].append({"baslik": "Kazanması gereken sorgular", "metin": "\n".join(sorgular)})
                if cevap.get("title_has_query_words") is False:
                    bulgu(r, "uyari", "Başlık bu sorguların kelimelerini içermiyor: sorun açıklamada değil "
                                      "başlıkta (yt-package).")
            if len(yeni_iki) == 2 and iki:
                satirlar = aciklama.splitlines()
                yeni, sayac = [], 0
                for line in satirlar:
                    if line.strip() and sayac < 2:
                        yeni.append(yeni_iki[sayac])
                        sayac += 1
                    else:
                        yeni.append(line)
                duzelt(r, "assets", "bolum", "Description", aciklama, "\n".join(yeni),
                       "Açıklamanın ilk iki satırı arama sorgularına göre yeniden yazıldı.")
            tags = [str(x).strip() for x in cevap.get("tags", []) if str(x).strip()][:15]
            if tags and not etiketler:
                duzelt(r, "assets", "bolum", "SEO Tags", etiket, ", ".join(tags), "Etiket yoktu, eklendi.")
            elif tags:
                r["bloklar"].append({"baslik": "Etiket önerisi", "metin": ", ".join(tags)})
        except llm.YapayZekaYok as e:
            yz_hatasi(r, e)
    r["ozet"] = f"{len(etiketler)} etiket, ilk iki satır kontrol edildi."
    return r


# ------------------------------------------------------------------------------------------------
# 4. yt-chapters: bölüm listesi (YouTube kuralları: 00:00, en az 3, her biri ≥10 sn)

def yt_chapters(p, k, ctx):
    r = rapor("yt-chapters", "yt-chapters · bölümler")
    sira = p.siralama()
    tr = p.yol("transkript")
    if tr and not sira:
        try:
            j = araclar.chapters(p.klasor / tr)
            ch = [{"t": c["start"], "ad": c["draft_title"]} for c in j["chapters"]]
        except RuntimeError as e:
            bulgu(r, "hata", str(e))
            return r
        kaynak = "transkript"
    else:
        if not sira:
            r["durum"], r["ozet"] = "atlandi", "sıralama.txt ya da transkript yok."
            return r
        zaman, toplam = zamanlar(sira, k["wpm"])
        kartli = [(t0, metin) for n, t0, metin in zaman if kart(metin)]
        ch = [{"t": 0.0, "ad": "Intro"}]
        for t0, metin in kartli:
            govde = re.sub(r"^(the|a|an)\s+", "", KART.sub("", metin, count=1).strip(), flags=re.I)
            ad = re.split(r"[,;:.]", govde)[0]
            ch.append({"t": t0, "ad": " ".join(ad.split()[:5]).strip().capitalize()})
        if len(ch) < 3:
            # kart yoksa: chapters.py ile aynı fikir, kelime değişimi en büyük yerler
            ch = [{"t": 0.0, "ad": "Intro"}]
            STOP = set("the a an of for to in on and or is are was were be with this that it as at by from "
                       "you your i we they but so if then not just very like about".split())
            kw = [set(w for w in re.findall(r"[a-z']{4,}", t.lower()) if w not in STOP) for _, _, t in zaman]
            aday = []
            for i in range(3, len(zaman) - 3):
                once = set().union(*kw[max(0, i - 6):i])
                sonra = set().union(*kw[i:i + 6])
                deg = 1 - len(once & sonra) / max(1, len(once | sonra))
                aday.append((deg, zaman[i][1], zaman[i][2]))
            aday.sort(reverse=True)
            for deg, t0, metin in aday:
                if len(ch) >= 7:
                    break
                if all(abs(t0 - c["t"]) >= 60 for c in ch):
                    ch.append({"t": t0, "ad": " ".join(metin.split()[:5]).rstrip(",.;:")})
            ch.sort(key=lambda c: c["t"])
        kaynak = f"tahmini zaman ({k['wpm']} kelime/dk)"
        for c in ch:
            c["son"] = None
        for i, c in enumerate(ch):
            c["sure"] = (ch[i + 1]["t"] if i + 1 < len(ch) else toplam) - c["t"]
        ch = [c for c in ch if c["t"] == 0 or c["sure"] >= 10]
    gecerli = len(ch) >= 3 and ch[0]["t"] == 0
    if not gecerli:
        bulgu(r, "uyari", "Geçerli bölüm listesi çıkmadı (YouTube 00:00 ile başlayan en az 3 bölüm ister).")

    if llm.acik() and ch:
        user = ("Retitle each chapter as the promise of that section, three to five words, in the "
                "narration language. Keep the same number and order.\n" +
                "\n".join(f"{mmss(c['t'])} {c['ad']}" for c in ch) +
                '\nJSON: {"titles": ["...", "..."]}')
        try:
            cevap = llm.sor(sistem("yt-chapters", k), user)
            yeni = [str(x).strip() for x in cevap.get("titles", [])]
            if len(yeni) == len(ch):
                for c, t in zip(ch, yeni):
                    c["ad"] = t
            else:
                bulgu(r, "uyari", "Yapay zekâ bölüm sayısını değiştirdi; taslak başlıklar kullanıldı.")
        except llm.YapayZekaYok as e:
            yz_hatasi(r, e)
    elif ch:
        bulgu(r, "bilgi", "Başlıklar taslak (bölümün ilk kelimeleri). Yayından önce her birini o bölümün "
                          "vaadi olarak 3-5 kelimeyle yeniden yaz.")
    blok = "\n".join(f"{'00:00' if c['t'] == 0 else mmss(c['t'])} {c['ad']}" for c in ch)
    r["bloklar"].append({"baslik": f"Bölümler ({kaynak})", "metin": blok})
    if ch:
        duzelt(r, "bolumler.txt", "yeni_dosya", None, None, blok + "\n",
               "Bölüm listesi bolumler.txt olarak eklenir. Seslendirmeden sonra .srt eklenirse zamanlar kesinleşir.",
               True)
    r["ozet"] = f"{len(ch)} bölüm, {'geçerli' if gecerli else 'GEÇERSİZ'} ({kaynak})."
    return r


# ------------------------------------------------------------------------------------------------
# 5. yt-shorts: uzun videonun içindeki Shorts adayları

BAGLAC = re.compile(r"^(and|but|so|that|this|these|those|it|its|it's|they|he|she|which|because|also|"
                    r"then|plus|or|now|here|there)\b", re.I)
DONUS = re.compile(r"\b(but|however|except|actually|turns out|instead|until|yet|the catch|the problem)\b", re.I)


def yt_shorts(p, k, ctx):
    r = rapor("yt-shorts", "yt-shorts · Shorts adayları")
    sira = p.siralama()
    if len(sira) < 8:
        r["durum"], r["ozet"] = "atlandi", "Shorts için en az 8 satır gerekiyor."
        return r
    wpm = k["wpm"]
    zaman, _ = zamanlar(sira, wpm)
    adaylar = []
    for i in range(len(sira)):
        if BAGLAC.match(sira[i][1]) or kart(sira[i][1]):
            continue
        sure, j = 0.0, i
        while j < len(sira) and sure < 55:
            sure += sn(sira[j][1], wpm)
            if 20 <= sure <= 55 and sira[j][1].rstrip().endswith((".", "!", "?")):
                metin = " ".join(t for _, t in sira[i:j + 1])
                puan = (3 if DONUS.search(metin) else 0) + (2 if re.search(r"\b(you|your)\b", sira[i][1], re.I) else 0) \
                    + (1 if re.search(r"\d|\b(one|two|three|four|five|six|seven|eight|nine|ten|hundred|thousand|percent)\b", metin) else 0)
                if DONUS.search(metin):
                    adaylar.append((puan, i, j, sure, metin))
            j += 1
    adaylar.sort(key=lambda a: (-a[0], a[1]))
    secilen = []
    for a in adaylar:
        if all(a[2] < s[1] or a[1] > s[2] for s in secilen):
            secilen.append(a)
        if len(secilen) == 5:
            break
    secilen.sort(key=lambda a: a[1])
    if not secilen:
        bulgu(r, "bilgi", "Kendi başına ayakta duran, içinde dönüş olan 20-55 sn'lik parça bulunamadı.")
        r["ozet"] = "Aday yok."
        return r
    yz = {}
    if llm.acik():
        parca = "\n\n".join(f"[{n}] {s[4]}" for n, s in enumerate(secilen))
        user = ("These spans were cut from a long video. For each one write: a NEW first line for a "
                "viewer who has not seen the long video (9 to 24 words), on-screen text for the first two "
                "seconds (max five words, different from the spoken line), and the loop point: what the "
                "last line sets up so the first line answers it.\n\n" + parca +
                '\nJSON: {"shorts": [{"index": 0, "new_first_line": "...", "on_screen": "...", "loop": "..."}]}')
        try:
            cevap = llm.sor(sistem("yt-shorts", k), user)
            for s in cevap.get("shorts", []):
                if isinstance(s, dict) and isinstance(s.get("index"), int):
                    yz[s["index"]] = s
        except llm.YapayZekaYok as e:
            yz_hatasi(r, e)
    else:
        yz_kapali_notu(r, "yeni ilk satır + ekran yazısı")
    md = [f"# Shorts adayları: {p.baslik() or p.ad}\n"]
    for n, (pu, i, j, sure, metin) in enumerate(secilen):
        z0 = zaman[i][1]
        md.append(f"## {n + 1}. Satır {sira[i][0]}-{sira[j][0]} · ~{mmss(z0)} · {sure:.0f} sn")
        md.append(f"İlk satır (uzun videodaki): {sira[i][1]}")
        if n in yz:
            nf = anlatim_temizle(yz[n].get("new_first_line", ""), k)
            hp = araclar.hook_puani(nf) if nf else None
            md.append(f"Yeni ilk satır: {nf}" + (f"  (hook {hp['puan']} {hp['bant']})" if hp else ""))
            md.append(f"Ekran yazısı (ilk 2 sn): {yz[n].get('on_screen', '')}")
            md.append(f"Döngü noktası: {yz[n].get('loop', '')}")
        md.append("Dikey kadraj: 16:9 görselde ana konu merkezde değilse kırpılır; ilgili promptları kontrol et.")
        md.append(f"\n{metin}\n")
    metin = "\n".join(md)
    r["bloklar"].append({"baslik": f"{len(secilen)} Shorts adayı", "metin": metin})
    duzelt(r, "shorts.md", "yeni_dosya", None, None, metin, "Shorts adayları shorts.md olarak eklenir.", True)
    r["ozet"] = f"{len(secilen)} aday."
    return r


# ------------------------------------------------------------------------------------------------
# 6. yt-edit: transkriptten kurgu listesi (kayıt varsa)

def yt_edit(p, k, ctx):
    r = rapor("yt-edit", "yt-edit · kurgu listesi")
    tr = p.yol("transkript")
    if not tr:
        r["durum"] = "atlandi"
        r["ozet"] = "Transkript (.srt/.vtt/whisper .json) yok. Kokoro seslendirmesinde gerekmez; kendi " \
                    "kaydın varsa transkriptini klasöre koy."
        return r
    try:
        j = araclar.deadair(p.klasor / tr)
    except RuntimeError as e:
        bulgu(r, "hata", str(e))
        return r
    satir = [f"{c['kind']:<7} {c['start']:8.2f} -> {c['end']:8.2f}   {c['end'] - c['start']:5.2f}s   {c['why']}"
             for c in j["cuts"]]
    oran = j["removed"] / j["duration"] * 100 if j["duration"] else 0
    ozet = f"{len(j['cuts'])} kesim, {j['removed']:.1f} sn çıkar, {j['out']:.1f} sn kalır (%{oran:.1f} kısa)"
    metin = "\n".join(satir) + f"\n\n{ozet}\nNot: bu yalnızca KONUŞMANIN kısalması; sessiz demo varsa süreyi görüntüyle karşılaştır."
    r["bloklar"].append({"baslik": "Kurgu listesi (EDL)", "metin": metin})
    duzelt(r, "kurgu_listesi.txt", "yeni_dosya", None, None, metin + "\n", "EDL kurgu_listesi.txt olarak eklenir.", True)
    r["ozet"] = ozet
    return r


# ------------------------------------------------------------------------------------------------
# 7. yt-retention

def yt_retention(p, k, ctx):
    r = rapor("yt-retention", "yt-retention · izleyici tutma")
    csv = p.yol("retention")
    if not csv:
        r["durum"] = "atlandi"
        r["ozet"] = "İzleyici tutma CSV'si yok (Studio → video → Analytics → Engagement → indir)."
        return r
    tr = p.yol("transkript")
    sure = None
    if p.siralama():
        _, sure = zamanlar(p.siralama(), k["wpm"])
    try:
        j = araclar.retention(p.klasor / csv, p.klasor / tr if tr else None, int(sure) if sure else None)
    except RuntimeError as e:
        bulgu(r, "hata", str(e))
        return r
    hl = j["hook_leak"]
    karar = "sağlıklı" if hl < 25 else "sızıntı" if hl < 40 else "ciddi"
    satir = [f"HOOK LEAK  ilk bölümde %{hl:.1f} kayıp [{karar}] (25 altı sağlıklı)", "", "CLIFFS"]
    for c in j["cliffs"]:
        nerede = f"{c['at_seconds']:.0f} sn" if c.get("at_seconds") is not None else str(c["from"])
        soz = j["said"].get(str(c["from"]), "")
        satir.append(f"  -%{c['lost']:.1f}  {nerede}" + (f'   "{soz}"' if soz else ""))
    if not j["cliffs"]:
        satir.append("  keskin düşüş yok; kayıp tamamen kayma")
    satir += ["", f"SLIDE  birim başına %{j['slide_per_unit']:.3f}"]
    if hl >= 25:
        en_buyuk = f"En büyük sızıntı: ilk 30 saniye (%{hl:.1f}). Kurguyu değil, ilk 15 saniyenin metnini düzelt → yt-script."
    elif j["cliffs"]:
        c = j["cliffs"][0]
        nerede = f"{c['at_seconds']:.0f}. saniye" if c.get("at_seconds") is not None else f"%{c['from']:.0f} konumu"
        en_buyuk = f"En büyük sızıntı: {nerede} civarındaki %{c['lost']:.1f} düşüş. O andaki konu geçişini işaretle ya da kısalt."
    else:
        en_buyuk = "Hook sağlıklı ve kayma düz: video iyi, sorun paketleme → yt-package."
    satir += ["", en_buyuk]
    if hl >= 25:
        bulgu(r, "uyari", en_buyuk)
    r["bloklar"].append({"baslik": "İzleyici tutma raporu", "metin": "\n".join(satir)})
    r["ozet"] = en_buyuk
    return r


# ------------------------------------------------------------------------------------------------
# 8. yt-comment: yorum triyajı + cevaplar

SORU_BAS = re.compile(r"^(how|what|why|when|where|which|who|can|could|do|does|is|are|will|would|should)\b", re.I)
DUZELTME = re.compile(r"\b(actually|wrong|incorrect|not true|mistake|correction|you meant|it's not|isn't)\b", re.I)
YEM = re.compile(r"\b(fake|clickbait|trash|garbage|stupid|idiot|worst|ai slop|cringe|scam|liar|dislike)\b", re.I)


def yorumlari_oku(metin):
    j = None
    try:
        import json
        j = json.loads(metin)
    except ValueError:
        pass
    if isinstance(j, list):
        out = []
        for x in j:
            out.append(str(x.get("text") or x.get("textDisplay") or "") if isinstance(x, dict) else str(x))
        return [x.strip() for x in out if x.strip()]
    bloklar = [b.strip() for b in re.split(r"\n\s*\n", metin) if b.strip()]
    if len(bloklar) <= 1:
        bloklar = [x.strip() for x in metin.splitlines() if x.strip()]
    return bloklar


def yt_comment(p, k, ctx):
    r = rapor("yt-comment", "yt-comment · yorumlar")
    y = p.yol("yorumlar")
    if not y:
        r["durum"], r["ozet"] = "atlandi", "Yorum dosyası yok (adında 'yorum' ya da 'comment' geçen .txt/.json)."
        return r
    yorumlar = yorumlari_oku(p.dosyalar[y])
    yiginlar = {"Sorular": [], "Düzeltmeler": [], "Övgü": [], "Yem (cevap verme)": []}
    for c in yorumlar:
        if YEM.search(c):
            yiginlar["Yem (cevap verme)"].append(c)
        elif DUZELTME.search(c):
            yiginlar["Düzeltmeler"].append(c)
        elif "?" in c or SORU_BAS.match(c):
            yiginlar["Sorular"].append(c)
        else:
            yiginlar["Övgü"].append(c)
    sayim = " · ".join(f"{a}: {len(b)}" for a, b in yiginlar.items())
    sorular = yiginlar["Sorular"]
    pin = None
    if sorular:
        kw = [set(re.findall(r"[a-z']{4,}", s.lower())) for s in sorular]
        pin = max(range(len(sorular)), key=lambda i: sum(len(kw[i] & kw[j]) for j in range(len(sorular)) if j != i))
    md = [f"# Yorum cevapları\n\n{sayim}\n"]
    cevaplar = {}
    if llm.acik():
        hedef = sorular[:15] + yiginlar["Düzeltmeler"][:10] + yiginlar["Övgü"][:5]
        if hedef:
            user = ("Draft replies. Under 30 words each. Answer the actual question in the first sentence. "
                    "If a correction is right, say so plainly and thank them; never argue a fact you cannot "
                    "check. Praise: brief, mention something specific from their comment. Never promise a "
                    "video. No emoji unless the voice profile uses them.\n\n" +
                    "\n".join(f"[{i}] {c}" for i, c in enumerate(hedef)) +
                    '\nJSON: {"replies": [{"index": 0, "reply": "..."}]}')
            try:
                cevap = llm.sor(sistem("yt-comment", k), user)
                for x in cevap.get("replies", []):
                    if isinstance(x, dict) and isinstance(x.get("index"), int) and x["index"] < len(hedef):
                        cevaplar[hedef[x["index"]]] = str(x.get("reply", "")).strip()
            except llm.YapayZekaYok as e:
                yz_hatasi(r, e)
    else:
        yz_kapali_notu(r, "cevap taslakları")
    for ad, liste in yiginlar.items():
        md.append(f"## {ad} ({len(liste)})")
        for c in liste:
            md.append(f"- {c}")
            if c in cevaplar:
                md.append(f"  → {cevaplar[c]}")
        md.append("")
    if pin is not None:
        md.append(f"## Sabitle\n{sorular[pin]}\n(En çok kişinin de sorduğu soru: diğer sorularla en fazla ortak kelime.)")
    if sorular:
        md.append("\nSık sorulanlar bir sonraki videonun konusu olabilir.")
    metin = "\n".join(md)
    r["bloklar"].append({"baslik": "Triyaj + cevaplar", "metin": metin})
    duzelt(r, "yorum_cevaplari.md", "yeni_dosya", None, None, metin + "\n", "yorum_cevaplari.md olarak eklenir.", True)
    r["ozet"] = sayim
    return r


# ------------------------------------------------------------------------------------------------
# 9. yt-viral: rakip videoları kendi kanal medyanına göre sırala

def yt_viral(p, k, ctx):
    r = rapor("yt-viral", "yt-viral · nişte tutanlar")
    v = p.yol("viral")
    if not v:
        r["durum"] = "atlandi"
        r["ozet"] = 'Rakip video listesi yok (viral.json: [{"channel","title","views","url"}], kanal başına en az 4 video).'
        return r
    try:
        j = araclar.swipe(p.klasor / v, 1.5)
    except RuntimeError as e:
        bulgu(r, "hata", str(e))
        return r
    out = j["outliers"]
    satir = [f"{x['multiple']:5.2f}x  {x['views']:>10,}  medyan {x['median']:>9,}  {x['channel'][:22]:<22}  {x['title'][:60]}\n"
             f"        formül: {x['formula']}" for x in out[:10]]
    if j["skipped_thin_channels"]:
        satir.append("\n4'ten az videosu olan kanallar atlandı: " +
                     ", ".join(f"{c} ({n})" for c, n in j["skipped_thin_channels"]))
    sayac = Counter(x["formula"] for x in out)
    if sayac:
        satir.append("\nOutlier'lardaki formüller: " + ", ".join(f"{f} ×{n}" for f, n in sayac.most_common()))
        satir.append("Formül başlığın kelimelerine göre bir yargıdır, videonun neden tuttuğuna dair bir iddia değil.")
    r["bloklar"].append({"baslik": "Outlier'lar (kendi kanal medyanının katı)", "metin": "\n".join(satir) or "Eşiği geçen yok."})
    r["ozet"] = f"{len(out)} outlier; en sık formül: {sayac.most_common(1)[0][0] if sayac else '-'}."
    return r


# ------------------------------------------------------------------------------------------------
# 10. yt-audit: kanaldaki paketlere toplu bakış

def yt_audit(p, k, ctx):
    r = rapor("yt-audit", "yt-audit · kanal denetimi")
    paketler = [x for x in ctx.get("kanal_paketleri", []) if x.baslik()]
    if len(paketler) < 3:
        r["durum"] = "atlandi"
        r["ozet"] = f"Kanal denetimi için bu kanaldan en az 3 paket gerekiyor (şu an {len(paketler)})."
        return r
    paketler = paketler[-10:]
    basliklar = [x.baslik() for x in paketler]
    bp = [araclar.baslik_kontrol(b) for b in basliklar]
    hooklar = [araclar.hook_puani(acilis_cumlesi(" ".join(t for _, t in hook_satirlari(x.siralama(), k["wpm"]))))
               for x in paketler]
    ort_b = sum(x["score"] for x in bp) / len(bp)
    ort_h = sum(x["puan"] for x in hooklar) / len(hooklar)
    sekil = Counter(" ".join(b.split()[:2]).lower() for b in basliklar)
    en_sik, adet = sekil.most_common(1)[0]
    zayif_hook = sum(1 for h in hooklar if h["bant"] == "WEAK")
    if adet >= max(3, len(basliklar) // 2):
        fix = f"Format sorunu: {len(basliklar)} başlığın {adet} tanesi '{en_sik} …' ile başlıyor. Kanal sayfasında hepsi aynı sözü veriyor gibi duruyor. Bu hafta: sıradaki 3 videonun başlığını farklı kalıplarla yaz (yt-package)."
    elif zayif_hook >= len(hooklar) / 2 or ort_h < ort_b - 10:
        fix = f"İlk 15 saniye: {len(hooklar)} paketin {zayif_hook} tanesinde hook WEAK (ortalama {ort_h:.0f}). Bu hafta: yt-script ile her paketin hook'unu yeniden yaz."
    else:
        en_kotu = min(bp, key=lambda x: x["score"])
        fix = f"Başlıklar: ortalama {ort_b:.0f}/100. En zayıf: \"{en_kotu['title']}\" ({en_kotu['score']}). Bu hafta: en zayıf 3 başlığı yt-package ile yeniden paketle."
    calisan = []
    iyi_b = max(bp, key=lambda x: x["score"])
    calisan.append(f"En güçlü başlık: \"{iyi_b['title']}\" ({iyi_b['score']}): " + "; ".join(iyi_b["good"][:2]))
    iyi_h = max(zip(hooklar, basliklar), key=lambda x: x[0]["puan"])
    calisan.append(f"En güçlü hook: \"{iyi_h[1]}\" videosunda ({iyi_h[0]['puan']}, {iyi_h[0]['formul']}).")
    formuller = Counter(h["formul"] for h in hooklar)
    if formuller:
        f, n = formuller.most_common(1)[0]
        calisan.append(f"Hook'larda en sık kullanılan kalıp: {f} ({n} kez).")
    metin = (f"EN BÜYÜK DÜZELTME\n{fix}\n\nZATEN İŞE YARAYANLAR (bozma)\n- " + "\n- ".join(calisan) +
             "\n\nŞİMDİLİK YAPMA\n- Thumbnail ve yükleme ritmi bu uygulamada görülemiyor; onları YouTube Studio'dan "
             "kontrol etmeden stili değiştirme.\n- Tek seferde birden fazla şeyi değiştirme; hangi değişikliğin işe yaradığını göremezsin.\n\n"
             "Başlıklar ve hook puanları:\n" +
             "\n".join(f"  {b['score']:3d}  hook {h['puan']:3d}  {b['title']}" for b, h in zip(bp, hooklar)))
    r["bloklar"].append({"baslik": f"Kanal denetimi ({len(paketler)} paket)", "metin": metin})
    r["ozet"] = fix.split(".")[0] + "."
    return r


# ------------------------------------------------------------------------------------------------
# 11. yt-plan: haftalık yükleme planı

GUNLER = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"]


def yt_plan(p, k, ctx):
    r = rapor("yt-plan", "yt-plan · haftalık plan")
    paketler = [x for x in ctx.get("kanal_paketleri", []) if x.siralama()]
    if not paketler:
        r["durum"], r["ozet"] = "atlandi", "Plan için bu kanaldan paket yok."
        return r
    bilgiler = []
    for x in paketler:
        s = x.siralama()
        dk = sum(kelime(t) for _, t in s) / k["wpm"]
        saat = len(s) * k["gorsel_sn"] / 3600 + 0.75   # görseller + kontrol/yükleme
        bilgiler.append({"ad": x.baslik() or x.ad, "dk": dk, "saat": saat,
                         "soz": " ".join(s[0][1].split()[:16]) + "…", "hazir": x.ad})
    capa = max(bilgiler, key=lambda b: b["dk"])
    ucuz = [b for b in bilgiler if b is not capa]
    ucuz = min(ucuz, key=lambda b: b["saat"]) if ucuz else None
    gun = k["en_iyi_gun"] if k["en_iyi_gun"] in GUNLER else None
    gi = GUNLER.index(gun) if gun else 1
    satirlar = [((gi) % 7, f"Çapa video ({capa['dk']:.0f} dk) | {capa['ad']} | {capa['soz']} | paket: {capa['hazir']}")]
    toplam = capa["saat"]
    if ucuz:
        satirlar.append(((gi + 3) % 7, f"Ucuz video ({ucuz['dk']:.0f} dk) | {ucuz['ad']} | {ucuz['soz']} | paket: {ucuz['hazir']}"))
        toplam += ucuz["saat"]
    for n, off in enumerate((1, 2, 5), 1):
        satirlar.append(((gi + off) % 7, f"Short {n} | çapa videodan (yt-shorts) | çapa videonun bir anı | shorts.md"))
    toplam += 3 * 0.3
    tablo = ["| Gün | Format | Çalışma başlığı | Tek cümlelik söz | Hazır olan |", "|---|---|---|---|---|"]
    tablo += [f"| {GUNLER[g]} | {m} |" for g, m in sorted(satirlar)]
    not_ = (f"\n\nBu hafta yaklaşık {toplam:.1f} saat (görsel üretimi {k['gorsel_sn']} sn/görsel üzerinden). "
            f"Haftalık bütçe: {k['haftalik_saat']} saat.")
    if toplam > k["haftalik_saat"]:
        not_ += " Bütçeyi aşıyor: önce Shorts'ları, sonra ucuz videoyu bırak."
        bulgu(r, "uyari", f"Plan {toplam:.1f} saat; haftalık bütçe {k['haftalik_saat']} saat.")
    else:
        not_ += " Hafta kötü giderse önce Shorts'ları bırak."
    if not gun:
        not_ += "\nEn iyi yükleme günü ayarlanmadı (kanallar.json → en_iyi_gun); YouTube Studio'daki kendi verine göre seç, Salı varsayıldı."
    sira_disi = [b["ad"] for b in bilgiler if b is not capa and b is not ucuz]
    if sira_disi:
        not_ += "\nSonraki haftalara kalanlar: " + "; ".join(sira_disi)
    metin = "\n".join(tablo) + not_
    r["bloklar"].append({"baslik": "Haftalık plan", "metin": metin})
    duzelt(r, "plan.md", "yeni_dosya", None, None, f"# Haftalık plan · {k['ad']}\n\n{metin}\n",
           "Plan plan.md olarak eklenir.", True)
    r["ozet"] = f"Çapa: {capa['ad']} · ~{toplam:.1f} saat."
    return r


# ------------------------------------------------------------------------------------------------

AJANLAR = [
    ("paket", "Paket kontrolü", "Video Studio dosya kuralları: numaralama, rakamlar, stil cümlesi, başlık, kaynaklar", paket_kontrol),
    ("yt-script", "yt-script", "İlk 15 saniye (hook puanı), dönüş, tek istek; 5 yeni hook", yt_script),
    ("yt-package", "yt-package", "Başlık + thumbnail birlikte: kesilme, tekrar, belirsizlik; 10 başlık", yt_package),
    ("yt-seo", "yt-seo", "Açıklamanın ilk iki satırı, sorgu testi, en fazla 15 etiket", yt_seo),
    ("yt-chapters", "yt-chapters", "YouTube kurallarına uyan bölüm listesi", yt_chapters),
    ("yt-shorts", "yt-shorts", "Kendi başına ayakta duran 20-55 sn'lik Shorts adayları", yt_shorts),
    ("yt-edit", "yt-edit", "Kayıt transkriptinden kurgu listesi (ölü an, dolgu, tekrar)", yt_edit),
    ("yt-retention", "yt-retention", "İzleyici tutma CSV'sinden en büyük sızıntı", yt_retention),
    ("yt-comment", "yt-comment", "Yorum triyajı, cevap taslakları, sabitlenecek yorum", yt_comment),
    ("yt-viral", "yt-viral", "Rakip videoları kendi kanal medyanına göre sırala", yt_viral),
    ("yt-audit", "yt-audit", "Kanaldaki paketlere toplu bakış: tek büyük düzeltme", yt_audit),
    ("yt-plan", "yt-plan", "Kapasiteye göre haftalık yükleme planı", yt_plan),
]


def calistir(aid, p, k, ctx):
    for a, ad, _, fn in AJANLAR:
        if a == aid:
            try:
                return fn(p, k, ctx)
            except Exception as e:   # bir ajanın hatası diğerlerini durdurmasın
                r = rapor(aid, ad)
                bulgu(r, "hata", f"Ajan çalışırken hata: {type(e).__name__}: {e}")
                r["ozet"] = "Hata."
                return r
    raise KeyError(aid)


__all__ = ["AJANLAR", "calistir", "numarali_satirlar"]
