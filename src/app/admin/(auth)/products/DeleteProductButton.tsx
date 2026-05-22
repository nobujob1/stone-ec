"use client";

import { useRouter } from "next/navigation";

export default function DeleteProductButton({ id, name }: { id: number; name: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`「${name}」を削除しますか？`)) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <button onClick={handleDelete} className="text-red-400 hover:text-red-600 text-xs underline underline-offset-2">
      削除
    </button>
  );
}
