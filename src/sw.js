/*
Copyright 2018 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/


importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js');

if (workbox) {
  	//console.log(`Yay! Workbox is loaded 🎉`);

  	workbox.skipWaiting()
  	//workbox.clientsClaim()

	const bgSyncPlugin = new workbox.backgroundSync.Plugin('myQueueName', {
	  maxRetentionTime: 24 * 60 // Retry for max of 24 Hours
	})

	  workbox.precaching.precacheAndRoute([]);

	  workbox.routing.registerRoute(
		  /\/api\/Messages\/*/,
		  workbox.strategies.networkOnly({
		    plugins: [bgSyncPlugin]
		  }),
		  'POST'
	);

	workbox.routing.registerRoute(
  		new RegExp("(.*)widget.cloudinary.com/(.*)"),
  		workbox.strategies.cacheFirst({
      		cacheName: 'cloud-images',
		    plugins: [
		        new workbox.expiration.Plugin({
		          maxAgeSeconds: 30 * 24 * 60 * 60,
		          maxEntries: 300,
		        }),
		        new workbox.cacheableResponse.Plugin({
		          statuses: [0, 200],
		        }),
		    ],
  		}),
	);

	workbox.routing.registerRoute(
  		new RegExp("(.*)fontawesome.com/(.*)"),
  		workbox.strategies.cacheFirst({
      		cacheName: 'fonts',
		    plugins: [
		        new workbox.expiration.Plugin({
		          maxAgeSeconds: 30 * 24 * 60 * 60,
		          maxEntries: 300,
		        }),
		        new workbox.cacheableResponse.Plugin({
		          statuses: [0, 200],
		        }),
		    ],
  		}),
	);

	workbox.routing.registerRoute(
  		new RegExp("(.*)googleapis.com/(.*)"),
  		workbox.strategies.cacheFirst({
      		cacheName: 'fonts',
		    plugins: [
		        new workbox.expiration.Plugin({
		          maxAgeSeconds: 30 * 24 * 60 * 60,
		          maxEntries: 300,
		        }),
		        new workbox.cacheableResponse.Plugin({
		          statuses: [0, 200],
		        }),
		    ],
  		}),
	);

	workbox.routing.registerRoute(
  		new RegExp("(.*)gstatic.com/(.*)"),
  		workbox.strategies.cacheFirst({
      		cacheName: 'fonts',
		    plugins: [
		        new workbox.expiration.Plugin({
		          maxAgeSeconds: 30 * 24 * 60 * 60,
		          maxEntries: 300,
		        }),
		        new workbox.cacheableResponse.Plugin({
		          statuses: [0, 200],
		        }),
		    ],
  		}),
	);


} else {
  console.log(`Boo! Workbox didn't load 😬`);
}