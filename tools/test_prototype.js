/* Project Ascend prototip fonksiyonel testi.
   Kullanim: node test_prototype.js
   jsdom kullanmaz; hafif bir DOM shim ile gercek uygulama kodunu calistirir.
   Uretilen SVG/HTML metni uzerinden sayim yaparak cizim dogrulanir.        */
"use strict";
const fs = require("fs"), vm = require("vm");

const html = fs.readFileSync("ascend_prototype.html", "utf8");
const scripts = [...html.matchAll(/<script>\n([\s\S]*?)\n<\/script>/g)].map(m => m[1]);
if (scripts.length < 2) { console.error("script bloklari bulunamadi"); process.exit(1); }

/* ---------------------------------------------------------------- DOM shim */
function El(id) {
  return {
    id, textContent: "", value: "", checked: false, innerHTML: "",
    style: {}, files: [], dataset: {},
    classList: { add() {}, remove() {}, contains: () => false },
    addEventListener() {}, click() {}, focus() {},
    getBoundingClientRect: () => ({ width: 1400, height: 800, left: 0, top: 0 }),
    setAttribute(k, v) { this["attr_" + k] = v; },
    get children() { return countTopDivs(this.innerHTML); },
    querySelectorAll: sel => sel === ".node" ? parseNodes(this_svg_html()).map(n =>
      ({ dataset: { id: n.id }, set onclick(f) { }, })) : [],
  };
}
function countTopDivs(h) { const n = (h.match(/<div style="margin-bottom:7px/g) || []).length; return { length: n }; }

const els = {};
function get(id) { if (!els[id]) els[id] = El(id); return els[id]; }
function this_svg_html() { return els.svg ? els.svg.innerHTML : ""; }

/* <g class="..." data-id="..."> gruplarini ayikla */
function parseNodes(h) {
  return [...h.matchAll(/<g class="([^"]*)" data-id="([^"]*)">/g)]
    .map(m => ({ cls: m[1], id: m[2] }));
}
function countClass(h, token) { return parseNodes(h).filter(n => n.cls.split(/\s+/).includes(token)).length; }

const document = {
  getElementById: get,
  createElement: () => ({ href: "", download: "", click() {}, style: {} }),
  querySelectorAll(sel) {
    const svgH = this_svg_html(), detH = els.detail ? els.detail.innerHTML : "";
    switch (sel) {
      case "#svg .node": return { length: parseNodes(svgH).length };
      case "#svg .node:not(.dim)": return { length: parseNodes(svgH).filter(n => !n.cls.split(/\s+/).includes("dim")).length };
      case "#svg .node.gps": return { length: countClass(svgH, "gps") };
      case "#svg .edge": return { length: (svgH.match(/class="edge[^"]*"/g) || []).length };
      case "#svg .bandlabel": return { length: (svgH.match(/class="bandlabel"/g) || []).length };
      case "#eqList .chk": return { length: ((els.eqList || {}).innerHTML || "").split('class="chk').length - 1 };
      case "#catList .chk": return { length: ((els.catList || {}).innerHTML || "").split('class="chk').length - 1 };
      case "#detail .masrow": return { length: (detH.match(/class="masrow/g) || []).length };
      case "#detail ul\\.tips li": case "#detail ul.tips li": return { length: (detH.match(/<li>/g) || []).length };
      default: return { length: 0 };
    }
  },
};
// svg elemani icin gercek querySelectorAll (onclick baglamasi calissin)
Object.defineProperty(get("svg"), "querySelectorAll", {
  value: sel => sel === ".node" ? parseNodes(this_svg_html()).map(n => ({ dataset: { id: n.id }, onclick: null })) : [],
  writable: true,
});

const sandbox = {
  window: {}, document, console, addEventListener() {}, removeEventListener() {},
  localStorage: undefined,          // try/catch icine dusecek
  setTimeout: (f, ms) => 0, clearTimeout: () => {},
  confirm: () => true, alert: () => {}, Blob: function () {},
  URL: { createObjectURL: () => "blob:" }, FileReader: function () {},
  Number, Math, JSON, Object, Array, String, Date, Set, Map, isNaN, parseInt, parseFloat,
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
const ctx = vm.createContext(sandbox);

let loadErr = null;
try { vm.runInContext(scripts[scripts.length - 2], ctx, { filename: "data.js" });
      vm.runInContext(scripts[scripts.length - 1], ctx, { filename: "app.js" }); }
catch (e) { loadErr = e; }

/* ---------------------------------------------------------------- test kosucu */
let pass = 0, fail = 0;
const ok = (name, cond, extra = "") => {
  cond ? pass++ : fail++;
  console.log((cond ? "  gecti  " : "  HATA   ") + name + (extra ? "   [" + extra + "]" : ""));
};
const W = sandbox;
const Q = s => document.querySelectorAll(s).length;

console.log("\n=== 1. YUKLEME VE CIZIM ===");
ok("uygulama hatasiz yuklendi", loadErr === null, loadErr && loadErr.message);
if (loadErr) { console.log(loadErr.stack.split("\n").slice(0, 4).join("\n")); process.exit(1); }
ok("veri yuklendi (196 hareket)", W.ASCEND_DATA.moves.length === 196);
ok("196 node cizildi", Q("#svg .node") === 196, "cizilen=" + Q("#svg .node"));
ok("kenarlar cizildi (>200)", Q("#svg .edge") > 200, "kenar=" + Q("#svg .edge"));
ok("12 kategori bandi cizildi", Q("#svg .bandlabel") === 12);
ok("baslangic seviyesi 1", String(get("lvlNum").textContent) === "1");
ok("boss sayaci 0/22", get("sBoss").textContent === "0/22", get("sBoss").textContent);
ok("basta sadece 23 kok node acik", Number(get("sOpen").textContent) === 23, "acik=" + get("sOpen").textContent);
ok("ekipman kenar cubugu 11 satir", Q("#eqList .chk") === 11, "satir=" + Q("#eqList .chk"));
ok("kategori kenar cubugu 12 satir", Q("#catList .chk") === 12);
ok("boss kenar cubugu 22 satir", get("bossList").children.length === 22, "satir=" + get("bossList").children.length);

console.log("\n=== 2. DETAY PANELI ===");
W.openDetail("pushup");
const d1 = get("detail").innerHTML;
ok("hareket adi yazdirildi", /Standard Push-up/.test(d1));
ok("4 mastery kademesi listelendi", Q("#detail .masrow") === 4);
ok("ipucu ve hata listesi dolu", Q("#detail ul.tips li") >= 5, "madde=" + Q("#detail ul.tips li"));
ok("on kosullar gosterildi", /Incline Push-up/.test(d1));
ok("neyin kilidini actigi gosterildi", /Wide Push-up/.test(d1));
ok("kilitli oldugu icin uyari gosterildi", /Kilitli/.test(d1));
ok("kilitliyken kayit alani devre disi", /disabled/.test(d1));

console.log("\n=== 3. KILIT MANTIGI (baslangic) ===");
ok("wall-pushup acik (kok node)", W.isOpen("wall-pushup"));
ok("pushup kilitli (incline + knee gerekli)", !W.isOpen("pushup"));
ok("front-lever kilitli", !W.isOpen("front-lever"));
ok("full-planche kilitli", !W.isOpen("full-planche"));

console.log("\n=== 4. KAYIT, XP VE KILIT ACMA ===");
W.logValue("wall-pushup", 8);                       // bronz esigi 8
ok("bronz kademeye ulasildi", W.tierOf("wall-pushup") === 0);
ok("XP verildi", W.S.xp > 0, "xp=" + W.S.xp);
ok("cocuk node'lar acildi", W.isOpen("incline-pushup") && W.isOpen("knee-pushup"));
ok("iki on kosuldan biri yeterli DEGIL (AND mantigi)", !W.isOpen("pushup"));
W.logValue("incline-pushup", 8);
W.logValue("knee-pushup", 8);
ok("iki on kosul da bronz -> pushup acildi", W.isOpen("pushup"));

const xpA = W.S.xp, mas = W.MVref("pushup").mas;
W.logValue("pushup", 10);                           // bronz 5, gumus 10 -> iki kademe
ok("iki kademe birden atlandi -> ikisinin XP'si verildi",
   W.S.xp - xpA === mas[0][1] + mas[1][1], "kazanc=" + (W.S.xp - xpA) + " beklenen=" + (mas[0][1] + mas[1][1]));
ok("kademe gumus", W.tierOf("pushup") === 1);

console.log("\n=== 5. GECERSIZ KAYIT REDDI ===");
const xpB = W.S.xp;
W.logValue("pushup", 5);
ok("mevcut en iyiden dusuk deger reddedildi", W.S.best["pushup"] === 10 && W.S.xp === xpB);
W.logValue("pushup", 0);
ok("sifir deger reddedildi", W.S.best["pushup"] === 10);
W.logValue("pushup", -3);
ok("negatif deger reddedildi", W.S.best["pushup"] === 10);
W.logValue("pushup", 11);
ok("ayni kademe icinde tekrar XP verilmedi", W.S.xp === xpB, "xp=" + W.S.xp);
ok("ama en iyi kayit guncellendi", W.S.best["pushup"] === 11);

console.log("\n=== 6. SEVIYE EGRISI ===");
ok("0 XP -> seviye 1", W.levelOf(0) === 1);
ok("100 XP -> seviye 2", W.levelOf(100) === 2, "seviye=" + W.levelOf(100));
ok("tum master XP (525.480) -> seviye 100", W.levelOf(525480) === 100, "seviye=" + W.levelOf(525480));
ok("seviye egrisi monoton artan",
   W.ASCEND_DATA.levelCurve.every((v, i, a) => i === 0 || v > a[i - 1]));

console.log("\n=== 7. SKILL GPS (ters yol hesabi) ===");
const anc = W.ancestors("front-lever");
ok("front-lever icin ata zinciri bulundu", anc.size >= 8, "ata=" + anc.size);
ok("zincir kok node'a kadar iniyor", anc.has("passive-hang"));
ok("planche-pushup zinciri daha uzun", W.ancestors("planche-pushup").size > anc.size,
   W.ancestors("planche-pushup").size + " vs " + anc.size);
W.setGps("front-lever");
ok("GPS yolu agacta vurgulandi", Q("#svg .node.gps") === anc.size + 1, "vurgulanan=" + Q("#svg .node.gps"));
W.setGps("front-lever");
ok("GPS kapatildi", Q("#svg .node.gps") === 0);

console.log("\n=== 8. FILTRELER ===");
get("fBoss").checked = true; W.render();
ok("boss filtresi tam 22 node gosterdi", Q("#svg .node:not(.dim)") === 22, "gorunur=" + Q("#svg .node:not(.dim)"));
get("fBoss").checked = false;
get("q").value = "handstand"; W.render();
const sv = Q("#svg .node:not(.dim)");
ok("metin aramasi filtreledi", sv > 3 && sv < 30, "gorunur=" + sv);
get("q").value = "planche"; W.render();
ok("planche aramasi sonuc verdi", Q("#svg .node:not(.dim)") >= 5, "gorunur=" + Q("#svg .node:not(.dim)"));
get("q").value = "";
get("fEq").checked = true; W.render();
const eqV = Q("#svg .node:not(.dim)");
ok("ekipman filtresi halka/parallettes hareketlerini gizledi", eqV > 0 && eqV < 196, "gorunur=" + eqV);
get("fEq").checked = false;
get("fOnlyOpen").checked = true; W.render();
ok("sadece-acik filtresi calisti", Q("#svg .node:not(.dim)") === W.ASCEND_DATA.moves.filter(m => W.isOpen(m.id)).length);
get("fOnlyOpen").checked = false;
get("fNext").checked = true; W.render();
ok("siradaki-hedefler filtresi bos degil", Q("#svg .node:not(.dim)") > 0, "gorunur=" + Q("#svg .node:not(.dim)"));
get("fNext").checked = false; W.render();

console.log("\n=== 9. DENGE PUANI ===");
const bal = W.balance();
ok("denge puani 0-100 arasinda", bal !== null && bal >= 0 && bal <= 100, "denge=" + bal);
ok("tek kategoride yigilma dengeyi dusurdu", bal < 60, "denge=" + bal);

console.log("\n=== 10. BOSS HP GOSTERGESI ===");
W.openDetail("front-lever");
ok("boss detayinda HP cubugu var", /Boss HP/.test(get("detail").innerHTML));
ok("boss etiketi gosterildi", /BOSS/.test(get("detail").innerHTML));

console.log("\n=== 11. TAM ERISILEBILIRLIK SIMULASYONU ===");
let guard = 0, changed = true;
while (changed && guard++ < 60) {
  changed = false;
  W.ASCEND_DATA.moves.forEach(m => {
    if (W.S.best[m.id] == null && W.isOpen(m.id)) { W.S.best[m.id] = m.mas[0][0]; changed = true; }
  });
}
const allOpen = W.ASCEND_DATA.moves.filter(m => W.isOpen(m.id)).length;
ok("sadece bronz yaparak 196 node'un tamami acilabiliyor", allOpen === 196,
   "acilan=" + allOpen + " / iterasyon=" + guard);
ok("kilitlenme (deadlock) yok", guard < 60);
W.render();
ok("tum node'lar bronz+ oldugunda boss sayaci 22/22", get("sBoss").textContent === "22/22", get("sBoss").textContent);
const balFull = W.balance();
ok("her sey bronz oldugunda denge puani ~100", balFull >= 95, "denge=" + balFull);

console.log("\n=== 12. SIFIRLAMA ===");
W.resetState();
ok("XP sifirlandi", W.S.xp === 0);
ok("tum kayitlar silindi", Object.keys(W.S.best).length === 0);
ok("sifirlamadan sonra yine 23 kok node acik",
   W.ASCEND_DATA.moves.filter(m => W.isOpen(m.id)).length === 23);
ok("agac yeniden cizildi", Q("#svg .node") === 196);

console.log("\n" + "=".repeat(56));
console.log(`  GECEN: ${pass}    BASARISIZ: ${fail}`);
console.log("=".repeat(56));
process.exit(fail ? 1 : 0);
