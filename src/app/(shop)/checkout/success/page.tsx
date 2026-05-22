"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  useEffect(() => {
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cartUpdated"));
  }, []);

  return (
    <div className="text-center py-20">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-2xl font-semibold text-stone-800 mb-2">ご注文ありがとうございます</h1>
      <p className="text-stone-500 mb-8">注文確認メールをお送りしました</p>
      <Link href="/" className="bg-stone-700 text-white py-3 px-8 rounded-lg hover:bg-stone-800 transition-colors font-medium">
        商品一覧に戻る
      </Link>
    </div>
  );
}
