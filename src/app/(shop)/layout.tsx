import Header from "@/components/Header";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {children}
      </main>
      <footer className="border-t border-stone-200 bg-white mt-12">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-sm text-stone-500">
          © 2025 天然石ブレスレット専門店
        </div>
      </footer>
    </>
  );
}
