import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const target = await prisma.user.findUnique({ where: { username: "abbagerardmibekeumeni" } });
  const alice = await prisma.user.findUnique({ where: { username: "alice" } });
  const bob = await prisma.user.findUnique({ where: { username: "bob" } });
  const charlie = await prisma.user.findUnique({ where: { username: "charlie" } });
  const diana = await prisma.user.findUnique({ where: { username: "diana" } });

  if (!target || !alice || !bob || !charlie || !diana) {
    throw new Error("Certains utilisateurs sont manquants");
  }

  const post = await prisma.post.findFirst({ where: { userId: target.id } });

  await prisma.notification.createMany({
    data: [
      {
        type: "LIKE",
        message: `${alice.username} a aimé ton post`,
        userId: target.id,
        fromId: alice.id,
        postId: post?.id,
      },
      {
        type: "COMMENT",
        message: `${bob.username} a commenté ton post`,
        userId: target.id,
        fromId: bob.id,
        postId: post?.id,
      },
      {
        type: "FOLLOW",
        message: `${charlie.username} a commencé à te suivre`,
        userId: target.id,
        fromId: charlie.id,
      },
      {
        type: "MENTION",
        message: `${diana.username} t’a mentionné dans un post`,
        userId: target.id,
        fromId: diana.id,
        postId: post?.id,
      },
    ],
  });

  console.log("✅ Notifications créées avec succès");
}

main().finally(() => prisma.$disconnect());
