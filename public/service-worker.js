self.addEventListener("install", function (event) {
  self.skipWaiting(); // Add this to skip the waiting phase and activate the new service worker as soon as it's finished installing
  event.waitUntil(
    caches.open("v1").then(function (cache) {
      return cache.addAll([
        "/",
        "/index.html",
        "/styles.css",
        "/app.js",
        "/image.jpg",
        "/manifest.json",
      ]);
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    clients.claim() // This will take control of all clients under the service worker's scope immediately after it activates
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});

// Listen for the controllerchange event on the client side
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    window.location.reload(); // Reload the page to load the new version
  });
}
