"use client";

import { PostWithExtras } from "@/lib/definitions";
import { Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProfileSaved({ saved, username }: {
  saved: PostWithExtras[];
  username: string;
}) {
  const router = useRouter();

  if (!saved.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Bookmark className="h-10 w-10 text-neutral-400 mb-4" />
        <p className="text-lg font-bold text-neutral-500">Aucun post enregistré</p>
        <p className="text-sm text-neutral-400">Vous n&apos;avez pas encore enregistré de contenu.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 md:gap-4 p-2 md:p-6">
      {saved.map((post) => (
        <button
          key={post.id}
          className="relative group aspect-square overflow-hidden rounded-md"
          onClick={() => router.push(`/dashboard/p/${post.id}`)}
        >
          {/* Miniature du post enregistré */}
          <Image
            src={post.fileUrl}
            alt="saved post"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover rounded-md"
          />
        </button>
      ))}
    </div>
  );
}
