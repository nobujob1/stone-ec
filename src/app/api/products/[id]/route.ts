import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: Number(id), published: true },
  });
  if (!product) return NextResponse.json({ error: "見つかりません" }, { status: 404 });
  return NextResponse.json(product);
}
