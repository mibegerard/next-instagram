"use client";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Avatar } from "@/components/ui/avatar";

function MessagesPage() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // On n’a plus besoin de selectedUserInfo, on extrait directement depuis les messages/conversations
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  // Charger les conversations
  useEffect(() => {
    async function fetchConversations() {
      if (!session?.user?.id) return;
      setLoading(true);
      try {
        const data = await fetch(`/api/messages?userId=${session.user.id}`).then(r => r.json());
        const grouped: Record<string, any[]> = {};
        data.forEach((msg: any) => {
          const otherUser = msg.senderId === session.user.id ? msg.receiverId : msg.senderId;
          if (!grouped[otherUser]) grouped[otherUser] = [];
          grouped[otherUser].push(msg);
        });
        setConversations(Object.entries(grouped));
        // Mettre à jour les messages si une conversation est sélectionnée
        if (selectedUser) {
          setMessages(
            data.filter((msg: any) =>
              (msg.senderId === selectedUser && msg.receiverId === session.user.id) ||
              (msg.receiverId === selectedUser && msg.senderId === session.user.id)
            )
          );
        }
      } catch (e) {
        setError("Erreur lors du chargement des conversations.");
      }
      setLoading(false);
    }
    fetchConversations();
  }, [session?.user?.id, selectedUser]);

  // Pré-sélection utilisateur via paramètre
  useEffect(() => {
    const to = searchParams.get("to");
    if (to && !selectedUser) {
      setSelectedUser(to);
    }
  }, [searchParams, selectedUser]);

  // On n’a plus besoin de ce useEffect, infos déjà dans les messages

  // Envoi d’un message
  const sendMessage = async () => {
    if (!input || !selectedUser || !session?.user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: session.user.id, receiverId: selectedUser, body: input })
      });
      if (!res.ok) throw new Error("Erreur lors de l'envoi.");
      setInput("");
      const data = await fetch(`/api/messages?userId=${session.user.id}`).then(r => r.json());
      setMessages(data.filter((msg: any) =>
        (msg.senderId === selectedUser && msg.receiverId === session.user.id) ||
        (msg.receiverId === selectedUser && msg.senderId === session.user.id)
      ));
    } catch (e) {
      setError("Erreur lors de l'envoi du message.");
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-white dark:bg-black">
      {/* Liste des conversations */}
      <aside className="w-full sm:w-1/3 border-r border-gray-200 dark:border-neutral-800 p-2 sm:p-4 overflow-y-auto bg-gray-50 dark:bg-neutral-900">
        <h2 className="font-bold text-lg mb-4 text-gray-700 dark:text-gray-100">Conversations</h2>
        {conversations.length === 0 ? (
          <p className="text-gray-400">Aucune conversation</p>
        ) : (
          <ul>
            {conversations.map(([userId, msgs]) => {
              const lastMsg = msgs[msgs.length - 1];
              // Trouver l’autre utilisateur (celui qui n’est pas moi)
              const otherUser = msgs[0]?.sender?.id === session?.user?.id ? msgs[0]?.receiver : msgs[0]?.sender;
              const avatar = otherUser?.image || "/alt.jpeg";
              const username = otherUser?.username || userId;
              return (
                <li key={userId}>
                  <button
                    className={`w-full flex items-center gap-2 text-left p-2 rounded-lg transition-colors duration-100 ${
                      selectedUser === userId
                        ? "bg-blue-100 dark:bg-blue-900"
                        : "hover:bg-gray-100 dark:hover:bg-neutral-800"
                    }`}
                    aria-label={`Ouvrir la conversation avec ${username}`}
                    onClick={() => {
                      setSelectedUser(userId);
                      setMessages(msgs);
                    }}
                  >
                    <Avatar className="relative h-8 w-8">
                      <Image
                        src={avatar}
                        fill
                        alt={username}
                        sizes="100vw"
                        priority
                        className="rounded-full object-cover"
                      />
                    </Avatar>
                    <span className="flex-1">
                      <span className="font-semibold text-gray-800 dark:text-gray-100">{username}</span>
                      <span className="block text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">{lastMsg.body}</span>
                    </span>
                    <span className="text-xs text-gray-400">{new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </aside>

      {/* Zone de messages */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 p-2 sm:p-4 overflow-y-auto" tabIndex={0} aria-label="Zone de messages">
          {selectedUser ? (
            <>
              {/* Trouver l’autre utilisateur dans la conversation sélectionnée */}
              {(() => {
                const msgs = messages.filter((msg: any) =>
                  (msg.senderId === selectedUser && msg.receiverId === session?.user?.id) ||
                  (msg.receiverId === selectedUser && msg.senderId === session?.user?.id)
                );
                const firstMsg = msgs[0];
                const otherUser = firstMsg
                  ? firstMsg.sender?.id === session?.user?.id
                    ? firstMsg.receiver
                    : firstMsg.sender
                  : null;
                const avatar = otherUser?.image || "/alt.jpeg";
                const username = otherUser?.username || selectedUser;
                return (
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="relative h-8 w-8">
                      <Image
                        src={avatar}
                        fill
                        alt={username}
                        sizes="100vw"
                        priority
                        className="rounded-full object-cover"
                      />
                    </Avatar>
                    <h3 className="font-bold text-gray-700 dark:text-gray-100">
                      <span className="text-blue-600 dark:text-blue-400">{username}</span>
                    </h3>
                  </div>
                );
              })()}
              {loading && <div className="text-blue-500">Chargement...</div>}
              {error && <div className="text-red-500">{error}</div>}
              <div className="space-y-2">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`max-w-[70%] p-2 rounded-2xl shadow-sm flex flex-col ${
                      msg.senderId === session?.user?.id
                        ? "ml-auto bg-blue-500 text-white"
                        : "mr-auto bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                    }`}
                    aria-live="polite"
                  >
                    <span className="text-xs mb-1 opacity-70">
                      {msg.senderId === session?.user?.id ? "Moi" : (msg.sender?.username || "Lui")}
                    </span>
                    <div className="break-words">{msg.body}</div>
                    <span className="text-[10px] mt-1 text-right opacity-60">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </>
          ) : (
            <p className="text-gray-400">Sélectionnez une conversation</p>
          )}
        </div>

        {/* Input d’envoi */}
        {selectedUser && (
          <form
            className="p-2 sm:p-4 border-t border-gray-200 dark:border-neutral-800 flex gap-2 bg-gray-50 dark:bg-black"
            onSubmit={e => { e.preventDefault(); sendMessage(); }}
            aria-label="Envoyer un message"
          >
            <label htmlFor="message-input" className="sr-only">Votre message</label>
            <input
              id="message-input"
              type="text"
              className="flex-1 border border-gray-300 dark:border-neutral-700 rounded-full px-4 py-2 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Votre message..."
              disabled={loading}
              aria-disabled={loading}
              aria-label="Saisir votre message"
            />
            <button
              type="submit"
              className={`px-4 py-2 rounded-full font-semibold transition-colors duration-100 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                loading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
              disabled={loading || !input}
              aria-disabled={loading || !input}
            >
              {loading ? "Envoi..." : "Envoyer"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}

export default MessagesPage;
