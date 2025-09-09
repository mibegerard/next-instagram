import prisma from "../lib/prisma";

async function main() {
  // Création de plusieurs utilisateurs
  const users = await prisma.user.createMany({
    data: [
      { username: "alice", name: "Alice Dupont", email: "alice@example.com" },
      { username: "bob", name: "Bob Martin", email: "bob@example.com" },
      { username: "charlie", name: "Charlie Durand", email: "charlie@example.com" },
      { username: "diana", name: "Diana Leroy", email: "diana@example.com" },
    ],
    skipDuplicates: true,
  });

  // Récupération des utilisateurs
  const alice = await prisma.user.findUnique({ where: { username: "alice" } });
  const bob = await prisma.user.findUnique({ where: { username: "bob" } });
  const charlie = await prisma.user.findUnique({ where: { username: "charlie" } });
  const diana = await prisma.user.findUnique({ where: { username: "diana" } });

  // Création de posts

  // Création des posts et récupération des IDs
  const postAlice = await prisma.post.create({
    data: { caption: "Premier post d'Alice", fileUrl: "/public/test1.jpg", userId: alice!.id }
  });
  const postBob = await prisma.post.create({
    data: { caption: "Post de Bob", fileUrl: "/public/test2.jpg", userId: bob!.id }
  });
  const postCharlie = await prisma.post.create({
    data: { caption: "Post de Charlie", fileUrl: "/public/test3.jpg", userId: charlie!.id }
  });
  const postDiana = await prisma.post.create({
    data: { caption: "Post de Diana", fileUrl: "/public/test4.jpg", userId: diana!.id }
  });

  // Création de likes
  await prisma.like.createMany({
    data: [
      { userId: alice!.id, postId: postAlice.id },
      { userId: bob!.id, postId: postBob.id },
      { userId: charlie!.id, postId: postCharlie.id },
      { userId: diana!.id, postId: postDiana.id },
    ],
  });

  // Création de commentaires
  await prisma.comment.createMany({
    data: [
      { userId: bob!.id, postId: postAlice.id, body: "Super post Alice!" },
      { userId: charlie!.id, postId: postBob.id, body: "Bien joué Bob!" },
      { userId: diana!.id, postId: postCharlie.id, body: "Bravo Charlie!" },
      { userId: alice!.id, postId: postDiana.id, body: "Joli Diana!" },
    ],
  });

  // Création de relations (follows)
  await prisma.follows.createMany({
    data: [
      { followerId: alice!.id, followingId: bob!.id },
      { followerId: bob!.id, followingId: charlie!.id },
      { followerId: charlie!.id, followingId: diana!.id },
      { followerId: diana!.id, followingId: alice!.id },
    ],
  });

  // Création de posts sauvegardés
  await prisma.savedPost.createMany({
    data: [
      { userId: alice!.id, postId: postBob.id },
      { userId: bob!.id, postId: postCharlie.id },
      { userId: charlie!.id, postId: postDiana.id },
      { userId: diana!.id, postId: postAlice.id },
    ],
  });

  console.log("Seed terminé : utilisateurs, posts, likes, commentaires, follows, saved posts créés.");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
