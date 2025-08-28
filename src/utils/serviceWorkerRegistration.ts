export function register(): void {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        // 기존 Service Worker 정리
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
          console.log('기존 Service Worker 제거됨:', registration);
        }

        // 캐시 정리
        const cacheNames = await caches.keys();
        for (const cacheName of cacheNames) {
          await caches.delete(cacheName);
          console.log('캐시 정리됨:', cacheName);
        }

        // 새 Service Worker 등록
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('Service Worker registered: ', registration);

        // 업데이트 체크
        registration.addEventListener('updatefound', () => {
          console.log('Service Worker 업데이트 발견됨');
        });
      } catch (error) {
        console.error('Service Worker registration failed: ', error);
      }
    });
  }
}

export function unregister(): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
    });
  }
}
