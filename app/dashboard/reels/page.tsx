import { fetchPosts } from "@/lib/data";
import ReelsClient from "./ReelsClient";

export default async function ReelsPage() {
  const posts = await fetchPosts();
  const reels = posts.filter((p: any) => p.type === "REEL");
  return <ReelsClient reels={reels} />;
}
