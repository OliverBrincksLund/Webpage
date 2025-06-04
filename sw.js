const CACHE_NAME = 'oliver-portfolio-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/main.css',
  '/css/header.css',
  '/css/navigation.css',
  '/css/projects.css',
  '/css/gallery.css',
  '/css/services.css',
  '/css/about.css',
  '/css/footer.css',
  '/css/carousel.css',
  '/js/main.js',
  '/js/navigation.js',
  '/js/gis-animation.js',
  '/js/perlin-noise.js',
  '/js/carousel.js',
  '/js/gallery.js',
  '/js/projects.js',
  '/js/particles-config.js',
  '/js/tree-rain-animation.js',
  '/js/dataViz.js',
  '/Images/Gallery/Plots/plot1.png',
  '/Images/Gallery/Plots/plot2.png',
  '/Images/Gallery/Plots/plot3.png',
  '/Images/Gallery/Plots/plot4.png',
  '/Images/Gallery/Maps/map2.png',
  '/Images/Gallery/Maps/map4.png',
  '/Images/Gallery/Maps/map5.png',
  '/Images/Gallery/Maps/map6.png',
  '/Images/DataMerger/DataMerger.jpg'
];

// Install event
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        // Clone the request because it's a stream and can only be consumed once
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(function(response) {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response because it's a stream and can only be consumed once
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      }
    )
  );
});

// Activate event
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 