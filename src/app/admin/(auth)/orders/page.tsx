import { prisma } from "@/lib/prisma";
import OrderStatusSelect from "./OrderStatusSelect";

const statusLabel: Record<string, string> = {
  pending: "確認待ち",
  paid: "支払い済み",
  shipped: "発送済み",
  cancelled: "キャンセル",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-700 mb-6">注文管理</h1>
      {orders.length === 0 ? (
        <p className="text-stone-400">注文がまだありません</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg border border-stone-100 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-stone-800">#{order.id} — {order.customerName}</p>
                  <p className="text-sm text-stone-500">{order.customerEmail}</p>
                  <p className="text-sm text-stone-400 mt-1">{new Date(order.createdAt).toLocaleString("ja-JP")}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-stone-700">¥{order.totalAmount.toLocaleString()}</p>
                  <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                </div>
              </div>
              <div className="mt-4 border-t border-stone-100 pt-4 space-y-1">
                {order.items.map((item) => (
                  <p key={item.id} className="text-sm text-stone-600">
                    {item.product.name} × {item.quantity} — ¥{(item.price * item.quantity).toLocaleString()}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
