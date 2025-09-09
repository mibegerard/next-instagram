import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() || "";
  if (!q) {
    return NextResponse.json({ results: [] });
  }

  // Recherche utilisateurs
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: q, mode: "insensitive" } },
        { name: { contains: q, mode: "insensitive" } },
      ],
    },
    select: { username: true, name: true },
    take: 10,
  });

  // Recherche posts
  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { caption: { contains: q, mode: "insensitive" } },
        { fileUrl: { contains: q, mode: "insensitive" } },
      ],
    },
    select: { id: true, caption: true },
    take: 10,
  });

  // Recherche hashtags (mock)
  const hashtags = q.startsWith("#")
    ? [{ tag: q.replace("#", "") }]
    : [];

  const results = [
    ...users.map(u => ({ type: "user", ...u })),
    ...posts.map(p => ({ type: "post", ...p })),
    ...hashtags.map(h => ({ type: "hashtag", ...h })),
  ];

  return NextResponse.json({ results });
}
