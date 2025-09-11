import prisma from "./prisma";

export async function createLikeNotification(userId: string, fromId: string, postId: string) {
  return prisma.Notification.create({
    data: {
      type: "LIKE",
      message: "Un utilisateur a liké ton post.",
      userId,
      fromId,
      postId,
    },
  });
}

export async function createCommentNotification(userId: string, fromId: string, postId: string) {
  return prisma.notification.create({
    data: {
      type: "COMMENT",
      message: "Un utilisateur a commenté ton post.",
      userId,
      fromId,
      postId,
    },
  });
}

export async function createFollowNotification(userId: string, fromId: string) {
  return prisma.Notification.create({
    data: {
      type: "FOLLOW",
      message: "Un utilisateur a commencé à te suivre.",
      userId,
      fromId,
    },
  });
}

export async function createMentionNotification(userId: string, fromId: string, postId: string) {
  return prisma.Notification.create({
    data: {
      type: "MENTION",
      message: "Un utilisateur t'a mentionné dans un post.",
      userId,
      fromId,
      postId,
    },
  });
}
