import prisma from "../lib/prisma";

async function main() {
  const username = "abbagérardmibekeumeni"; // Remplacez par le username à tester
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
    console.log(`- id: ${post.id}, fileUrl: ${post.fileUrl}, caption: ${post.caption}`);
  });
  if (user.posts.length === 0) {
    console.log("No posts found for this user.");
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
