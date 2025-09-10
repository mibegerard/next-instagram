import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/messages : envoyer un message
export async function POST(req: Request) {
  const { senderId, receiverId, body } = await req.json();
  if (!senderId || !receiverId || !body) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const message = await prisma.Message.create({
    data: { senderId, receiverId, body }
  });
  return NextResponse.json(message);
}

// GET /api/messages/:userId : récupérer toutes les conversations d'un utilisateur
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }
  // Récupère toutes les conversations (groupées par utilisateur)
  const messages = await prisma.Message.findMany({
    where: {
      OR: [
        { senderId: userId },
        { receiverId: userId }
      ]
    },
    orderBy: { createdAt: "asc" },
    include: {
      sender: { select: { id: true, username: true, image: true } },
      receiver: { select: { id: true, username: true, image: true } }
    }
  });
  return NextResponse.json(messages);
}
