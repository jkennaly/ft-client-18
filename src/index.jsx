// index.jsx

import m from 'mithril'
const root = document.getElementById("app");

// Styles
import "./index.css";
// images
//import "./favicon.ico";

import App from './components/layout/App.jsx';

m.render(root, <App />);
