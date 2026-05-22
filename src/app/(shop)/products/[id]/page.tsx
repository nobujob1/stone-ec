"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string | null;
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then((r) => r.json())
      .then(setProduct);
  }, [params.id]);

  if (!product) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-stone-400">読み込み中...</div>
      </div>
    );
  }

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item: { id: number }) => item.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div>
      <Link href="/" className="text-sm text-stone-500 hover:text-stone-700 mb-6 inline-block">
        ← 商品一覧に戻る
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="aspect-square bg-stone-100 rounded-lg overflow-hidden relative">
          {product.imageUrl ? (
            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-300">
              <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold text-stone-800">{product.name}</h1>
          <p className="text-2xl font-bold text-stone-700 mt-3">¥{product.price.toLocaleString()}</p>
          <p className="text-stone-600 mt-4 leading-relaxed">{product.description}</p>

          {product.stock > 0 ? (
            <>
              <div className="flex items-center gap-4 mt-6">
                <label className="text-sm text-stone-600">数量</label>
                <div className="flex items-center border border-stone-200 rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-stone-600 hover:bg-stone-50"
                  >
                    −
                  </button>
                  <span className="px-4 py-1 text-stone-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-1 text-stone-600 hover:bg-stone-50"
                  >
                    ＋
                  </button>
                </div>
                <span className="text-xs text-stone-400">在庫: {product.stock}点</span>
              </div>
              <button
                onClick={handleAddToCart}
                className="mt-6 bg-stone-700 text-white py-3 px-6 rounded-lg hover:bg-stone-800 transition-colors font-medium"
              >
                {added ? "✓ カートに追加しました" : "カートに追加する"}
              </button>
              <button
                onClick={() => { handleAddToCart(); router.push("/cart"); }}
                className="mt-3 border border-stone-700 text-stone-700 py-3 px-6 rounded-lg hover:bg-stone-50 transition-colors font-medium"
              >
                すぐに購入する
              </button>
            </>
          ) : (
            <div className="mt-6 bg-red-50 text-red-400 text-center py-3 rounded-lg">
              売り切れ
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
