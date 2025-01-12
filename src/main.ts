import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

const app = createApp(App)

// Initialize IndexedDB
if ('indexedDB' in window) {
  window.addEventListener('load', () => {
    // Request persistent storage
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().then(isPersisted => {
        console.log(`Persistent storage granted: ${isPersisted}`);
      });
    }
  });
}

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(() => {
        console.log('ServiceWorker registration successful')
      })
      .catch(err => {
        console.log('ServiceWorker registration failed: ', err)
      })
  })
}

app.mount('#app')