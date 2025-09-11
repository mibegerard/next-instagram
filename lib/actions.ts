"use server";

import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  BookmarkSchema,
  CreateComment,
  CreatePost,
  DeleteComment,
  DeletePost,
  FollowUser,
  LikeSchema,
  UpdatePost,
  UpdateUser,
} from "./schemas";

/* ------------------ POSTS ------------------ */

// Créer un post
export async function createPost(values: z.infer<typeof CreatePost>) {
  const userId = await getUserId();
  if (!userId) return { error: "Non authentifié." };

  const validated = CreatePost.safeParse(values);
  if (!validated.success) return { error: "Données invalides." };

  const { fileUrl, caption } = validated.data;

  await prisma.post.create({
    data: { caption, fileUrl, userId },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

// Modifier un post
export async function updatePost(values: z.infer<typeof UpdatePost>) {
  const userId = await getUserId();
  if (!userId) return { error: "Non authentifié." };

  const validated = UpdatePost.safeParse(values);
  if (!validated.success) return { error: "Données invalides." };

  const { id, caption, fileUrl } = validated.data;

  const post = await prisma.post.findUnique({ where: { id, userId } });
  if (!post) return { error: "Post introuvable ou non autorisé." };

  await prisma.post.update({ where: { id }, data: { caption, fileUrl } });

  revalidatePath("/dashboard");
  return { success: true };
}

// Supprimer un post et ses dépendances
export async function deletePost(values: z.infer<typeof DeletePost>) {
  const userId = await getUserId();
  if (!userId) return { error: "Non authentifié." };

  const validated = DeletePost.safeParse(values);
  if (!validated.success) return { error: "Données invalides." };

  const { id } = validated.data;
  const post = await prisma.post.findUnique({ where: { id, userId } });
  if (!post) return { error: "Post introuvable ou non autorisé." };

  await prisma.like.deleteMany({ where: { postId: id } });
  await prisma.comment.deleteMany({ where: { postId: id } });
  await prisma.savedPost.deleteMany({ where: { postId: id } });
  await prisma.post.delete({ where: { id } });

  revalidatePath("/dashboard");
  return { success: true };
}

// Like/unlike un post
export async function likePost(values: z.infer<typeof LikeSchema>) {
  const userId = await getUserId();
  if (!userId) return { error: "Non authentifié." };

  const validated = LikeSchema.safeParse(values);
  if (!validated.success) return { error: "Données invalides." };

  const { postId } = validated.data;
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return { error: "Post introuvable." };

  const existing = await prisma.like.findUnique({
    where: { postId_userId: { postId, userId } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    revalidatePath(`/p/${postId}`);
    return { success: true, liked: false };
  }

  await prisma.like.create({ data: { postId, userId } });

  if (post.userId !== userId) {
    await createLikeNotification(post.userId, userId, postId);
  }

  revalidatePath(`/p/${postId}`);
  return { success: true, liked: true };
}

// Sauvegarder/un-sauvegarder un post
export async function bookmarkPost(values: z.infer<typeof BookmarkSchema>) {
  const userId = await getUserId();
  if (!userId) return { error: "Non authentifié." };

  const validated = BookmarkSchema.safeParse(values);
  if (!validated.success) return { error: "Données invalides." };

  const { postId } = validated.data;
  const existing = await prisma.savedPost.findUnique({
    where: { postId_userId: { postId, userId } },
  });

  if (existing) {
    await prisma.savedPost.delete({ where: { postId_userId: { postId, userId } } });
    revalidatePath("/dashboard");
    return { success: true, bookmarked: false };
  }

  await prisma.savedPost.create({ data: { postId, userId } });
  revalidatePath("/dashboard");
  return { success: true, bookmarked: true };
}

/* ------------------ COMMENTS ------------------ */

// Créer un commentaire
export async function createComment(values: z.infer<typeof CreateComment>) {
  const userId = await getUserId();
  if (!userId) return { error: "Non authentifié." };

  const validated = CreateComment.safeParse(values);
  if (!validated.success) return { error: "Données invalides." };

  const { postId, body } = validated.data;
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return { error: "Post introuvable." };

  await prisma.comment.create({ data: { body, postId, userId } });

  if (post.userId !== userId) {
    await createCommentNotification(post.userId, userId, postId);
  }

  const mentionedUsernames = body.match(/@([a-zA-Z0-9_]+)/g)?.map((m) => m.slice(1)) || [];
  for (const username of mentionedUsernames) {
    const mentionedUser = await prisma.user.findUnique({ where: { username } });
    if (mentionedUser && mentionedUser.id !== userId) {
      await createMentionNotification(mentionedUser.id, userId, postId);
    }
  }

  revalidatePath(`/p/${postId}`);
  return { success: true };
}

// Supprimer un commentaire
export async function deleteComment(values: z.infer<typeof DeleteComment>) {
  const userId = await getUserId();
  if (!userId) return { error: "Non authentifié." };

  const validated = DeleteComment.safeParse(values);
  if (!validated.success) return { error: "Données invalides." };

  const { id } = validated.data;
  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) return { error: "Commentaire introuvable." };

  const post = await prisma.post.findUnique({ where: { id: comment.postId } });
  if (!post) return { error: "Post lié introuvable." };

  if (comment.userId !== userId && post.userId !== userId) {
    return { error: "Non autorisé." };
  }

  await prisma.comment.delete({ where: { id } });
  revalidatePath(`/p/${comment.postId}`);
  return { success: true };
}

/* ------------------ USERS ------------------ */

// Modifier le profil utilisateur
export async function updateUser(values: z.infer<typeof UpdateUser>) {
  const userId = await getUserId();
  if (!userId) return { error: "Non authentifié." };

  const validated = UpdateUser.safeParse(values);
  if (!validated.success) return { error: "Données invalides." };

  const { username, email, bio, image, name, website } = validated.data;

  if (username) {
    const existing = await prisma.user.findFirst({ where: { username, id: { not: userId } } });
    if (existing) return { error: "Nom d'utilisateur déjà pris." };
  }

  if (email) {
    const existing = await prisma.user.findFirst({ where: { email, id: { not: userId } } });
    if (existing) return { error: "Email déjà utilisé." };
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { username, email, bio, image, name, website },
  });

  revalidatePath(`/profile/${username || userId}`);
  return { success: true, user: updated };
}

// Follow/unfollow un utilisateur
export async function followUser(values: z.infer<typeof FollowUser>) {
  const userId = await getUserId();
  if (!userId) return { error: "Non authentifié." };

  const validated = FollowUser.safeParse(values);
  if (!validated.success) return { error: "Données invalides." };

  const { id: targetId } = validated.data;
  if (userId === targetId) return { error: "Impossible de se suivre soi-même." };

  const existing = await prisma.follows.findUnique({
    where: { followerId_followingId: { followerId: userId, followingId: targetId } },
  });

  if (existing) {
    await prisma.follows.delete({ where: { followerId_followingId: { followerId: userId, followingId: targetId } } });
    revalidatePath("/dashboard");
    return { success: true, following: false };
  }

  await prisma.follows.create({ data: { followerId: userId, followingId: targetId } });
  await createFollowNotification(targetId, userId);

  revalidatePath("/dashboard");
  return { success: true, following: true };
}

/* ------------------ NOTIFICATIONS ------------------ */

export async function createMentionNotification(userId: string, fromId: string, postId: string) {
  await prisma.notification.create({
    data: { type: "MENTION", message: "vous a mentionné dans une publication", userId, fromId, postId },
  });
}

export async function createCommentNotification(userId: string, fromId: string, postId: string) {
  await prisma.notification.create({
    data: { type: "COMMENT", message: "a commenté votre publication", userId, fromId, postId },
  });
}

export async function createFollowNotification(userId: string, fromId: string) {
  await prisma.notification.create({
    data: { type: "FOLLOW", message: "a commencé à vous suivre", userId, fromId },
  });
}

export async function createLikeNotification(userId: string, fromId: string, postId: string) {
  await prisma.notification.create({
    data: { type: "LIKE", message: "a aimé votre publication", userId, fromId, postId },
  });
}
