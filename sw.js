// ============================================
// SERVICE WORKER - Glow & Crunch PWA
// ============================================
const CACHE = "glow-crunch-v1";
const ESENCIALES = ["./", "./index.html"];

const IMG_RE = /\.(png|jpg|jpeg|gif|webp|svg|ico|bmp|avif)$/i;
const VID_RE = /\.(mp4|webm|mov|avi|mkv|m4v|mp3|wav|ogg|m4a)$/i;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(ESENCIALES))
      .catch((err) => console.warn("Pre-cache:", err))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.method !== "GET") return;

  if (
    url.hostname.includes("firebase") ||
    url.hostname.includes("googleapis") ||
    url.hostname.includes("gstatic") ||
    url.hostname.includes("firebaseapp") ||
    url.hostname.includes("google-analytics")
  ) return;

  if (VID_RE.test(url.pathname)) return;

  if (
    req.destination === "document" ||
    url.pathname.endsWith(".html") ||
    url.pathname === "/" ||
    url.pathname.endsWith("/")
  ) {
    event.respondWith(
      fetch(req)
        .then((resp) => {
          const copia = resp.clone();
          caches.open(CACHE).then((c) => c.put(req, copia));
          return resp;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match("./index.html")))
    );
    return;
  }

  if (
    IMG_RE.test(url.pathname) ||
    req.destination === "image" ||
    req.destination === "style" ||
    req.destination === "script" ||
    req.destination === "font"
  ) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const fetched = fetch(req)
          .then((resp) => {
            if (resp && resp.status === 200) {
              caches.open(CACHE).then((c) => c.put(req, resp.clone()));
            }
            return resp;
          })
          .catch(() => cached);
        return cached || fetched;
      })
    );
  }
});