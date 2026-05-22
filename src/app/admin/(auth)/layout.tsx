import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default async function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-stone-100">
      <header className="bg-stone-800 text-white">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-semibold">管理画面</span>
          <nav className="flex items-center gap-6">
            <Link href="/admin" className="text-sm text-stone-300 hover:text-white transition-colors">ダッシュボード</Link>
            <Link href="/admin/products" className="text-sm text-stone-300 hover:text-white transition-colors">商品管理</Link>
            <Link href="/admin/orders" className="text-sm text-stone-300 hover:text-white transition-colors">注文管理</Link>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
