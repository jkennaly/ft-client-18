// src/www/src-sw.js

// Add any other logic here as needed.

import { CacheableResponsePlugin } from "workbox-cacheable-response/CacheableResponsePlugin.js"
import { CacheFirst } from "workbox-strategies/CacheFirst.js"
import { createHandlerBoundToURL } from "workbox-precaching/createHandlerBoundToURL.js"
import { ExpirationPlugin } from "workbox-expiration/ExpirationPlugin.js"
import { NavigationRoute } from "workbox-routing/NavigationRoute.js"
import { precacheAndRoute } from "workbox-precaching/precacheAndRoute.js"
import { registerRoute } from "workbox-routing/registerRoute.js"

self.__WB_DISABLE_DEV_LOGS = true
const caching = self.__WB_MANIFEST
console.log('sw 0')
precacheAndRoute(caching)

/*
registerRoute(
	new NavigationRoute(createHandlerBoundToURL("/index.html"), {
		blacklist: [/\/activate\b/, /\/site/]
	})
)
*/
const exclude = [/bucks/, /\/gtt/, /\/Profiles/]

registerRoute(
	({ url, sameOrigin }) => {
		if (!sameOrigin) return false
		const routeIn = /\/api\/.*/.test(url)
		const routeOut = routeIn && exclude.some(e => e.test(url))
		return routeIn && !routeOut
	},
	new CacheFirst({
		cacheName: "short-cache",
		matchOptions: {
			ignoreVary: true
		},
		plugins: [
			new ExpirationPlugin({
				maxEntries: 500,
				maxAgeSeconds: 300,
				purgeOnQuotaError: true
			}),
			new CacheableResponsePlugin({
				statuses: [0, 200]
			})
		]
	})
)

self.addEventListener("message", event => {
	if (event.data === "skipWaiting") {
		console.log('new sw running')
		self.skipWaiting()
	}
})
/*
self.addEventListener("install", event => {
	//console.log("[Service Worker] Installing Service Worker ...", event)

	event.waitUntil(self.skipWaiting())
})
*/
self.addEventListener("activate", event => {
	//console.log("[Service Worker] Activating Service Worker ...", event)

	return self.clients.claim()
})
