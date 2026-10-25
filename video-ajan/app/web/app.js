"use strict";
const $ = (s, el = document) => el.querySelector(s);
const durum = { genel: null, secili: null, paket: null, acik: new Set(), calisiyor: new Set(), sekme: "ajanlar" };

async function api(yol, govde) {
  const r = await fetch(yol, govde === undefined ? {} : {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(govde),
  });
  const j = await r.json();
  if (!r.ok || j.hata) throw new Error(j.hata || r.statusText);
  return j;
}

function bildir(mesaj, hata = false) {
  const b = $("#bildirim");
  b.textContent = mesaj;
  b.className = "bildirim" + (hata ? " hata" : "");
  b.hidden = false;
  clearTimeout(bildir.t);
  bildir.t = setTimeout(() => (b.hidden = true), hata ? 6000 : 2500);
}

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// ---- kelime düzeyinde fark ------------------------------------------------------------------
function fark(a, b) {
  a = String(a ?? ""); b = String(b ?? "");
  if (a.length + b.length > 6000) return satirFark(a, b);
  const A = a.split(/(\s+)/), B = b.split(/(\s+)/);
  const n = A.length, m = B.length;
  const L = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--)
    L[i][j] = A[i] === B[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  let i = 0, j = 0, out = "";
  while (i < n && j < m) {
    if (A[i] === B[j]) { out += esc(A[i]); i++; j++; }
    else if (L[i + 1][j] >= L[i][j + 1]) { out += `<del>${esc(A[i])}</del>`; i++; }
    else { out += `<ins>${esc(B[j])}</ins>`; j++; }
  }
  while (i < n) out += `<del>${esc(A[i++])}</del>`;
  while (j < m) out += `<ins>${esc(B[j++])}</ins>`;
  return out;
}
function satirFark(a, b) {
  const A = a.split("\n"), B = new Set(b.split("\n")), SA = new Set(A);
  const out = [];
  for (const l of A) if (!B.has(l)) out.push(`<del>- ${esc(l)}</del>`);
  for (const l of b.split("\n")) if (!SA.has(l)) out.push(`<ins>+ ${esc(l)}</ins>`);
  return out.slice(0, 80).join("\n") + (out.length > 80 ? `\n… ${out.length - 80} satır daha` : "") || "(değişiklik yok)";
}

// ---- genel durum ----------------------------------------------------------------------------
async function yenile() {
  durum.genel = await api("/api/durum");
  const g = durum.genel;
  const hap = $("#yzDurum");
  hap.textContent = "Yapay zekâ: " + g.yz;
  hap.classList.toggle("acik", g.yz_mod !== "kapali");
  const sec = $("#yeniKanal");
  const onceki = sec.value;
  sec.innerHTML = `<option value="">Kanal seç…</option>` + g.kanallar.map((k) => `<option>${esc(k)}</option>`).join("");
  if (onceki) sec.value = onceki;
  const ul = $("#paketler");
  ul.innerHTML = g.paketler.length ? g.paketler.map((p) => `
    <li data-ad="${esc(p.ad)}" class="${p.ad === durum.secili ? "secili" : ""}">
      <div class="ad">${esc(p.baslik || p.ad)}</div>
      <div class="bilgi">${esc(p.kanal || "kanal yok")} · ${p.satir_sayisi} satır · ${p.calisan}/${g.ajanlar.length} ajan${p.cikti ? " · son hali hazır" : ""}</div>
    </li>`).join("") : `<li class="bos-not">Henüz paket yok.</li>`;
  ul.querySelectorAll("li[data-ad]").forEach((li) => li.onclick = () => sec_paket(li.dataset.ad));
}

async function sec_paket(ad) {
  durum.secili = ad;
  durum.paket = await api("/api/paket", { ad });
  document.querySelectorAll("#paketler li").forEach((li) => li.classList.toggle("secili", li.dataset.ad === ad));
  ciz();
}

// ---- paket ekranı ---------------------------------------------------------------------------
function ciz() {
  const p = durum.paket, g = durum.genel, ana = $("#ana");
  if (!p) return;
  const ozet = p.ozet;
  ana.innerHTML = `
    <div class="baslikkart">
      <h1>${esc(ozet.baslik || ozet.ad)}</h1>
      <div class="meta">${esc(ozet.ad)} · ${ozet.satir_sayisi} satır · ${ozet.dosyalar.length} dosya:
        ${ozet.dosyalar.map((d) => esc(d.yol)).join(", ")}</div>
      <div class="araclar">
        <select id="paketKanal"><option value="">Kanal seç…</option>${g.kanallar.map((k) => `<option ${k === p.kanal ? "selected" : ""}>${esc(k)}</option>`).join("")}</select>
        <button id="hepsi">Tüm ajanları çalıştır</button>
        <span class="bosluk"></span>
        <button id="son" class="ikincil">Son hali oluştur</button>
        <button id="zip" class="ikincil" ${p.cikti ? "" : "disabled"}>ZIP indir</button>
        <button id="sil" class="ikincil" title="Paketi uygulamadan sil">Sil</button>
      </div>
      ${p.cikti ? `<div class="cikti-not">Son hali: ${esc(p.cikti)}</div>` : ""}
      ${p.cakisma.length ? `<div class="cikti-not" style="background:var(--uyari-acik);color:var(--uyari)">Çakışan düzeltmeler atlandı: ${esc(p.cakisma.join(", "))}. İlgili ajanı yeniden çalıştır.</div>` : ""}
    </div>
    <div class="sekmeler">
      <button data-s="ajanlar" class="${durum.sekme === "ajanlar" ? "secili" : ""}">Ajanlar</button>
      <button data-s="dosyalar" class="${durum.sekme === "dosyalar" ? "secili" : ""}">Dosyalar (çalışma kopyası)</button>
    </div>
    <div id="sekmeIcerik"></div>`;
  $("#paketKanal").onchange = async (e) => {
    await api("/api/kanal", { ad: durum.secili, kanal: e.target.value });
    p.kanal = e.target.value; yenile();
  };
  $("#hepsi").onclick = hepsini_calistir;
  $("#son").onclick = son_hali;
  $("#zip").onclick = () => (location.href = "/api/zip?ad=" + encodeURIComponent(durum.secili));
  $("#sil").onclick = async () => {
    if (!confirm(`"${ozet.ad}" paketi uygulamadan silinsin mi? (Kendi bilgisayarındaki orijinal klasöre dokunulmaz.)`)) return;
    await api("/api/sil", { ad: durum.secili });
    durum.secili = null; durum.paket = null;
    $("#ana").innerHTML = `<div class="bos"><h1>Paket silindi</h1></div>`;
    yenile();
  };
  document.querySelectorAll(".sekmeler button").forEach((b) => b.onclick = () => { durum.sekme = b.dataset.s; ciz(); });
  if (durum.sekme === "dosyalar") return ciz_dosyalar();
  ciz_ajanlar();
}

function ciz_ajanlar() {
  const p = durum.paket, kap = $("#sekmeIcerik");
  kap.innerHTML = durum.genel.ajanlar.map((a) => {
    const r = p.raporlar[a.id];
    const cal = durum.calisiyor.has(a.id);
    const roz = cal ? `<span class="rozet calisiyor">çalışıyor…</span>`
      : r ? `<span class="rozet ${r.durum}">${{ tamam: "tamam", uyari: "uyarı", hata: "hata", atlandi: "atlandı" }[r.durum]}</span>`
        : `<span class="rozet">çalışmadı</span>`;
    return `<div class="ajan ${durum.acik.has(a.id) ? "acik" : ""}" data-id="${a.id}">
      <div class="ajan-bas">
        <span class="ad">${esc(a.ad)}</span>${roz}
        <span class="acik">${esc(r ? r.ozet : a.aciklama)}</span>
        <button class="kucuk ikincil calistir" ${cal ? "disabled" : ""}>${r ? "Tekrar" : "Çalıştır"}</button>
      </div>
      <div class="ajan-govde">${r ? rapor_html(r) : `<p class="not">${esc(a.aciklama)}</p>`}</div>
    </div>`;
  }).join("");
  kap.querySelectorAll(".ajan").forEach((el) => {
    const id = el.dataset.id;
    $(".ajan-bas", el).onclick = (e) => {
      if (e.target.closest("button")) return;
      durum.acik.has(id) ? durum.acik.delete(id) : durum.acik.add(id);
      el.classList.toggle("acik");
    };
    $(".calistir", el).onclick = () => tek_calistir(id).then(ciz);
    el.querySelectorAll("input[data-duz]").forEach((cb) => cb.onchange = () => karar([cb.dataset.duz], cb.checked));
    el.querySelectorAll("button[data-hepsi]").forEach((b) => b.onclick = () => {
      const r = durum.paket.raporlar[id];
      karar(r.duzeltmeler.map((d) => d.id), b.dataset.hepsi === "1").then(() => sec_paket(durum.secili));
    });
    el.querySelectorAll("button[data-kopya]").forEach((b) => b.onclick = () => {
      const pre = b.closest(".blok").querySelector("pre");
      navigator.clipboard.writeText(pre.textContent).then(() => bildir("Kopyalandı"));
    });
  });
}

function kabul_mu(d) {
  const k = durum.paket.kararlar;
  return d.id in k ? k[d.id] : d.otomatik;
}

function rapor_html(r) {
  let h = `<div class="ozet">${esc(r.ozet)}</div>`;
  if (r.bulgular.length) {
    h += `<ul class="bulgular">${r.bulgular.map((b) => `<li class="${b.seviye}">${b.satir ? `<span class="satirno">${b.satir}.</span>` : ""}${esc(b.mesaj)}</li>`).join("")}</ul>`;
  }
  if (r.duzeltmeler.length) {
    h += `<h3>Düzeltmeler (${r.duzeltmeler.length}) <button class="kucuk ikincil" data-hepsi="1">hepsini kabul</button><button class="kucuk ikincil" data-hepsi="0">hepsini reddet</button></h3>`;
    h += r.duzeltmeler.map((d) => {
      const yer = d.tur === "yeni_dosya" ? `yeni dosya: ${d.dosya}` : d.tur === "satir" ? `${d.dosya} · satır ${d.anahtar}`
        : d.tur === "bolum" ? `${d.dosya} · ## ${d.anahtar}` : `${d.dosya} · tüm dosya`;
      const f = d.tur === "yeni_dosya" ? esc(d.yeni.length > 1500 ? d.yeni.slice(0, 1500) + "\n…" : d.yeni) : fark(d.eski, d.yeni);
      return `<div class="duzeltme"><label><input type="checkbox" data-duz="${esc(d.id)}" ${kabul_mu(d) ? "checked" : ""}>
        <div><div class="neden">${esc(d.neden)}</div><div class="yer">${esc(yer)}${d.otomatik ? " · otomatik" : " · öneri"}</div></div></label>
        <div class="fark">${f}</div></div>`;
    }).join("");
  }
  if (r.bloklar.length) {
    h += `<h3>Çıktılar</h3>` + r.bloklar.map((b) => `<div class="blok"><div class="blok-bas"><span>${esc(b.baslik)}</span>
      <button class="kucuk ikincil" data-kopya>Kopyala</button></div><pre>${esc(b.metin)}</pre></div>`).join("");
  }
  return h;
}

function ciz_dosyalar() {
  const kap = $("#sekmeIcerik"), dos = durum.paket.dosyalar;
  const adlar = Object.keys(dos);
  kap.innerHTML = `<div class="dosyalar"><select id="dosyaSec">${adlar.map((a) => `<option>${esc(a)}</option>`).join("")}</select>
    <p class="not">Kabul edilen düzeltmeler uygulanmış hali. Orijinal dosyalar değişmez.</p><pre id="dosyaIcerik"></pre></div>`;
  const goster = () => ($("#dosyaIcerik").textContent = dos[$("#dosyaSec").value] || "");
  $("#dosyaSec").onchange = goster;
  goster();
}

// ---- eylemler -------------------------------------------------------------------------------
async function tek_calistir(id) {
  if (!durum.paket.kanal) { bildir("Önce kanal seç.", true); return false; }
  durum.calisiyor.add(id);
  ciz();
  try {
    const r = await api("/api/calistir", { ad: durum.secili, ajan: id });
    durum.paket.raporlar[id] = r;
    if (r.durum !== "atlandi" && (r.bulgular.length || r.duzeltmeler.length)) durum.acik.add(id);
    return true;
  } catch (e) {
    bildir(e.message, true);
    return false;
  } finally {
    durum.calisiyor.delete(id);
    durum.paket = await api("/api/paket", { ad: durum.secili });
  }
}

async function hepsini_calistir() {
  if (!durum.paket.kanal) return bildir("Önce kanal seç.", true);
  for (const a of durum.genel.ajanlar) {
    const ok = await tek_calistir(a.id);
    ciz();
    if (!ok) break;
  }
  yenile();
  bildir("Ajanlar bitti. Düzeltmeleri gözden geçirip 'Son hali oluştur'a bas.");
}

async function karar(idler, kabul) {
  await api("/api/karar", { ad: durum.secili, idler, kabul });
  idler.forEach((i) => (durum.paket.kararlar[i] = kabul));
}

async function son_hali() {
  try {
    const r = await api("/api/son", { ad: durum.secili });
    bildir("Son hali yazıldı: " + r.klasor);
    await sec_paket(durum.secili);
    yenile();
  } catch (e) { bildir(e.message, true); }
}

// ---- yükleme --------------------------------------------------------------------------------
const METIN = /\.(txt|md|srt|vtt|json|csv)$/i;

async function yukle(dosyalar, ad) {
  const kanal = $("#yeniKanal").value;
  if (!kanal) return bildir("Önce kanal seç.", true);
  const liste = [];
  for (const { yol, file } of dosyalar) if (METIN.test(yol)) liste.push({ yol, icerik: await file.text() });
  if (!liste.length) return bildir("Klasörde .txt/.md/.srt/.csv/.json dosyası yok.", true);
  try {
    const r = await api("/api/yukle", { ad, kanal, dosyalar: liste });
    await yenile();
    await sec_paket(r.ad);
    bildir(`${liste.length} dosya eklendi.`);
  } catch (e) { bildir(e.message, true); }
}

function girdiOku(entry, yol = "") {
  return new Promise((coz) => {
    if (entry.isFile) entry.file((f) => coz([{ yol: yol + f.name, file: f }]), () => coz([]));
    else if (entry.isDirectory) {
      const r = entry.createReader(), hepsi = [];
      const oku = () => r.readEntries(async (es) => {
        if (!es.length) { const alt = await Promise.all(hepsi.map((e) => girdiOku(e, yol + entry.name + "/"))); coz(alt.flat()); }
        else { hepsi.push(...es); oku(); }
      }, () => coz([]));
      oku();
    } else coz([]);
  });
}

function kur() {
  const birak = $("#birak"), sec = $("#klasorSec");
  birak.onclick = () => sec.click();
  birak.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") sec.click(); };
  sec.onchange = () => {
    const fs = [...sec.files];
    if (!fs.length) return;
    const ad = (fs[0].webkitRelativePath || fs[0].name).split("/")[0];
    yukle(fs.map((f) => ({ yol: f.webkitRelativePath || f.name, file: f })), ad);
    sec.value = "";
  };
  ["dragenter", "dragover"].forEach((t) => birak.addEventListener(t, (e) => { e.preventDefault(); birak.classList.add("ustunde"); }));
  ["dragleave", "drop"].forEach((t) => birak.addEventListener(t, (e) => { e.preventDefault(); birak.classList.remove("ustunde"); }));
  birak.addEventListener("drop", async (e) => {
    const items = [...e.dataTransfer.items].map((i) => i.webkitGetAsEntry && i.webkitGetAsEntry()).filter(Boolean);
    if (!items.length) return;
    const dosyalar = (await Promise.all(items.map((i) => girdiOku(i)))).flat();
    const ad = items.length === 1 && items[0].isDirectory ? items[0].name : "paket " + new Date().toLocaleString("tr-TR").replace(/[/:]/g, ".");
    yukle(dosyalar, ad);
  });
  $("#yolEkle").onclick = async () => {
    const kanal = $("#yeniKanal").value;
    if (!kanal) return bildir("Önce kanal seç.", true);
    try {
      const r = await api("/api/klasor", { yol: $("#yolGir").value, kanal });
      $("#yolGir").value = "";
      await yenile();
      await sec_paket(r.ad);
    } catch (e) { bildir(e.message, true); }
  };
  // ayarlar
  const pen = $("#ayarPencere");
  $("#yzDurum").onclick = () => {
    const a = durum.genel.ayarlar, f = pen.querySelector("form");
    f.yz.value = a.yapay_zeka;
    for (const k of ["ollama_adres", "ollama_model", "claude_model", "claude_effort"]) f[k].value = a[k];
    pen.showModal();
  };
  $("#ayarKaydet").onclick = async (e) => {
    e.preventDefault();
    const f = pen.querySelector("form");
    const veri = { yapay_zeka: f.yz.value };
    for (const k of ["ollama_adres", "ollama_model", "claude_model", "claude_effort"]) veri[k] = f[k].value.trim();
    await api("/api/ayar", veri);
    pen.close();
    await yenile();
    bildir("Kaydedildi");
  };
  yenile();
}
kur();
