// src/www/src-sw.js

// Add any other logic here as needed.

import { CacheableResponsePlugin } from "workbox-cacheable-response/CacheableResponsePlugin"
import { CacheFirst } from "workbox-strategies/CacheFirst"
import { createHandlerBoundToURL } from "workbox-precaching/createHandlerBoundToURL"
import { ExpirationPlugin } from "workbox-expiration/ExpirationPlugin"
import { NavigationRoute } from "workbox-routing/NavigationRoute"
import { precacheAndRoute } from "workbox-precaching/precacheAndRoute"
import { registerRoute } from "workbox-routing/registerRoute"

const caching = self.__WB_MANIFEST
//console.log("caching stuff", caching)
precacheAndRoute(caching)

registerRoute(
	new NavigationRoute(createHandlerBoundToURL("/index.html"), {
		blacklist: [/\/activate\b/],
	})
)

registerRoute(
	/\/api\/.*/,
	new CacheFirst({
		cacheName: "short-cache",
		matchOptions: {
			ignoreVary: true,
		},
		plugins: [
			new ExpirationPlugin({
				maxEntries: 500,
				maxAgeSeconds: 300,
				purgeOnQuotaError: true,
			}),
			new CacheableResponsePlugin({
				statuses: [0, 200],
			}),
		],
	})
)

self.addEventListener("message", event => {
	if (event.data && event.data.type === "SKIP_WAITING") {
		self.skipWaiting()
	}
})

self.addEventListener("install", event => {
	//console.log("[Service Worker] Installing Service Worker ...", event)

	event.waitUntil(self.skipWaiting())
})

self.addEventListener("activate", event => {
	//console.log("[Service Worker] Activating Service Worker ...", event)

	return self.clients.claim()
})
