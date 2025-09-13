import { fetchUserReels } from "@/lib/data";
import ProfileReels from "@/components/ProfileReels";

export default async function ProfileReelsPage({ params }: { params: { username: string } }) {
  const reels = await fetchUserReels(params.username);
  return <ProfileReels reels={reels} username={params.username} />;
}
