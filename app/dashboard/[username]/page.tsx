import PostsGrid from "@/components/PostsGrid";
import { fetchPostsByUsername } from "@/lib/data";


import { Grid3X3 } from "lucide-react";

async function ProfilePage({
  params: { username },
}: {
  params: { username: string };
}) {
  try {
    const posts = await fetchPostsByUsername(username);
    if (!posts || posts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <Grid3X3 className="h-10 w-10 text-neutral-400 mb-4" />
          <p className="text-lg font-bold text-neutral-500">Aucune publication</p>
          <p className="text-sm text-neutral-400">Cet utilisateur n&#39;a pas encore publié de contenu.</p>
        </div>
      );
    }
    return <PostsGrid posts={posts} />;
  } catch (e) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Grid3X3 className="h-10 w-10 text-red-400 mb-4" />
        <p className="text-lg font-bold text-red-500">Erreur</p>
        <p className="text-sm text-neutral-400">Une erreur est survenue lors du chargement des posts.</p>
      </div>
    );
  }
}

export default ProfilePage;
