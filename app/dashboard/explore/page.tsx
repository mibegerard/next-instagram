import { fetchPosts } from "@/lib/data";
import PostsGrid from "@/components/PostsGrid";

export default async function ExplorePage() {
  // Récupère tous les posts
  const posts = await fetchPosts();

  // Trie les posts par popularité (likes d'abord, puis date)
  const sorted = posts
    .slice()
    .sort((a, b) => {
      if (b.likes.length !== a.likes.length) {
        return b.likes.length - a.likes.length;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <main className="flex flex-col items-center justify-center min-h-screen pb-10">
      <h1 className="text-2xl font-bold mb-6">Explore</h1>
      {sorted.length === 0 ? (
        <p className="text-gray-400">Aucun post populaire pour l&apos;instant.</p>
      ) : (
        <div className="w-full max-w-5xl">
          <PostsGrid posts={sorted} />
        </div>
      )}
    </main>
  );
}
