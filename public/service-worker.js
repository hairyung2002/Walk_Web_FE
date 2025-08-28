const CACHE_NAME = 'my-cache-v1';
const FILES_TO_CACHE = ['/', '/index.html'];

// 설치: 앱 설치 시 필요한 정적 파일 캐시
self.addEventListener('install', (event) => {
  console.log('[SW] Installing and caching...');
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))); // 파일 캐시에 저장
  self.skipWaiting(); // 설치되자마자 활성화
});

// 활성화: 오래된 캐시 정리
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        }),
      ),
    ),
  );
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // 카카오맵 API는 캐싱하지 않고 네트워크로 바로 전달
  if (url.includes('dapi.kakao.com') || url.includes('kakao')) {
    return;
  }

  // 기본 캐싱 로직
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});
