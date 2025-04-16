import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "@/lib/constants"; // Import to ensure global styles are loaded

// Add leaflet CSS
const leafletCss = document.createElement("link");
leafletCss.rel = "stylesheet";
leafletCss.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
leafletCss.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
leafletCss.crossOrigin = "";
document.head.appendChild(leafletCss);

// Add Howler.js for audio
const howlerScript = document.createElement("script");
howlerScript.src = "https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.3/howler.min.js";
howlerScript.integrity = "sha512-6+YN/9o9BWrk6wSfGxQGpt3EUK6XeHi6yeHV+TYD2GR0Sj/cggxQpmuvqszEuuorx1HYMoLtRV9yVFYjdnw+UQ==";
howlerScript.crossOrigin = "anonymous";
howlerScript.referrerPolicy = "no-referrer";
document.head.appendChild(howlerScript);

// Register service worker for offline functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registration successful with scope: ', registration.scope);
      })
      .catch((err) => {
        console.log('Service Worker registration failed: ', err);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
