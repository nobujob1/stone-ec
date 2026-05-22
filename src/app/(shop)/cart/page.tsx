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
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("決済の準備中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-stone-400 text-lg">カートは空です</p>
        <Link href="/" className="mt-4 inline-block text-stone-600 hover:text-stone-800 underline underline-offset-2">
          商品一覧を見る
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-stone-700 mb-6">カート</h1>
      <div className="space-y-4">
        {cart.map((item) => (
          <div key={item.id} className="bg-white rounded-lg border border-stone-100 p-4 flex gap-4">
            <div className="w-20 h-20 bg-stone-100 rounded-md overflow-hidden relative flex-shrink-0">
              {item.imageUrl ? (
                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-300 text-xs">画像なし</div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-stone-800">{item.name}</p>
              <p className="text-stone-600 text-sm mt-1">¥{item.price.toLocaleString()}</p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center border border-stone-200 rounded">
                  <button onClick={() => update(item.id, item.quantity - 1)} className="px-2 py-1 text-stone-600 hover:bg-stone-50 text-sm">−</button>
                  <span className="px-3 py-1 text-sm">{item.quantity}</span>
                  <button onClick={() => update(item.id, item.quantity + 1)} className="px-2 py-1 text-stone-600 hover:bg-stone-50 text-sm">＋</button>
                </div>
                <button onClick={() => update(item.id, 0)} className="text-xs text-stone-400 hover:text-red-400 transition-colors">削除</button>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-semibold text-stone-700">¥{(item.price * item.quantity).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-white rounded-lg border border-stone-100 p-4">
        <div className="flex justify-between text-lg font-semibold text-stone-800">
          <span>合計</span>
          <span>¥{total.toLocaleString()}</span>
        </div>
        <p className="text-xs text-stone-400 mt-1">※ 送料は別途かかります</p>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full mt-4 bg-stone-700 text-white py-3 rounded-lg hover:bg-stone-800 transition-colors font-medium disabled:opacity-50"
        >
          {loading ? "準備中..." : "Stripeで決済する"}
        </button>
      </div>
    </div>
  );
}
