// public/sw.js
// Runs in the background, independent of any open tab.
// Registered by the frontend at runtime (see Step 8).

// Listen for incoming push events from the browser push service
self.addEventListener("push", (event) => {
  // Ensure we wait for showNotification to complete before the SW sleeps
  event.waitUntil(handlePush(event));
});

async function handlePush(event) {
  let payload = {
    title: "Notification",
    body: "",
    icon: "/icons/pwa_icon-192x192.webp", // your PWA icon — adjust path as needed
    badge: "/icons/pwa_icon-192x192.webp", // small icon shown in the status bar (optional)
    url: "/",
    data: {},
  };

  // Safely parse the incoming push data
  if (event.data) {
    try {
      const incoming = event.data.json();
      payload = { ...payload, ...incoming }; // merge with defaults
    } catch {
      payload.body = event.data.text(); // fallback to plain text if JSON fails
    }
  }

  await self.registration.showNotification(payload.title, {
    body: payload.body,
    icon: payload.icon,
    badge: payload.badge,
    data: { url: payload.url, ...payload.data }, // store URL for click handler
    // vibrate: [200, 100, 200],  // optional vibration pattern on mobile
    // tag: payload.tag,          // optional: same tag replaces previous notification
  });
}

// Handle notification click — open or focus the correct URL
self.addEventListener("notificationclick", (event) => {
  event.notification.close(); // dismiss the notification

  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        // If the app is already open in a tab, focus it
        for (const client of windowClients) {
          if (client.url === targetUrl && "focus" in client) {
            return client.focus();
          }
        }
        // Otherwise open a new tab
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      }),
  );
});
