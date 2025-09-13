import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // -----------------------------
  // 1️⃣ Récupération des utilisateurs
  // -----------------------------
  const targetUser = await prisma.user.findUnique({ where: { username: "abbagerardmibekeumeni" } });
  const alice = await prisma.user.findUnique({ where: { username: "alice" } });
  const bob = await prisma.user.findUnique({ where: { username: "bob" } });

  if (!targetUser || !alice || !bob) {
    throw new Error("Certains utilisateurs sont manquants dans la base de données.");
  }

  // -----------------------------
  // 2️⃣ Récupération de tous les posts de l'utilisateur cible
  // -----------------------------
  const posts = await prisma.post.findMany({ where: { userId: targetUser.id } });
  if (posts.length === 0) {
    throw new Error("Aucun post trouvé pour l'utilisateur cible.");
  }

  for (const post of posts) {
    // -----------------------------
    // 3️⃣ Création des commentaires
    // -----------------------------
    await prisma.comment.create({
      data: {
        body: "J'adore ce post !",
        postId: post.id,
        userId: alice.id,
      },
    });

    await prisma.comment.create({
      data: {
        body: "Super contenu !",
        postId: post.id,
        userId: bob.id,
      },
    });

    // -----------------------------
    // 4️⃣ Création de tags multiples (sans 'type')
    // -----------------------------
    const tagsData = [
      { postId: post.id, userId: targetUser.id }, // Alice tague
      { postId: post.id, userId: targetUser.id }, // Bob tague
      { postId: post.id, userId: targetUser.id }, // Légende
      { postId: post.id, userId: targetUser.id }, // Autre contexte
    ];

    for (const tag of tagsData) {
      await prisma.postTag.create({ data: tag });
    }

    // -----------------------------
    // 5️⃣ Création des notifications
    // -----------------------------
    const notificationsData = [
      {
        type: "MENTION",
        message: `${alice.username} t’a mentionné dans un commentaire.`,
        userId: targetUser.id,
        fromId: alice.id,
        postId: post.id,
      },
      {
        type: "MENTION",
        message: `${bob.username} t’a mentionné dans un commentaire.`,
        userId: targetUser.id,
        fromId: bob.id,
        postId: post.id,
      },
      {
        type: "MENTION",
        message: `Tu as été mentionné dans la légende du post.`,
        userId: targetUser.id,
        fromId: targetUser.id, // tag automatique depuis la légende
        postId: post.id,
      },
    ];

    await prisma.notification.createMany({ data: notificationsData });
  }

  console.log("✅ Commentaires, tags multiples et notifications créés pour tous les posts !");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
