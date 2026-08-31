// ---------------------------------------------------------
// Denisita's Tracker — Service Worker
// ---------------------------------------------------------

const CACHE_NAME = "denisita-tracker-v3"; 
// ↑ IMPORTANT: bump this version ANY time you change:
//   - icons
//   - manifest.json
//   - index.html
//   - CSS or JS
//   - folder structure

const FILES_TO_CACHE = [
  "/med-tracker/",
  "/med-tracker/index.html",
  "/med-tracker/style.css",
  "/med-tracker/app.js",
  "/med-tracker/manifest.json",

  // ICONS — ensure filenames match EXACTLY
  "/med-tracker/icons/Denisita-Tracker-Logo.png"
];

// ---------------------------------------------------------
// INSTALL — cache all required files
// ---------------------------------------------------------
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// ---------------------------------------------------------
// ACTIVATE — remove old caches
// ---------------------------------------------------------
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// ---------------------------------------------------------
// FETCH — serve cached files first, fallback to network
// ---------------------------------------------------------
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request).catch(() => cachedResponse)
      );
    })
  );
});
