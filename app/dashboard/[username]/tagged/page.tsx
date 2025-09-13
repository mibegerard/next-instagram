import { fetchUserTaggedPosts } from "@/lib/data";
import ProfileTagged from "@/components/ProfileTagged";

export default async function ProfileTaggedPage({ params }: { params: { username: string } }) {
  const tagged = await fetchUserTaggedPosts(params.username);
  return <ProfileTagged tagged={tagged} username={params.username} />;
}
