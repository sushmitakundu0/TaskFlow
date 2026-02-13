import { useEffect } from "react";
import { Task } from "@/pages/Dashboard";

export const useTaskReminders = (tasks: Task[]) => {
  useEffect(() => {
    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const checkReminders = () => {
      if (!("Notification" in window) || Notification.permission !== "granted") {
        return;
      }

      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(23, 59, 59, 999);

      tasks.forEach((task) => {
        if (!task.due_date || task.status === "completed") return;

        const dueDate = new Date(task.due_date);
        const isOverdue = dueDate < now;
        const isDueSoon = dueDate <= tomorrow && dueDate >= now;

        // Check if we've already shown notification for this task
        const notifiedKey = `notified_${task.id}_${task.due_date}`;
        const hasNotified = localStorage.getItem(notifiedKey);

        if ((isOverdue || isDueSoon) && !hasNotified) {
          const notification = new Notification("Task Reminder", {
            body: isOverdue
              ? `⚠️ Overdue: ${task.title}`
              : `📅 Due Soon: ${task.title} (${dueDate.toLocaleDateString()})`,
            icon: "/favicon.ico",
            tag: task.id,
          });

          notification.onclick = () => {
            window.focus();
            notification.close();
          };

          // Mark as notified
          localStorage.setItem(notifiedKey, "true");
        }
      });
    };

    // Check immediately
    checkReminders();

    // Check every 30 minutes
    const interval = setInterval(checkReminders, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [tasks]);
};
