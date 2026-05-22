import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "未認証" }, { status: 401 });

  const { id } = await params;
  const { status } = await req.json();

  const order = await prisma.order.update({
    where: { id: Number(id) },
    data: { status },
  });
  return NextResponse.json(order);
}
