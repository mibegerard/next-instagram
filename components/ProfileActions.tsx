"use client";
import { MessageCircle, MoreHorizontal, Settings } from "lucide-react";
import { Button } from "./ui/button";
import FollowButton from "./FollowButton";

interface Props {
  isCurrentUser: boolean;
  profileId: string;
  username: string;
  isFollowing: boolean;
}

export default function ProfileActions({ isCurrentUser, profileId, username, isFollowing }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 items-center gap-3">
      <p className="font-semibold text-xl">{username}</p>
      {isCurrentUser ? (
        <>
          <Button size="icon" variant="ghost" className="md:order-last">
            <Settings />
          </Button>
          {/* Edit profile button handled in parent */}
          <Button variant="secondary" className="font-bold" size="sm">
            View archive
          </Button>
        </>
      ) : (
        <>
          <Button
            size="icon"
            variant="ghost"
            className="md:order-last"
            aria-label="Plus d'options"
          >
            <MoreHorizontal />
          </Button>
          <FollowButton profileId={profileId} isFollowing={isFollowing} />
          <Button
            size="icon"
            variant="ghost"
            aria-label="Envoyer un message"
            onClick={() => {
              console.log("Message button clicked for:", username);
              if (username) window.location.href = `/dashboard/messages?to=${username}`;
            }}
          >
            <MessageCircle />
          </Button>
        </>
      )}
    </div>
  );
}
