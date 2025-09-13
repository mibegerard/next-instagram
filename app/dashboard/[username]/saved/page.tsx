import PostsGrid from "@/components/PostsGrid";
import { fetchSavedPostsByUsername } from "@/lib/data";
import { Bookmark } from "lucide-react";

async function SavedPosts({
  params: { username },
}: {
  params: { username: string };
}) {
  const savedPosts = await fetchSavedPostsByUsername(username);
  const posts = savedPosts?.map((savedPost) => savedPost.post);

  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Bookmark className="h-10 w-10 text-neutral-400 mb-4" />
        <p className="text-lg font-bold text-neutral-500">Aucun post enregistré</p>
        <p className="text-sm text-neutral-400">Vous n&apos;avez pas encore enregistré de contenu.</p>
      </div>
    );
  }

  return <PostsGrid posts={posts} />;
}

export default SavedPosts;
