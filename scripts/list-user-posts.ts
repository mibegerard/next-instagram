import prisma from "../lib/prisma";

async function main() {
  const username = "abbagerardmibekeumeni";
  const user = await prisma.user.findUnique({
    where: { username },
    include: { posts: true }
  });
  if (!user) {
    console.log("User not found.");
    return;
  }
  console.log(`Posts for ${username}:`);
  user.posts.forEach(post => {
    console.log(`- ${post.id}: ${post.caption || "(no caption)"}`);
  });
  if (user.posts.length === 0) {
    console.log("No posts found for this user.");
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
