"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type CartItem = {
  id: number;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
    } catch {
      setCart([]);
    }
  }, []);

  const update = (id: number, quantity: number) => {
    const updated = quantity <= 0
      ? cart.filter((item) => item.id !== id)
      : cart.map((item) => item.id === id ? { ...item, quantity } : item);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      alert("決済の準備中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-24 px-6">
        <p className="font-serif text-3xl font-light tracking-widest text-taupe-600 mb-3">
          Cart is Empty
        </p>
        <p className="text-taupe-400 text-xs tracking-widest mb-8">カートに商品がありません</p>
        <Link
          href="/"
          className="text-[10px] tracking-[0.25em] uppercase text-gold-500 hover:text-gold-700 border-b border-gold-400 pb-0.5 transition-colors"
        >
          View Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-serif text-3xl font-light tracking-widest text-taupe-900 mb-10">
        Shopping Cart
      </h1>

      <div className="divide-y divide-sand-200 border-t border-sand-200">
        {cart.map((item) => (
          <div key={item.id} className="flex gap-5 py-6">
            <div className="w-20 h-20 bg-sand-100 overflow-hidden relative flex-shrink-0 border border-sand-200">
              {item.imageUrl ? (
                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sand-300 text-xs">—</div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-serif text-base font-light tracking-wide text-taupe-800">{item.name}</p>
              <p className="text-taupe-400 text-xs mt-1 tracking-wider">¥{item.price.toLocaleString()}</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center border border-sand-300">
                  <button onClick={() => update(item.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center text-taupe-600 hover:bg-sand-100 text-sm transition-colors">−</button>
                  <span className="w-8 text-center text-xs text-taupe-800">{item.quantity}</span>
                  <button onClick={() => update(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center text-taupe-600 hover:bg-sand-100 text-sm transition-colors">＋</button>
                </div>
                <button onClick={() => update(item.id, 0)} className="text-[10px] tracking-widest uppercase text-taupe-400 hover:text-red-400 transition-colors">Remove</button>
              </div>
            </div>
            <div className="text-right flex-shrink-0 pt-1">
              <p className="font-serif text-base text-gold-600 tracking-wide">¥{(item.price * item.quantity).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-sand-300">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-[10px] tracking-[0.25em] uppercase text-taupe-500">Subtotal</span>
          <span className="font-serif text-2xl font-light text-taupe-900 tracking-wide">¥{total.toLocaleString()}</span>
        </div>
        <p className="text-[10px] tracking-wider text-taupe-400 mb-6">※ 送料別途</p>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-white py-4 text-xs tracking-[0.2em] uppercase transition-colors"
        >
          {loading ? "Processing..." : "Checkout"}
        </button>
        <Link href="/" className="block text-center mt-4 text-[10px] tracking-[0.2em] uppercase text-taupe-400 hover:text-taupe-600 transition-colors">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
