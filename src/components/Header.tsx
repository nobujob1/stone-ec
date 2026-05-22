"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartCount(cart.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0));
      } catch {
        setCartCount(0);
      }
    };
    updateCount();
    window.addEventListener("cartUpdated", updateCount);
    return () => window.removeEventListener("cartUpdated", updateCount);
  }, []);

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold tracking-wide text-stone-700">
          天然石ブレスレット
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">
            商品一覧
          </Link>
          <Link href="/cart" className="relative text-sm text-stone-600 hover:text-stone-900 transition-colors">
            カート
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-4 bg-stone-700 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
