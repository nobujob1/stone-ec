import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "未認証" }, { status: 401 });

  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "未認証" }, { status: 401 });

  const { name, description, price, stock, imageUrl, published } = await req.json();
  if (!name || !price) {
    return NextResponse.json({ error: "商品名と価格は必須です" }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: { name, description: description ?? "", price: Number(price), stock: Number(stock ?? 0), imageUrl, published: published ?? true },
  });
  return NextResponse.json(product, { status: 201 });
}
