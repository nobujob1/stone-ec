import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

export const config = { api: { bodyParser: false } };

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "署名なし" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "署名検証失敗" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { expand: ["data.price.product"] });

    const orderItems = lineItems.data.map((item) => {
      const product = item.price?.product as Stripe.Product;
      return {
        productId: Number(product.metadata?.productId ?? 0),
        quantity: item.quantity ?? 1,
        price: item.price?.unit_amount ?? 0,
      };
    });

    await prisma.order.create({
      data: {
        stripeSessionId: session.id,
        customerEmail: session.customer_details?.email ?? "",
        customerName: session.customer_details?.name ?? "",
        totalAmount: session.amount_total ?? 0,
        status: "paid",
        items: { create: orderItems },
      },
    });
  }

  return NextResponse.json({ received: true });
}
