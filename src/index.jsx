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
	window.addEventListener("load", () => {
		console.log("index.js: registering sw")
		navigator.serviceWorker.register("/service-worker.js", { scope: "/" })
	})
}
const parsedUrl = new URL(window.location.href)
console.log("creating app:", parsedUrl.pathname)
if (parsedUrl.pathname === "/") m.mount(root, App)
