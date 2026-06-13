self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/portfolio";
  event.waitUntil(clients.openWindow(url));
});
