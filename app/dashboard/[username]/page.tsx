import PostsGrid from "@/components/PostsGrid";
import { fetchPostsByUsername } from "@/lib/data";


import Error from "@/components/Error";

async function ProfilePage({
  params: { username },
}: {
  params: { username: string };
}) {
  try {
    const posts = await fetchPostsByUsername(username);
    if (!posts || posts.length === 0) {
      return (
        <Error res={{ message: `No posts found for user '${username}'.` }} />
      );
    }
    return <PostsGrid posts={posts} />;
  } catch (e) {
  return <Error res={{ message: "An error occurred while loading posts." }} />;
  }
}

export default ProfilePage;
