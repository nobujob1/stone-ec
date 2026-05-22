"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <button onClick={handleLogout} className="text-sm text-stone-300 hover:text-white transition-colors">
      ログアウト
    </button>
  );
}
