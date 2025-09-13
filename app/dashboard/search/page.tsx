"use client";
import { useState } from "react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Appel à l'API de recherche (mock pour l'exemple)
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data.results);
    setLoading(false);
  }

  return (
    <main className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold mb-4">Search</h1>
      <form onSubmit={handleSearch} className="mb-4 w-80 flex flex-col gap-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search users, posts, hashtags..."
          className="border rounded px-4 py-2 w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      <div className="w-80">
        {results.length === 0 && !loading && (
          <p className="text-gray-400">No results yet.</p>
        )}
        {results.length > 0 && (
          <ul className="space-y-2">
            {results.map((item, idx) => (
              <li key={idx} className="border rounded p-2">
                {item.type === "user" && (
                  <a href={`/dashboard/${item.username}`} className="hover:underline text-blue-600">
                    👤 <b>{item.username}</b> ({item.name})
                  </a>
                )}
                {item.type === "post" && (
                  <a href={`/dashboard/p/${item.id}`} className="hover:underline text-blue-600">
                    🖼️ <b>{item.caption}</b>
                  </a>
                )}
                {item.type === "hashtag" && (
                  <span>#<b>{item.tag}</b></span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
