export const requestNotificationPermission = () => {
  if ("Notification" in window) {
    Notification.requestPermission();
  }
};

export const sendFocusReminder = () => {
  if (Notification.permission === "granted") {
    new Notification("⏰ Focus Reminder", {
      body: "Time to start a focus session on MindBloom!",
      icon: "/logo192.png",
    });
  }
};