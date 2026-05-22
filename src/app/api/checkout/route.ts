import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
};

export async function POST(req: Request) {
  const { items }: { items: CartItem[] } = await req.json();
  if (!items || items.length === 0) {
    return NextResponse.json({ error: "カートが空です" }, { status: 400 });
  }

  const productIds = items.map((i) => i.id);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, published: true },
  });

  const lineItems = items.map((item) => {
    const product = products.find((p) => p.id === item.id);
    if (!product) throw new Error(`商品が見つかりません: ${item.id}`);
    if (product.stock < item.quantity) throw new Error(`在庫不足: ${product.name}`);
    return {
      price_data: {
        currency: "jpy",
        product_data: {
          name: product.name,
          ...(product.imageUrl ? { images: [product.imageUrl] } : {}),
        },
        unit_amount: product.price,
      },
      quantity: item.quantity,
    };
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/cart`,
    billing_address_collection: "required",
    shipping_address_collection: { allowed_countries: ["JP"] },
  });

  return NextResponse.json({ url: session.url });
}
