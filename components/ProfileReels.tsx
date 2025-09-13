"use client";

import { PostWithExtras } from "@/lib/definitions";
import { Clapperboard } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfileReels({ reels, username, isPrivate }: {
  reels: PostWithExtras[];
  username: string;
  isPrivate?: boolean;
}) {
  const router = useRouter();

  if (isPrivate) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Clapperboard className="h-10 w-10 text-neutral-400 mb-4" />
        <p className="text-lg font-bold text-neutral-500">Profil privé</p>
        <p className="text-sm text-neutral-400">Seuls les abonnés peuvent voir les reels.</p>
      </div>
    );
  }

  if (!reels.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Clapperboard className="h-10 w-10 text-neutral-400 mb-4" />
        <p className="text-lg font-bold text-neutral-500">Aucun reel</p>
        <p className="text-sm text-neutral-400">Cet utilisateur n&apos;a pas encore publié de reels.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 p-2 md:p-6">
      {reels.map((reel) => (
        <button
          key={reel.id}
          className="relative group aspect-[9/16] overflow-hidden rounded-md"
          onClick={() => router.push(`/dashboard/p/${reel.id}`)}
        >
          <video
            src={reel.fileUrl}
            className="object-cover w-full h-full"
            controls
            preload="metadata"
          />
        </button>
      ))}
    </div>
  );
}
