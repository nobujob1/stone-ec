import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteProductButton from "./DeleteProductButton";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-stone-700">商品管理</h1>
        <Link
          href="/admin/products/new"
          className="bg-stone-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-stone-800 transition-colors"
        >
          ＋ 新しい商品を追加
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-stone-400">商品がまだありません</p>
      ) : (
        <div className="bg-white rounded-lg border border-stone-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr>
                <th className="text-left px-4 py-3 text-stone-600 font-medium">商品名</th>
                <th className="text-right px-4 py-3 text-stone-600 font-medium">価格</th>
                <th className="text-right px-4 py-3 text-stone-600 font-medium">在庫</th>
                <th className="text-left px-4 py-3 text-stone-600 font-medium">公開</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 text-stone-800 font-medium">{product.name}</td>
                  <td className="px-4 py-3 text-stone-700 text-right">¥{product.price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-stone-600 text-right">{product.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${product.published ? "bg-green-50 text-green-600" : "bg-stone-100 text-stone-500"}`}>
                      {product.published ? "公開中" : "非公開"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Link href={`/admin/products/${product.id}/edit`} className="text-stone-500 hover:text-stone-700 text-xs underline underline-offset-2">
                      編集
                    </Link>
                    <DeleteProductButton id={product.id} name={product.name} />
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
