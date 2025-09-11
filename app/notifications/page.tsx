"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Récupération des notifications
  const fetchNotifications = async () => {
    setLoading(true);
    const res = await fetch("/api/notifications");
    const data = await res.json();
    setNotifications(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    // Polling toutes les 10s
    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Marquer comme lue
  const markAsRead = async (id: string) => {
    await fetch("/api/notifications/markRead", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchNotifications();
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Notifications</h1>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500">Aucune notification pour le moment.</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((n) => {
            // Détermination du lien cible
            let href = "/profile/" + n.from?.username;
            if (n.post) href = "/p/" + n.post.id;
            return (
              <li
                key={n.id}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${n.isRead ? "bg-gray-800" : "bg-blue-100"}`}
                onClick={async () => {
                  await markAsRead(n.id);
                  window.location.href = href;
                }}
              >
                <Image
                  src={n.from?.image || "/alt.jpeg"}
                  alt={n.from?.username || ""}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                  priority
                />
                <div className="flex-1 text-sm">
                  <span className="font-semibold">{n.from?.username}</span> {n.message}
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(n.createdAt).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
                  </div>
                </div>
                {n.post && (
                  <Image
                    src={n.post.fileUrl}
                    alt="post"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded ml-2 object-cover"
                    priority
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
