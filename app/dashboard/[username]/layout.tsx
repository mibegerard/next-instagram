import { auth } from "@/auth";
import FollowButton from "@/components/FollowButton";
import ProfileAvatar from "@/components/ProfileAvatar";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileTabs from "@/components/ProfileTabs";
import UserAvatar from "@/components/UserAvatar";
import { Button, buttonVariants } from "@/components/ui/button";
import ProfileActions from "@/components/ProfileActions";
import { fetchProfile } from "@/lib/data";
import { MoreHorizontal, Settings, MessageCircle } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: {
    username: string;
  };
  children: React.ReactNode;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const username = params.username;

  const decodedUsername = decodeURIComponent(username);
  const profile = await fetchProfile(decodedUsername);

  return {
    title: `${profile?.name} (@${profile?.username})`,
  };
}

async function ProfileLayout({ children, params: { username } }: Props) {
  const profile = await fetchProfile(username);
  const session = await auth();
  const isCurrentUser = session?.user.id === profile?.id;
  //   the followerId here is the id of the user who is following the profile
  const isFollowing = profile?.followedBy.some(
    (user) => user.followerId === session?.user.id
  );

  if (!profile) {
    notFound();
  }
  return (
    <>
      <ProfileHeader username={profile.username} />
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-x-5 md:gap-x-10 px-4">
          <ProfileAvatar user={profile}>
            <UserAvatar
              user={profile}
              className="w-20 h-20 md:w-36 md:h-36 cursor-pointer"
            />
          </ProfileAvatar>

          <div className="md:px-10 space-y-4">
            <ProfileActions
              isCurrentUser={isCurrentUser}
              profileId={profile.id}
              username={profile.username ?? ""}
              isFollowing={!!isFollowing}
            />

            <div className="flex items-center gap-x-7">
              <p className="font-medium">
                <strong>{profile.posts.length} posts</strong>
              </p>

              <Link
                href={`/dashboard/${profile.username}/followers`}
                className="font-medium"
              >
                <strong>{profile.followedBy.length}</strong> followers
              </Link>

              <Link
                href={`/dashboard/${profile.username}/following`}
                className="font-medium"
              >
                <strong>{profile.following.length}</strong> following
              </Link>
            </div>

            <div className="text-sm">
              <div className="font-bold">{profile.name}</div>
              <p>{profile.bio}</p>
            </div>
          </div>
        </div>

        <ProfileTabs profile={profile} isCurrentUser={isCurrentUser} />

        {children}
      </div>
    </>
  );
}

export default ProfileLayout;
