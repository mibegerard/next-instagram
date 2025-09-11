import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function PATCH() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ updated: 0 });

  const result = await prisma.notification.updateMany({
    where: { userId: session.user.id, isRead: false },
    data: { isRead: true },
  });

  return NextResponse.json({ updated: result.count });
}
