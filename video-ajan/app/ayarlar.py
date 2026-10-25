"""ayarlar.json ve kanallar.json okuma/yazma."""
import json
import re
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent          # video-ajan/
REPO = KOK.parent                                      # repo kökü
CALISMA = KOK / "calisma"
GELEN = CALISMA / "gelen"
CIKTI = CALISMA / "cikti"
DURUM = CALISMA / "durum"

VARSAYILAN = {
    "yapay_zeka": "kapali",            # kapali | ollama | claude
    "ollama_adres": "http://localhost:11434",
    "ollama_model": "qwen2.5:14b",
    "claude_model": "claude-opus-5-5",
    "claude_effort": "medium",
    "skills_klasoru": str(REPO / ".claude" / "skills"),
    "port": 8765,
}


def ayarlar():
    p = KOK / "ayarlar.json"
    d = dict(VARSAYILAN)
    if p.exists():
        d.update(json.loads(p.read_text(encoding="utf-8")))
    sk = Path(d["skills_klasoru"])
    if not sk.is_absolute():
        d["skills_klasoru"] = str((KOK / sk).resolve())
    return d


def ayar_kaydet(yeni):
    p = KOK / "ayarlar.json"
    d = json.loads(p.read_text(encoding="utf-8")) if p.exists() else {}
    for k in ("yapay_zeka", "ollama_adres", "ollama_model", "claude_model", "claude_effort"):
        if k in yeni:
            d[k] = yeni[k]
    p.write_text(json.dumps(d, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def kanallar():
    p = KOK / "kanallar.json"
    return json.loads(p.read_text(encoding="utf-8")) if p.exists() else {}


def kanal(ad):
    k = kanallar().get(ad) or {}
    d = {
        "dil": "en", "wpm": 150, "satir_min": 14, "satir_max": 26, "hedef_dk": [8, 15],
        "stil_cumlesi": "", "uyari_satiri": "", "bolum_karti": False, "karakterler": [],
        "ses_dosyasi": "", "yasak_kelimeler": [], "haftalik_saat": 10, "en_iyi_gun": "",
        "gorsel_sn": 51, "rakam_yaziya": True,
    }
    d.update(k)
    d["ad"] = ad
    ses = d.get("ses_dosyasi")
    d["ses"] = ""
    if ses:
        sp = (KOK / ses) if not Path(ses).is_absolute() else Path(ses)
        if sp.exists():
            d["ses"] = sp.read_text(encoding="utf-8")
    return d


def kanal_tahmin(klasor, ipucu=""):
    """Paketin hangi kanala ait olduğunu içeriğinden tahmin eder. (kanal adı | "", neden) döner."""
    from paket import Paket, sade
    p = Paket(klasor)
    yer = sade(" ".join([ipucu, p.ad]))
    prompts = p.metin("prompts")
    assets = p.metin("assets")
    karakter = p.metin("karakterler") + prompts
    puanlar = []
    for ad in kanallar():
        k = kanal(ad)
        puan, neden = 0, []
        if sade(ad) in yer or sade(ad).replace(",", "") in yer.replace(",", ""):
            puan += 10
            neden.append("klasör adı")
        if k["stil_cumlesi"] and k["stil_cumlesi"] in prompts:
            puan += 6
            neden.append("stil cümlesi")
        if k["uyari_satiri"] and k["uyari_satiri"][:60] in assets:
            puan += 5
            neden.append("uyarı satırı")
        if any(re.search(r"\b" + re.escape(c) + r"\b", karakter) for c in k["karakterler"]):
            puan += 3
            neden.append("karakter")
        puanlar.append((puan, ad, neden))
    puanlar.sort(key=lambda x: -x[0])
    if not puanlar or puanlar[0][0] == 0:
        return "", "hiçbir kanal işareti bulunamadı"
    if len(puanlar) > 1 and puanlar[1][0] == puanlar[0][0]:
        return "", f"{puanlar[0][1]} ile {puanlar[1][1]} arasında karar verilemedi"
    return puanlar[0][1], ", ".join(puanlar[0][2])
