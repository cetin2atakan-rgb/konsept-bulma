"""11 skill'in kendi Python araçlarına köprü.

Araçlar repodaki .claude/skills/yt-*/ klasörlerinden olduğu gibi kullanılır; burada kopyaları yok.
Saf fonksiyonlar (title.check, hookscore.score) içeri aktarılır; yalnızca main() olanlar
(chapters, deadair, retention, swipe) ayrı süreçte --json ile çalıştırılır.
"""
import importlib.util
import json
import subprocess
import sys
from pathlib import Path

from ayarlar import ayarlar

_cache = {}


def skills_klasoru():
    return Path(ayarlar()["skills_klasoru"])


def skill_metni(ad):
    """SKILL.md içeriği (ön bilgi bloğu hariç). Yapay zekâya talimat olarak verilir."""
    p = skills_klasoru() / ad / "SKILL.md"
    if not p.exists():
        return ""
    t = p.read_text(encoding="utf-8")
    if t.startswith("---"):
        t = t.split("---", 2)[2]
    # 'The gate' bölümü sohbet içindir; uygulamada onay arayüzde veriliyor.
    return t.split("## The gate")[0].strip()


def _modul(skill, dosya):
    key = (skill, dosya)
    if key not in _cache:
        p = skills_klasoru() / skill / dosya
        spec = importlib.util.spec_from_file_location(f"{skill}_{dosya[:-3]}", p)
        m = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(m)
        _cache[key] = m
    return _cache[key]


def baslik_kontrol(baslik, thumb=None):
    return _modul("yt-package", "title.py").check(baslik, thumb)


def hook_puani(metin):
    m = _modul("yt-script", "hookscore.py")
    parts, verdict, name, hits = m.score(metin)
    zayif = min(parts, key=parts.get)
    return {"hook": metin, "ozellikler": parts, "puan": verdict, "bant": m.band(verdict),
            "formul": name, "zayif": zayif, "oneri": m.FIX[zayif]}


def hook_formulleri():
    p = skills_klasoru() / "yt-script" / "hooks.json"
    return json.loads(p.read_text(encoding="utf-8"))


def _calistir(skill, dosya, args):
    p = skills_klasoru() / skill / dosya
    r = subprocess.run([sys.executable, "-X", "utf8", str(p), *args, "--json"],
                       capture_output=True, text=True, encoding="utf-8", timeout=120)
    try:
        return json.loads(r.stdout)
    except ValueError:
        raise RuntimeError((r.stdout + r.stderr).strip()[:600] or f"{dosya} çıktı vermedi")


def deadair(transkript_yolu, esik=None):
    args = [str(transkript_yolu)] + (["--floor", str(esik)] if esik else [])
    return _calistir("yt-edit", "deadair.py", args)


def chapters(transkript_yolu, hedef=8):
    return _calistir("yt-chapters", "chapters.py", [str(transkript_yolu), "--target", str(hedef)])


def retention(csv_yolu, transkript_yolu=None, sure=None):
    args = [str(csv_yolu)]
    if transkript_yolu:
        args += ["--transcript", str(transkript_yolu)]
    if sure:
        args += ["--duration", str(sure)]
    return _calistir("yt-retention", "retention.py", args)


def swipe(json_yolu, esik=1.5):
    return _calistir("yt-viral", "swipe.py", [str(json_yolu), "--min", str(esik)])
