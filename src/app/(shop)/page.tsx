import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function TopPage() {
  const products = await prisma.product.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-700 mb-2">商品一覧</h1>
      <p className="text-stone-500 mb-8">天然石を使ったハンドメイドブレスレット</p>

      {products.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <p className="text-lg">現在、商品の準備中です</p>
          <p className="text-sm mt-2">もうしばらくお待ちください</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group">
              <div className="bg-white rounded-lg overflow-hidden border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-square bg-stone-100 relative overflow-hidden">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="font-medium text-stone-800 group-hover:text-stone-600 transition-colors">{product.name}</h2>
                  <p className="text-stone-500 text-sm mt-1 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-semibold text-stone-700">¥{product.price.toLocaleString()}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${product.stock > 0 ? "bg-stone-100 text-stone-600" : "bg-red-50 text-red-400"}`}>
                      {product.stock > 0 ? "在庫あり" : "売り切れ"}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
