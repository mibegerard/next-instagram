"use client";
import { ChevronDown, Settings, UserPlus, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

function ProfileHeader({ username }: { username: string | null }) {
  const router = useRouter();
  return (
    <header className="fixed md:hidden bg-white top-0 flex items-center dark:bg-neutral-950 w-full z-50 border-b border-zinc-300 dark:border-neutral-700 px-3 py-1 sm:-ml-6">
      <Button size={"icon"} variant={"ghost"}>
        <Settings />
      </Button>

      <div className="flex items-center gap-x-2 mx-auto">
        <p className="font-bold">{username}</p>
        <ChevronDown />
      </div>

      <Button
        size={"icon"}
        variant={"ghost"}
        aria-label="Envoyer un message"
        onClick={() => {
          console.log("Message button clicked for:", username);
          if (username) router.push(`/dashboard/messages?to=${username}`);
        }}
      >
        <MessageCircle />
      </Button>

      <Button size={"icon"} variant={"ghost"}>
        <UserPlus />
      </Button>
    </header>
  );
}

export default ProfileHeader;
