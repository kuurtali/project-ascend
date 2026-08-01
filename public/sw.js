// Çevrimdışı önbellek — parkta/salonda internet olmayabilir. (D-012)
//
// !!! v1'DEKİ HATA: cache-first idi. index.html bir kez önbelleğe girince
// sonsuza kadar oradan servis ediliyordu; yeni sürüm hiç görünmüyordu.
// Kullanıcı iki sürüm boyunca hiçbir değişiklik göremedi. (D-054)
//
// DOĞRUSU:
//   HTML/gezinme  -> ÖNCE AĞ, kopamazsa önbellek  (güncellik önemli)
//   /assets/*     -> ÖNCE ÖNBELLEK                (dosya adında hash var,
//                                                  içeriği asla değişmez)
//   diğerleri     -> önce ağ, kopamazsa önbellek
//
// Kural: adı değişmeyen bir dosyayı cache-first servis etme.

const CACHE = 'ascend-v2';

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./', './index.html'])));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)),
      ))
      .then(() => self.clients.claim()),
  );
});

/** Dosya adında build hash'i var mı — varsa içerik sabittir. */
function isImmutable(path) {
  return /\/assets\/.+-[A-Za-z0-9_-]{8,}\.(js|css|woff2?|png|svg)$/.test(path);
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Değişmez varlıklar: önbellekten ver, yoksa indir ve sakla
  if (isImmutable(url.pathname)) {
    e.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      })),
    );
    return;
  }

  // HTML ve geri kalan her şey: önce ağ, kopunca önbellek
  e.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || caches.match('./index.html'))),
  );
});
