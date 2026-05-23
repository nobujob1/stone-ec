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
    <header className="bg-cream border-b border-sand-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="font-serif text-2xl font-light tracking-widest text-taupe-900">
            天然石ブレスレット
          </span>
          <span className="text-[10px] tracking-[0.3em] text-taupe-400 uppercase mt-0.5">
            Natural Stone Bracelet
          </span>
        </Link>
        <nav className="flex items-center gap-8">
          <Link
            href="/"
            className="text-xs tracking-[0.15em] text-taupe-600 hover:text-taupe-900 transition-colors uppercase"
          >
            Collection
          </Link>
          <Link
            href="/cart"
            className="relative text-xs tracking-[0.15em] text-taupe-600 hover:text-taupe-900 transition-colors uppercase"
          >
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-4 bg-gold-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-medium">
                {cartCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
