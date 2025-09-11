import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json([], { status: 401 });

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    include: { from: true, post: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(notifications);
}
