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
    <>
      <section className="bg-gradient-to-b from-sand-100 to-cream py-20 text-center border-b border-sand-200">
        <div className="max-w-2xl mx-auto px-6">
          <p className="text-[10px] tracking-[0.4em] text-gold-500 uppercase mb-6">
            Natural Stone Collection
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-light text-taupe-900 leading-tight tracking-wide">
            天然石の輝きを<br />
            <em className="not-italic">日常に</em>
          </h1>
          <div className="flex items-center justify-center gap-4 my-7">
            <span className="block h-px w-12 bg-gold-400"></span>
            <span className="text-gold-400 text-sm">✦</span>
            <span className="block h-px w-12 bg-gold-400"></span>
          </div>
          <p className="text-sm text-taupe-500 tracking-wider leading-relaxed font-light">
            一点一点丁寧に仕上げた、天然石のハンドメイドブレスレット
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-2xl font-light tracking-widest text-taupe-400">準備中</p>
            <p className="text-sm mt-3 tracking-wider text-taupe-400">もうしばらくお待ちください</p>
          </div>
        ) : (
          <>
            <p className="text-center text-[10px] tracking-[0.35em] text-taupe-400 uppercase mb-10">
              All Items — {products.length} pieces
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {products.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`} className="group">
                  <div className="bg-ivory border border-sand-200 overflow-hidden transition-all duration-300 hover:border-gold-400 hover:shadow-[0_4px_24px_rgba(196,154,108,0.15)]">
                    <div className="aspect-square bg-sand-100 relative overflow-hidden">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sand-300">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.75} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h2 className="font-serif text-base font-light tracking-wide text-taupe-800 group-hover:text-taupe-900 transition-colors leading-snug">
                        {product.name}
                      </h2>
                      <p className="text-taupe-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-sand-200">
                        <span className="font-serif text-base text-gold-600 tracking-wide">
                          ¥{product.price.toLocaleString()}
                        </span>
                        <span className={`text-[10px] tracking-wider px-2 py-0.5 border ${
                          product.stock > 0
                            ? "text-taupe-500 border-sand-300"
                            : "text-red-300 border-red-100"
                        }`}>
                          {product.stock > 0 ? "In Stock" : "Sold Out"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
