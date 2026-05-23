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
        <p className="text-taupe-400 text-sm tracking-widest">読み込み中...</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item: { id: number }) => item.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl, quantity });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link
        href="/"
        className="text-[10px] tracking-[0.25em] text-taupe-400 hover:text-gold-500 uppercase transition-colors mb-10 inline-block"
      >
        ← Collection
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        <div className="aspect-square bg-sand-100 overflow-hidden relative border border-sand-200">
          {product.imageUrl ? (
            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sand-300">
              <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.75} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        <div className="flex flex-col py-2">
          <p className="text-[10px] tracking-[0.3em] text-gold-500 uppercase mb-3">
            Natural Stone Bracelet
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-light text-taupe-900 tracking-wide leading-snug">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 my-5">
            <span className="block h-px w-8 bg-gold-400"></span>
            <span className="text-gold-400 text-xs">✦</span>
          </div>

          <p className="font-serif text-3xl font-light text-gold-600 tracking-wider">
            ¥{product.price.toLocaleString()}
          </p>

          <p className="text-taupe-500 mt-5 leading-loose text-sm font-light tracking-wide">
            {product.description}
          </p>

          {product.stock > 0 ? (
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-6">
                <span className="text-[10px] tracking-[0.25em] text-taupe-500 uppercase">Qty</span>
                <div className="flex items-center border border-sand-300">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center text-taupe-600 hover:bg-sand-100 transition-colors"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm text-taupe-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-9 h-9 flex items-center justify-center text-taupe-600 hover:bg-sand-100 transition-colors"
                  >
                    ＋
                  </button>
                </div>
                <span className="text-[10px] tracking-wider text-taupe-400">残り {product.stock} 点</span>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-gold-500 hover:bg-gold-600 text-white py-4 text-xs tracking-[0.2em] uppercase transition-colors"
              >
                {added ? "✓  Added to Cart" : "Add to Cart"}
              </button>

              <button
                onClick={() => { handleAddToCart(); router.push("/cart"); }}
                className="w-full border border-taupe-800 text-taupe-800 hover:bg-taupe-800 hover:text-cream py-4 text-xs tracking-[0.2em] uppercase transition-colors"
              >
                Buy Now
              </button>
            </div>
          ) : (
            <div className="mt-8 border border-red-100 text-red-300 text-center py-4 text-xs tracking-[0.2em] uppercase">
              Sold Out
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
