import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const [productCount, orderCount, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const statusLabel: Record<string, string> = {
    pending: "確認待ち",
    paid: "支払い済み",
    shipped: "発送済み",
    cancelled: "キャンセル",
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-700 mb-6">ダッシュボード</h1>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-lg p-6 border border-stone-100">
          <p className="text-sm text-stone-500">商品数</p>
          <p className="text-3xl font-bold text-stone-800 mt-1">{productCount}</p>
          <Link href="/admin/products" className="text-xs text-stone-500 hover:text-stone-700 mt-2 inline-block underline underline-offset-2">
            商品管理 →
          </Link>
        </div>
        <div className="bg-white rounded-lg p-6 border border-stone-100">
          <p className="text-sm text-stone-500">注文数</p>
          <p className="text-3xl font-bold text-stone-800 mt-1">{orderCount}</p>
          <Link href="/admin/orders" className="text-xs text-stone-500 hover:text-stone-700 mt-2 inline-block underline underline-offset-2">
            注文管理 →
          </Link>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-stone-700 mb-3">最新の注文</h2>
      {recentOrders.length === 0 ? (
        <p className="text-stone-400 text-sm">注文がまだありません</p>
      ) : (
        <div className="bg-white rounded-lg border border-stone-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr>
                <th className="text-left px-4 py-3 text-stone-600 font-medium">注文ID</th>
                <th className="text-left px-4 py-3 text-stone-600 font-medium">顧客</th>
                <th className="text-right px-4 py-3 text-stone-600 font-medium">合計</th>
                <th className="text-left px-4 py-3 text-stone-600 font-medium">ステータス</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 text-stone-500">#{order.id}</td>
                  <td className="px-4 py-3 text-stone-800">{order.customerName}</td>
                  <td className="px-4 py-3 text-stone-700 text-right">¥{order.totalAmount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-stone-100 text-stone-600 rounded text-xs">
                      {statusLabel[order.status] ?? order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
