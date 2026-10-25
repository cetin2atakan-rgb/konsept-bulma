"""Yazı gerektiren adımlar için yapay zekâ bağlantısı.

  kapali : hiçbir çağrı yapılmaz; ajanlar sadece kontrol ve otomatik düzeltme yapar.
  ollama : bilgisayarda çalışan yerel model (ücretsiz). https://ollama.com
  claude : Claude API (pip install anthropic, ANTHROPIC_API_KEY ortam değişkeni).

Her çağrı tek ve odaklı: bir skill'in talimatı + kanal kuralları + ilgili dosya parçası.
Sohbet geçmişi yok, bu yüzden her video için harcanan token küçük kalır.
"""
import json
import re
import urllib.request

from ayarlar import ayarlar


class YapayZekaYok(Exception):
    pass


def acik():
    return ayarlar()["yapay_zeka"] in ("ollama", "claude")


def durum():
    a = ayarlar()
    mod = a["yapay_zeka"]
    if mod == "ollama":
        return f"Ollama · {a['ollama_model']}"
    if mod == "claude":
        return f"Claude · {a['claude_model']}"
    return "Kapalı"


def _ollama(system, user):
    a = ayarlar()
    body = json.dumps({
        "model": a["ollama_model"], "stream": False, "format": "json",
        "options": {"temperature": 0.4, "num_ctx": 16384},
        "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}],
    }).encode()
    req = urllib.request.Request(a["ollama_adres"].rstrip("/") + "/api/chat", data=body,
                                 headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=600) as r:
            return json.loads(r.read())["message"]["content"]
    except OSError as e:
        raise YapayZekaYok(f"Ollama'ya ulaşılamadı ({a['ollama_adres']}). Ollama açık mı? {e}")


_claude_istemci = None


def _claude(system, user):
    global _claude_istemci
    a = ayarlar()
    try:
        import anthropic
    except ImportError:
        raise YapayZekaYok("Claude için 'pip install anthropic' gerekli.")
    if _claude_istemci is None:
        _claude_istemci = anthropic.Anthropic()
    model = a["claude_model"]
    kw = dict(model=model, max_tokens=16000, system=system,
              messages=[{"role": "user", "content": user}],
              cache_control={"type": "ephemeral"},
              output_config={"effort": a["claude_effort"]})
    # Güvenlik sınıflandırıcısı reddederse istek sunucu tarafında başka modelle yeniden denenir.
    if model.startswith(("claude-opus-5", "claude-fable-5", "claude-sonnet-5-5")):
        kw["betas"] = ["server-side-fallback-2026-07-01"]
        kw["extra_body"] = {"fallbacks": "default"}
        create = _claude_istemci.beta.messages.create
    else:
        create = _claude_istemci.messages.create
    try:
        r = create(**kw)
    except anthropic.AuthenticationError:
        raise YapayZekaYok("Claude API anahtarı geçersiz. ANTHROPIC_API_KEY ortam değişkenini kontrol et.")
    except anthropic.RateLimitError:
        raise YapayZekaYok("Claude API hız sınırı. Biraz bekleyip tekrar dene.")
    except anthropic.APIStatusError as e:
        raise YapayZekaYok(f"Claude API hatası ({e.status_code}): {e.message}")
    except anthropic.APIConnectionError:
        raise YapayZekaYok("Claude API'ye bağlanılamadı. İnternet bağlantısını kontrol et.")
    if r.stop_reason == "refusal":
        raise YapayZekaYok("Claude bu isteği reddetti.")
    return "".join(b.text for b in r.content if b.type == "text")


def sor(system, user):
    """JSON döndürmesi istenen tek çağrı. Ayrıştırılmış dict/list döner."""
    mod = ayarlar()["yapay_zeka"]
    if mod == "ollama":
        cevap = _ollama(system, user)
    elif mod == "claude":
        cevap = _claude(system, user)
    else:
        raise YapayZekaYok("Yapay zekâ kapalı.")
    return json_ayikla(cevap)


def json_ayikla(metin):
    metin = metin.strip()
    m = re.search(r"```(?:json)?\s*(.*?)```", metin, re.S)
    if m:
        metin = m.group(1).strip()
    try:
        return json.loads(metin)
    except ValueError:
        pass
    for ac, kapa in (("{", "}"), ("[", "]")):
        i, j = metin.find(ac), metin.rfind(kapa)
        if i >= 0 and j > i:
            try:
                return json.loads(metin[i:j + 1])
            except ValueError:
                continue
    raise YapayZekaYok("Yapay zekâ geçerli JSON döndürmedi.")
