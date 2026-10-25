"""Video paketi: bir klasör = bir video. Dosyaları tanır, okur, düzenlemeleri uygular."""
import copy
import json
import re
from pathlib import Path

TR = str.maketrans("ıİşŞğĞüÜöÖçÇ", "iIsSgGuUoOcC")
METIN_UZANTI = {".txt", ".md", ".srt", ".vtt", ".json", ".csv"}


def sade(ad):
    return ad.translate(TR).casefold()


def dosya_turu(ad):
    """Dosya adındaki anahtar kelimeye göre türü bulur (Video Studio kuralı)."""
    s = sade(Path(ad).name)
    ext = Path(ad).suffix.lower()
    if "kaynak_listesi" in s or "kaynak listesi" in s:
        return "kaynak_listesi"
    if "siralama" in s:
        return "siralama"
    if "prompt" in s:
        return "prompts"
    if "asset" in s:
        return "assets"
    if "karakter" in s:
        return "karakterler"
    if "kaynaklar" in s:
        return "kaynaklar"
    if "avatar" in s:
        return "avatar"
    if ext in (".srt", ".vtt"):
        return "transkript"
    if ext == ".csv" and ("retention" in s or "izleyici" in s or "tutma" in s or "audience" in s):
        return "retention"
    if "yorum" in s or "comment" in s:
        return "yorumlar"
    if ext == ".json" and ("viral" in s or "swipe" in s or "collected" in s or "rakip" in s):
        return "viral"
    if ext == ".json" and ("whisper" in s or "transcript" in s or "transkript" in s):
        return "transkript"
    if ext == ".csv":
        return "retention"
    return "diger"


def oku(yol):
    b = Path(yol).read_bytes()
    for enc in ("utf-8-sig", "cp1254", "latin-1"):
        try:
            return b.decode(enc)
        except UnicodeDecodeError:
            continue
    return b.decode("utf-8", "replace")


SATIR = re.compile(r"^\s*(\d+)\s*[.)]\s*(.*)$")


def numarali_satirlar(metin):
    """'N. metin' satırlarını [(N, metin)] olarak döndürür."""
    out = []
    for line in metin.splitlines():
        m = SATIR.match(line)
        if m and m.group(2).strip():
            out.append([int(m.group(1)), m.group(2).strip()])
    return out


def numarali_yaz(satirlar):
    return "\n".join(f"{n}. {t}" for n, t in satirlar) + "\n"


def bolumler(metin):
    """Assets.txt'yi '## Başlık' bölümlerine ayırır. Sıra korunur."""
    parts, cur_name, cur = [], "_bas", []
    for line in metin.splitlines():
        m = re.match(r"^##\s+(.+?)\s*$", line)
        if m:
            parts.append([cur_name, "\n".join(cur)])
            cur_name, cur = m.group(1), []
        else:
            cur.append(line)
    parts.append([cur_name, "\n".join(cur)])
    return parts


def bolum_bul(parts, anahtar):
    k = sade(anahtar)
    for i, (ad, _) in enumerate(parts):
        if sade(ad).startswith(k):
            return i
    return -1


def bolumleri_yaz(parts):
    out = []
    for ad, govde in parts:
        if ad == "_bas":
            if govde.strip():
                out.append(govde.rstrip("\n"))
        else:
            out.append(f"## {ad}\n{govde.strip()}\n")
    return "\n\n".join(x.rstrip("\n") for x in out) + "\n"


class Paket:
    """Orijinal dosyalar + kabul edilen düzenlemeler = çalışma kopyası."""

    def __init__(self, klasor):
        self.klasor = Path(klasor)
        self.ad = self.klasor.name
        self.dosyalar = {}   # göreli yol -> metin
        self.turler = {}     # göreli yol -> tür
        for p in sorted(self.klasor.rglob("*")):
            if p.is_file() and p.suffix.lower() in METIN_UZANTI:
                rel = p.relative_to(self.klasor).as_posix()
                self.dosyalar[rel] = oku(p)
                self.turler[rel] = dosya_turu(rel)
        self.yeni = {}       # ajanların ürettiği yeni dosyalar: ad -> metin

    def yol(self, tur):
        for rel, t in self.turler.items():
            if t == tur:
                return rel
        return None

    def metin(self, tur):
        y = self.yol(tur)
        return self.dosyalar.get(y, "") if y else ""

    def siralama(self):
        return numarali_satirlar(self.metin("siralama"))

    def prompts(self):
        return numarali_satirlar(self.metin("prompts"))

    def assets(self):
        return bolumler(self.metin("assets"))

    def assets_bolum(self, anahtar):
        parts = self.assets()
        i = bolum_bul(parts, anahtar)
        return parts[i][1].strip() if i >= 0 else None

    def baslik(self):
        govde = self.assets_bolum("TITLE")
        if not govde:
            return ""
        for line in govde.splitlines():
            if line.strip():
                return line.strip()
        return ""

    def kopya(self):
        k = copy.copy(self)
        k.dosyalar = dict(self.dosyalar)
        k.yeni = dict(self.yeni)
        return k

    # --- düzenleme uygulama ---------------------------------------------------------------
    def uygula(self, d):
        """Bir düzenlemeyi çalışma kopyasına uygular. Eski metin tutmazsa False döner."""
        tur, anahtar, eski, yeni = d["tur"], d.get("anahtar"), d.get("eski"), d["yeni"]
        if tur == "yeni_dosya":
            self.yeni[d["dosya"]] = yeni
            return True
        rel = self.yol(d["dosya"])
        if rel is None:
            if tur == "dosya":
                rel = {"bolumler": "bolumler.txt"}.get(d["dosya"], d["dosya"] + ".txt")
                self.dosyalar[rel] = ""
                self.turler[rel] = d["dosya"]
            else:
                return False
        metin = self.dosyalar[rel]
        if tur == "dosya":
            if eski is not None and metin != eski:
                return False
            self.dosyalar[rel] = yeni
            return True
        if tur == "satir":
            satirlar = numarali_satirlar(metin)
            for s in satirlar:
                if s[0] == int(anahtar):
                    if eski is not None and s[1] != eski:
                        return False
                    s[1] = yeni
                    self.dosyalar[rel] = numarali_yaz(satirlar)
                    return True
            return False
        if tur == "bolum":
            parts = bolumler(metin)
            i = bolum_bul(parts, anahtar)
            if i < 0:
                parts.append([anahtar, yeni])
            else:
                if eski is not None and parts[i][1].strip() != eski.strip():
                    return False
                parts[i][1] = yeni
            self.dosyalar[rel] = bolumleri_yaz(parts)
            return True
        return False

    def ozet(self):
        return {
            "ad": self.ad,
            "dosyalar": [{"yol": r, "tur": self.turler[r], "satir": len(self.dosyalar[r].splitlines())}
                         for r in self.dosyalar],
            "baslik": self.baslik(),
            "satir_sayisi": len(self.siralama()),
        }


def json_oku(metin):
    try:
        return json.loads(metin)
    except ValueError:
        return None
