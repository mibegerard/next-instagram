"use client";

import { PostWithExtras } from "@/lib/definitions";
import MiniPost from "./MiniPost";
import { Grid3X3 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePosts({ posts, username, isPrivate }: {
  posts: PostWithExtras[];
  username: string;
  isPrivate?: boolean;
}) {
  const router = useRouter();
  const [selectedPost, setSelectedPost] = useState<PostWithExtras | null>(null);

  if (isPrivate) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Grid3X3 className="h-10 w-10 text-neutral-400 mb-4" />
        <p className="text-lg font-bold text-neutral-500">Profil privé</p>
        <p className="text-sm text-neutral-400">Seuls les abonnés peuvent voir les publications.</p>
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Grid3X3 className="h-10 w-10 text-neutral-400 mb-4" />
        <p className="text-lg font-bold text-neutral-500">Aucune publication</p>
        <p className="text-sm text-neutral-400">Cet utilisateur n&#39;a pas encore publié de contenu.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 md:gap-4 p-2 md:p-6">
      {posts.map((post) => (
        <button
          key={post.id}
          className="relative group aspect-square overflow-hidden rounded-md"
          onClick={() => router.push(`/dashboard/p/${post.id}`)}
        >
          <MiniPost post={post} />
        </button>
      ))}
    </div>
  );
}
