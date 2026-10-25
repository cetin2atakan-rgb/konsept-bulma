"""ayarlar.json ve kanallar.json okuma/yazma."""
import json
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
