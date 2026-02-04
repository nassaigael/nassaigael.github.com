
const CACHE_NAME = 'portfolio-v1.0.0';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './assets/css/bundle.min.css',
    './assets/js/bundle/app.min.js',
    './assets/css/fonts.min.css',
    './assets/images/webp/autre.webp',
    './assets/images/svg/home.svg',
    './assets/images/svg/about.svg',
    './assets/images/svg/resume.svg',
    './assets/images/svg/services.svg',
    './assets/images/svg/skills.svg',
    './assets/images/svg/portfolio.svg',
    './assets/images/svg/contact.svg'
];

// Installation
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Mise en cache des assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// Activation
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker: Suppression ancien cache', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch avec cache puis réseau
self.addEventListener('fetch', event => {
    // Ignorer les requêtes non-GET et certaines URLs
    if (event.request.method !== 'GET' || 
        event.request.url.includes('chrome-extension') ||
        event.request.url.includes('analytics')) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                
                return fetch(event.request)
                    .then(response => {
                        // Ne mettre en cache que les réponses valides
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        const responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch(error => {
                        console.log('Fetch failed; returning offline page', error);
                        // Vous pourriez retourner une page offline ici
                    });
            })
    );
});
