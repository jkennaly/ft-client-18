// index.jsx

import m from "mithril"
//const Promise = require('promise-polyfill').default
const root = document.getElementById("app")

//console.log('app running index.jsx')
// Styles
import "./index.css"
// images
import "./img/has-access.svg"
import "./img/live-access.svg"
import "./img/insignia lighter 512x512.png"
import "./img/symbol-defs.svg"
// other
//import "./www/robots.txt"
//import "./www/manifest.json"

import App from "./components/layout/App.jsx"
if ("serviceWorker" in navigator) {
	// Use the window load event to keep the page load performant
	window.addEventListener("load", async () => {
		console.log("index.js: registering sw.4")
		try {
			const reg = await navigator.serviceWorker.register("/service-worker.js?v=1", { scope: "/" })
			//console.log("index.js: sw reg", reg)
			listenForWaitingServiceWorker(reg, promptUserToRefresh);
		} catch (err) {
			console.error(err)
			console.error('serviceWorker reg error')
		}

	})
	function listenForWaitingServiceWorker(reg, callback) {
		//console.log('reg', reg)
		function awaitStateChange() {
			reg.installing.addEventListener('statechange', function () {
				if (this.state === 'installed') callback(reg);
			});
		}
		if (!reg) return;
		if (reg.waiting) return callback(reg);
		if (reg.installing) awaitStateChange();
		reg.addEventListener('updatefound', awaitStateChange);
	}
	// reload once when the new Service Worker starts activating
	var refreshing;
	navigator.serviceWorker.addEventListener('controllerchange',
		function () {
			//console.log('controllerchange detected')
			if (refreshing) return;
			refreshing = true;
			window.location.reload();
		}
	);
	function promptUserToRefresh(reg) {
		// this is just an example
		// don't use window.confirm in real life; it's terrible
		console.log('prompt user for refresh')
		if (window.confirm("New version available! OK to refresh?")) {
			console.log('posting message to sw')
			reg.waiting.postMessage('skipWaiting');
		}
	}

}
const parsedUrl = new URL(window.location.href)
console.log("creating app:", parsedUrl.pathname)
if (parsedUrl.pathname === "/") m.mount(root, App)
