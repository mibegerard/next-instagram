"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NotificationsList({ initialNotifications }: { initialNotifications: any[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function formatRelativeDate(date: Date | string) {
    const d = typeof date === "string" ? new Date(date) : date;
    const diff = (Date.now() - d.getTime()) / 1000;

    if (diff < 60) return `il y a ${Math.floor(diff)}s`;
    if (diff < 3600) return `il y a ${Math.floor(diff / 60)}min`;
    if (diff < 86400) return `il y a ${Math.floor(diff / 3600)}h`;
    if (diff < 172800) return "hier";
    return d.toLocaleDateString();
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  async function handleClick(notif: any) {
    if (!notif.isRead) {
      await fetch("/api/notifications/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: notif.id }),
      });

      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
      );
    }

    if (notif.type === "FOLLOW") {
      router.push(`/dashboard/${notif.from?.username}`);
    } else if (notif.post?.id) {
      router.push(`/dashboard/p/${notif.post.id}`);
    }
  }

  if (!notifications.length) {
    return (
      <main className="flex flex-col items-center justify-center h-full bg-white dark:bg-black">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Notifications</h1>
        <p className="text-gray-400 dark:text-gray-400">Aucune notification pour l&apos;instant.</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-start h-full bg-white dark:bg-black pt-4">
      {/* En-tête */}
      <div className="flex items-center gap-2 mb-4 px-4 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Notifications</h1>
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      {/* Liste */}
      <ul className="w-full max-w-md space-y-1">
        {notifications.map((notif) => (
          <li
            key={notif.id}
            className={`flex items-center gap-3 p-3 rounded-lg transition cursor-pointer 
              ${notif.isRead ? "bg-white dark:bg-gray-900" : "bg-blue-50 dark:bg-blue-900"}
              hover:bg-gray-100 dark:hover:bg-gray-800`}
            onClick={() => startTransition(() => handleClick(notif))}
          >
            {/* Avatar */}
            <Image
              src={notif.from?.image || "/logo.png"}
              alt={notif.from?.username || "avatar"}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-gray-700"
            />

            {/* Contenu texte */}
            <div className="flex-1 flex flex-col justify-center">
              {/* Description */}
              <span className="text-gray-700 dark:text-gray-300 mt-0.5">
                {notif.message}
              </span>
              {/* Date */}
              <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {formatRelativeDate(notif.createdAt)}
              </span>
            </div>

            {/* Miniature du post à droite */}
            {notif.post?.fileUrl && (
              <Image
                src={notif.post.fileUrl}
                alt="miniature post"
                width={48}
                height={48}
                className="w-12 h-12 rounded object-cover border border-gray-300 dark:border-gray-700 ml-3"
              />
            )}

            {/* Pastille rouge pour non-lu */}
            {!notif.isRead && <span className="w-3 h-3 bg-red-500 rounded-full ml-2" />}
          </li>
        ))}
      </ul>
    </main>
  );
}
