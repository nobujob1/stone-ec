import Header from "@/components/Header";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1 w-full">
        {children}
      </main>
      <footer className="border-t border-sand-200 bg-ivory mt-16">
        <div className="max-w-5xl mx-auto px-6 py-10 text-center">
          <p className="font-serif text-lg font-light tracking-widest text-taupe-600">
            天然石ブレスレット専門店
          </p>
          <p className="text-[10px] tracking-[0.25em] text-taupe-400 uppercase mt-1">
            Handcrafted Natural Stone Jewelry
          </p>
          <p className="text-xs text-taupe-400 mt-5">© 2025 天然石ブレスレット専門店</p>
        </div>
      </footer>
    </>
  );
}
