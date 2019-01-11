// index.jsx

import m from 'mithril'
const root = document.getElementById("app");

// Styles
import "./index.css";
// images
//import "./favicon.ico";

import App from './components/layout/App.jsx';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}

m.render(root, <App />);
