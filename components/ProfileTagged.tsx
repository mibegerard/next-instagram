"use client";

import { PostWithExtras } from "@/lib/definitions";
import { Contact } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProfileTagged({ tagged, username }: {
  tagged: PostWithExtras[];
  username: string;
}) {
  const router = useRouter();

  if (!tagged.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Contact className="h-10 w-10 text-neutral-400 mb-4" />
        <p className="text-lg font-bold text-neutral-500">Aucun post tagué</p>
        <p className="text-sm text-neutral-400">Cet utilisateur n&apos;a pas encore été tagué dans un post.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 md:gap-4 p-2 md:p-6">
      {tagged.map((post) => (
        <button
          key={post.id}
          className="relative group aspect-square overflow-hidden rounded-md"
          onClick={() => router.push(`/dashboard/p/${post.id}`)}
        >
          <Image
            src={post.fileUrl}
            alt="tagged post"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover rounded-md"
          />
        </button>
      ))}
    </div>
  );
}
