/// <reference lib="webworker" />

import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

declare const self: ServiceWorkerGlobalScope;

// 預快取靜態資源
precacheAndRoute(self.__WB_MANIFEST);

// 清理過期快取
cleanupOutdatedCaches();

// 快取策略設定

// 1. HTML 文件 - 網路優先
registerRoute(
  ({ request }) => request.destination === 'document',
  new NetworkFirst({
    cacheName: 'html-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 24 * 60 * 60, // 24 小時
      }),
    ],
  })
);

// 2. CSS 和 JS 文件 - 快取優先
registerRoute(
  ({ request }) => 
    request.destination === 'style' || 
    request.destination === 'script',
  new CacheFirst({
    cacheName: 'static-resources',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 天
      }),
    ],
  })
);

// 3. 圖片資源 - 快取優先
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 天
      }),
    ],
  })
);

// 4. 字體文件 - 快取優先
registerRoute(
  ({ request }) => request.destination === 'font',
  new CacheFirst({
    cacheName: 'fonts',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 年
      }),
    ],
  })
);

// 5. API 請求 - 網路優先，快取作為後備
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 3,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60, // 1 小時
      }),
    ],
  })
);

// 6. 外部資源 - 快取後更新
registerRoute(
  ({ url }) => url.origin !== self.location.origin,
  new StaleWhileRevalidate({
    cacheName: 'external-resources',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 24 * 60 * 60, // 24 小時
      }),
    ],
  })
);

// 背景同步 (如果需要)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // 在這裡處理背景同步邏輯
  // 例如：同步本地數據到服務器
  console.log('Background sync triggered');
}

// 推送通知處理
self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    tag: 'water-reminder',
    renotify: true,
    requireInteraction: false,
    actions: [
      {
        action: 'record',
        title: '記錄飲水',
        icon: '/pwa-192x192.png'
      },
      {
        action: 'dismiss',
        title: '稍後提醒',
        icon: '/pwa-192x192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 通知點擊處理
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'record') {
    // 打開應用並導航到記錄頁面
    event.waitUntil(
      self.clients.openWindow('/?action=record')
    );
  } else if (event.action === 'dismiss') {
    // 延遲提醒邏輯
    console.log('User dismissed notification');
  } else {
    // 預設行為：打開應用
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});

// 訊息處理 (與主執行緒通信)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 安裝事件
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  // 立即接管頁面
  self.skipWaiting();
});

// 啟動事件
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  // 立即接管所有客戶端
  event.waitUntil(self.clients.claim());
});

// 錯誤處理
self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker unhandled rejection:', event.reason);
});

// 導出類型 (供 TypeScript 使用)
export {};