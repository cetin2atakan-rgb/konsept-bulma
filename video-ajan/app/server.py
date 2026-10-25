"""Video Ajan: yerel sunucu. Çalıştır: python -X utf8 app/server.py  → http://127.0.0.1:8765

Sadece bu bilgisayardan erişilir (127.0.0.1). İnternete yalnızca ayarlardan Claude seçilirse çıkar.
"""
import io
import json
import re
import shutil
import sys
import threading
import webbrowser
import zipfile
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

sys.path.insert(0, str(Path(__file__).resolve().parent))

import ajanlar  # noqa: E402
import llm  # noqa: E402
from ayarlar import CIKTI, DURUM, GELEN, ayar_kaydet, ayarlar, kanal, kanallar  # noqa: E402
from paket import METIN_UZANTI, Paket  # noqa: E402

WEB = Path(__file__).resolve().parent / "web"
KILIT = threading.Lock()
SIRA = [a[0] for a in ajanlar.AJANLAR]


def guvenli_ad(ad):
    ad = re.sub(r'[\\/:*?"<>|]+', " ", str(ad)).strip().strip(".")
    return ad[:120] or "paket"


def paket_yolu(ad):
    p = (GELEN / guvenli_ad(ad)).resolve()
    if GELEN.resolve() not in p.parents:
        raise ValueError("geçersiz paket adı")
    return p


def durum_oku(ad):
    f = DURUM / f"{guvenli_ad(ad)}.json"
    if f.exists():
        return json.loads(f.read_text(encoding="utf-8"))
    return {"kanal": "", "raporlar": {}, "kararlar": {}}


def durum_yaz(ad, d):
    DURUM.mkdir(parents=True, exist_ok=True)
    (DURUM / f"{guvenli_ad(ad)}.json").write_text(json.dumps(d, ensure_ascii=False, indent=1), encoding="utf-8")


def kabul_mu(d, duz):
    return d["kararlar"].get(duz["id"], duz["otomatik"])


def calisma_kopyasi(ad, d, kadar=None):
    """Orijinal paket + (kadar'dan önceki ajanların) kabul edilen düzenlemeleri."""
    p = Paket(paket_yolu(ad))
    cakisma = []
    for aid in SIRA:
        if kadar and aid == kadar:
            break
        r = d["raporlar"].get(aid)
        if not r:
            continue
        for duz in r["duzeltmeler"]:
            if kabul_mu(d, duz) and not p.uygula(duz):
                cakisma.append(duz["id"])
    return p, cakisma


def kanal_paketleri(kanal_adi):
    out = []
    if not GELEN.exists():
        return out
    for k in sorted(GELEN.iterdir()):
        if k.is_dir() and durum_oku(k.name).get("kanal") == kanal_adi:
            d = durum_oku(k.name)
            p, _ = calisma_kopyasi(k.name, d)
            out.append(p)
    return out


def paket_listesi():
    out = []
    if GELEN.exists():
        for k in sorted(GELEN.iterdir(), key=lambda x: x.stat().st_mtime, reverse=True):
            if k.is_dir():
                d = durum_oku(k.name)
                p = Paket(k)
                o = p.ozet()
                o["kanal"] = d.get("kanal", "")
                o["calisan"] = len(d["raporlar"])
                o["cikti"] = (CIKTI / k.name).exists()
                out.append(o)
    return out


def son_hali(ad):
    d = durum_oku(ad)
    p, cakisma = calisma_kopyasi(ad, d)
    hedef = CIKTI / guvenli_ad(ad)
    if hedef.exists():
        shutil.rmtree(hedef)
    hedef.mkdir(parents=True)
    for rel, metin in p.dosyalar.items():
        f = hedef / rel
        f.parent.mkdir(parents=True, exist_ok=True)
        f.write_text(metin, encoding="utf-8")
    for rel, metin in p.yeni.items():
        (hedef / rel).write_text(metin, encoding="utf-8")
    # metin dışı dosyalar (avatar klipleri vb.) olduğu gibi kopyalanır
    for f in paket_yolu(ad).rglob("*"):
        if f.is_file() and f.suffix.lower() not in METIN_UZANTI:
            t = hedef / f.relative_to(paket_yolu(ad))
            t.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(f, t)
    rapor = rapor_md(ad, d, cakisma)
    (hedef / "AJAN_RAPORU.md").write_text(rapor, encoding="utf-8")
    return {"klasor": str(hedef), "dosyalar": sorted(list(p.dosyalar) + list(p.yeni) + ["AJAN_RAPORU.md"]),
            "cakisma": cakisma}


def rapor_md(ad, d, cakisma):
    s = [f"# Ajan raporu: {ad}", f"Kanal: {d.get('kanal') or '-'} · Yapay zekâ: {llm.durum()}", ""]
    for aid in SIRA:
        r = d["raporlar"].get(aid)
        if not r:
            continue
        s.append(f"## {r['ad']} · {r['durum']}")
        s.append(r["ozet"])
        for b in r["bulgular"]:
            s.append(f"- [{b['seviye']}] " + (f"satır {b['satir']}: " if b.get("satir") else "") + b["mesaj"])
        kabul = [x for x in r["duzeltmeler"] if kabul_mu(d, x)]
        red = [x for x in r["duzeltmeler"] if not kabul_mu(d, x)]
        if kabul:
            s.append(f"\nUygulanan düzeltmeler ({len(kabul)}):")
            s += [f"- {x['dosya']}" + (f" #{x['anahtar']}" if x.get("anahtar") else "") + f": {x['neden']}" for x in kabul]
        if red:
            s.append(f"\nReddedilen / uygulanmayan ({len(red)}):")
            s += [f"- {x['dosya']}" + (f" #{x['anahtar']}" if x.get("anahtar") else "") + f": {x['neden']}" for x in red]
        s.append("")
    if cakisma:
        s.append("## Uygulanamayanlar\nBu düzeltmeler önceki bir düzeltmeyle aynı yeri değiştirdiği için atlandı: "
                 + ", ".join(cakisma))
    s.append("\nYayınla ya da değiştir: son kararı sen ver.")
    return "\n".join(s) + "\n"


class Isleyici(BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def _json(self, veri, kod=200):
        b = json.dumps(veri, ensure_ascii=False).encode("utf-8")
        self.send_response(kod)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(b)))
        self.end_headers()
        self.wfile.write(b)

    def _govde(self):
        n = int(self.headers.get("Content-Length") or 0)
        return json.loads(self.rfile.read(n) or b"{}")

    def do_GET(self):
        u = urlparse(self.path)
        if u.path in ("/", "/index.html"):
            return self._dosya(WEB / "index.html")
        if u.path.startswith("/static/"):
            f = (WEB / u.path[len("/static/"):]).resolve()
            if WEB.resolve() in f.parents and f.exists():
                return self._dosya(f)
        if u.path == "/api/durum":
            a = ayarlar()
            return self._json({
                "yz": llm.durum(), "yz_mod": a["yapay_zeka"],
                "ayarlar": {k: a[k] for k in ("yapay_zeka", "ollama_adres", "ollama_model", "claude_model", "claude_effort")},
                "kanallar": list(kanallar().keys()), "paketler": paket_listesi(),
                "ajanlar": [{"id": i, "ad": n, "aciklama": t} for i, n, t, _ in ajanlar.AJANLAR],
            })
        if u.path == "/api/zip":
            ad = parse_qs(u.query).get("ad", [""])[0]
            hedef = CIKTI / guvenli_ad(ad)
            if not hedef.exists():
                return self._json({"hata": "önce son hali oluştur"}, 404)
            buf = io.BytesIO()
            with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as z:
                for f in hedef.rglob("*"):
                    if f.is_file():
                        z.write(f, f.relative_to(hedef.parent))
            b = buf.getvalue()
            self.send_response(200)
            self.send_header("Content-Type", "application/zip")
            self.send_header("Content-Disposition", "attachment; filename*=UTF-8''" +
                             __import__("urllib.parse").parse.quote(guvenli_ad(ad) + ".zip"))
            self.send_header("Content-Length", str(len(b)))
            self.end_headers()
            self.wfile.write(b)
            return
        self.send_error(404)

    def _dosya(self, f):
        tur = {".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml"}
        b = f.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", tur.get(f.suffix, "application/octet-stream") + "; charset=utf-8")
        self.send_header("Content-Length", str(len(b)))
        self.end_headers()
        self.wfile.write(b)

    def do_POST(self):
        # Başka bir web sitesinin tarayıcı üzerinden bu yerel sunucuya istek atmasını engelle.
        origin = self.headers.get("Origin")
        if origin and urlparse(origin).hostname not in ("127.0.0.1", "localhost"):
            return self._json({"hata": "izin yok"}, 403)
        try:
            g = self._govde()
            yol = urlparse(self.path).path
            with KILIT if yol in ("/api/yukle", "/api/klasor", "/api/sil", "/api/karar", "/api/kanal") else _bos():
                return self._json(self._post(yol, g))
        except (ValueError, KeyError, FileNotFoundError) as e:
            return self._json({"hata": str(e)}, 400)

    def _post(self, yol, g):
        if yol == "/api/yukle":
            ad = guvenli_ad(g["ad"])
            hedef = paket_yolu(ad)
            hedef.mkdir(parents=True, exist_ok=True)
            for f in g["dosyalar"]:
                parca = [guvenli_ad(x) for x in Path(f["yol"]).parts if x not in ("", ".", "..")]
                if len(parca) > 1 and parca[0] == ad:
                    parca = parca[1:]
                t = hedef.joinpath(*parca)
                t.parent.mkdir(parents=True, exist_ok=True)
                t.write_text(f["icerik"], encoding="utf-8")
            d = durum_oku(ad)
            if g.get("kanal"):
                d["kanal"] = g["kanal"]
            d["raporlar"], d["kararlar"] = {}, {}
            durum_yaz(ad, d)
            return {"ad": ad}
        if yol == "/api/klasor":
            kaynak = Path(g["yol"].strip().strip('"'))
            if not kaynak.is_dir():
                raise ValueError(f"Klasör bulunamadı: {kaynak}")
            ad = guvenli_ad(kaynak.name)
            hedef = paket_yolu(ad)
            if hedef.exists():
                shutil.rmtree(hedef)
            shutil.copytree(kaynak, hedef)
            d = durum_oku(ad)
            if g.get("kanal"):
                d["kanal"] = g["kanal"]
            d["raporlar"], d["kararlar"] = {}, {}
            durum_yaz(ad, d)
            return {"ad": ad}
        if yol == "/api/sil":
            ad = guvenli_ad(g["ad"])
            for p in (paket_yolu(ad), CIKTI / ad):
                if p.exists():
                    shutil.rmtree(p)
            f = DURUM / f"{ad}.json"
            if f.exists():
                f.unlink()
            return {"ok": True}
        if yol == "/api/paket":
            ad = g["ad"]
            d = durum_oku(ad)
            p, cakisma = calisma_kopyasi(ad, d)
            return {"ozet": p.ozet(), "kanal": d.get("kanal", ""), "raporlar": d["raporlar"],
                    "kararlar": d["kararlar"], "cakisma": cakisma,
                    "dosyalar": {**p.dosyalar, **{f"(yeni) {k}": v for k, v in p.yeni.items()}},
                    "cikti": str(CIKTI / guvenli_ad(ad)) if (CIKTI / guvenli_ad(ad)).exists() else ""}
        if yol == "/api/kanal":
            d = durum_oku(g["ad"])
            d["kanal"] = g["kanal"]
            durum_yaz(g["ad"], d)
            return {"ok": True}
        if yol == "/api/calistir":
            ad, aid = g["ad"], g["ajan"]
            d = durum_oku(ad)
            if not d.get("kanal"):
                raise ValueError("Önce kanal seç.")
            k = kanal(d["kanal"])
            p, _ = calisma_kopyasi(ad, d, kadar=aid)
            ctx = {}
            if aid in ("yt-audit", "yt-plan"):
                ctx["kanal_paketleri"] = kanal_paketleri(d["kanal"])
            r = ajanlar.calistir(aid, p, k, ctx)
            with KILIT:
                d = durum_oku(ad)
                eski = d["raporlar"].get(aid)
                if eski:
                    for x in eski["duzeltmeler"]:
                        d["kararlar"].pop(x["id"], None)
                d["raporlar"][aid] = r
                durum_yaz(ad, d)
            return r
        if yol == "/api/karar":
            d = durum_oku(g["ad"])
            for i in g["idler"] if "idler" in g else [g["id"]]:
                d["kararlar"][i] = bool(g["kabul"])
            durum_yaz(g["ad"], d)
            return {"ok": True}
        if yol == "/api/son":
            return son_hali(g["ad"])
        if yol == "/api/ayar":
            ayar_kaydet(g)
            return {"ok": True, "yz": llm.durum()}
        raise KeyError(yol)


class _bos:
    def __enter__(self):
        return self

    def __exit__(self, *a):
        return False


def main():
    for d in (GELEN, CIKTI, DURUM):
        d.mkdir(parents=True, exist_ok=True)
    port = int(ayarlar()["port"])
    srv = ThreadingHTTPServer(("127.0.0.1", port), Isleyici)
    url = f"http://127.0.0.1:{port}"
    print(f"Video Ajan çalışıyor: {url}\nKapatmak için bu pencereyi kapat ya da Ctrl+C.")
    if "--tarayici-yok" not in sys.argv:
        threading.Timer(0.8, lambda: webbrowser.open(url)).start()
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
