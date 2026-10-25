"""Rakamları Kokoro'nun rahat okuyacağı İngilizce yazıya çevirir.

    1985   -> nineteen eighty-five      (yıl)
    2016   -> twenty sixteen            (yıl)
    2005   -> two thousand five         (yıl)
    40%    -> forty percent
    4.2    -> four point two
    $5     -> five dollars
    10,000 -> ten thousand
    3-5    -> three to five
    1st    -> first
"""
import re

ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
        "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen",
        "nineteen"]
TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]
SCALES = [(10 ** 12, "trillion"), (10 ** 9, "billion"), (10 ** 6, "million"), (1000, "thousand")]
ORD = {"one": "first", "two": "second", "three": "third", "five": "fifth", "eight": "eighth",
       "nine": "ninth", "twelve": "twelfth"}


def cardinal(n):
    n = int(n)
    if n < 0:
        return "minus " + cardinal(-n)
    if n < 20:
        return ONES[n]
    if n < 100:
        t, o = divmod(n, 10)
        return TENS[t] + ("-" + ONES[o] if o else "")
    if n < 1000:
        h, r = divmod(n, 100)
        return ONES[h] + " hundred" + (" " + cardinal(r) if r else "")
    for size, name in SCALES:
        if n >= size:
            q, r = divmod(n, size)
            return cardinal(q) + " " + name + (" " + cardinal(r) if r else "")
    return str(n)


def year(n):
    n = int(n)
    if 2000 <= n <= 2009:
        return cardinal(n)
    hi, lo = divmod(n, 100)
    if lo == 0:
        return cardinal(hi) + " hundred"
    if lo < 10:
        return cardinal(hi) + " oh " + cardinal(lo)
    return cardinal(hi) + " " + cardinal(lo)


def ordinal(n):
    words = cardinal(n)
    head, sep, last = words.rpartition("-") if "-" in words.split(" ")[-1] else words.rpartition(" ")
    if last in ORD:
        last = ORD[last]
    elif last.endswith("y"):
        last = last[:-1] + "ieth"
    else:
        last += "th"
    return head + sep + last


def decimal(s):
    whole, _, frac = s.partition(".")
    out = cardinal(int(whole or 0))
    if frac:
        out += " point " + " ".join(ONES[int(d)] for d in frac)
    return out


def _num(s):
    s = s.replace(",", "")
    return decimal(s) if "." in s else cardinal(int(s))


NUM = r"\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?"


def rakamlari_yaziya(metin):
    """Metindeki rakamları yazıya çevirir. (yeni_metin, değişti_mi) döner."""
    t = metin

    def money(m):
        val = m.group(1)
        big = (m.group(2) or "").lower()
        words = _num(val)
        unit = {"k": " thousand", "m": " million", "b": " billion"}.get(big[:1], "")
        if big in ("million", "billion", "thousand"):
            unit = " " + big
        return words + unit + " dollars"

    t = re.sub(r"\$\s?(" + NUM + r")\s?(k|m|b|million|billion|thousand)?\b", money, t, flags=re.I)
    t = re.sub(r"(" + NUM + r")\s?%", lambda m: _num(m.group(1)) + " percent", t)
    t = re.sub(r"\b(\d+)(st|nd|rd|th)\b", lambda m: ordinal(int(m.group(1))), t)

    def oku(s):
        if re.fullmatch(r"1[1-9]\d\d|20\d\d", s):
            return year(s)
        return _num(s)

    t = re.sub(r"\b(" + NUM + r")\s?[-–]\s?(" + NUM + r")\b",
               lambda m: oku(m.group(1)) + " to " + oku(m.group(2)), t)

    def plain(m):
        return oku(m.group(0))

    t = re.sub(NUM, plain, t)
    return t, t != metin
