"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type ProductFormData = {
  name: string;
  description: string;
  price: string;
  stock: string;
  imageUrl: string;
  published: boolean;
};

type Props = {
  initialData?: Partial<ProductFormData>;
  productId?: number;
};

export default function ProductForm({ initialData, productId }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<ProductFormData>({
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    price: initialData?.price ?? "",
    stock: initialData?.stock ?? "0",
    imageUrl: initialData?.imageUrl ?? "",
    published: initialData?.published ?? true,
  });
  const [previewUrl, setPreviewUrl] = useState<string>(initialData?.imageUrl ?? "");
  const [uploadError, setUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) {
        setForm((f) => ({ ...f, imageUrl: data.url }));
      } else {
        setUploadError(data.error ?? "アップロードに失敗しました");
        setPreviewUrl(form.imageUrl);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch {
      setUploadError("アップロードに失敗しました");
      setPreviewUrl(form.imageUrl);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const url = productId ? `/api/admin/products/${productId}` : "/api/admin/products";
      const method = productId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
          imageUrl: form.imageUrl || null,
        }),
      });
      if (res.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch {
      setError("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      <div>
        <label className="block text-sm text-stone-600 mb-1">商品名 *</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
        />
      </div>
      <div>
        <label className="block text-sm text-stone-600 mb-1">説明</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={4}
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 resize-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-stone-600 mb-1">価格（円） *</label>
          <input
            type="number"
            min="1"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>
        <div>
          <label className="block text-sm text-stone-600 mb-1">在庫数</label>
          <input
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm text-stone-600 mb-1">商品画像</label>
        {previewUrl && (
          <div className="mb-2 relative w-40 h-40 rounded-lg overflow-hidden border border-stone-200">
            <Image src={previewUrl} alt="プレビュー" fill className="object-cover" unoptimized />
          </div>
        )}
        <label className="flex items-center gap-2 cursor-pointer w-fit">
          <span className="border border-stone-300 text-stone-600 px-4 py-2 rounded-lg text-sm hover:bg-stone-50 transition-colors">
            {uploading ? "アップロード中..." : "画像を選択"}
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
        {uploadError && <p className="text-red-500 text-xs mt-1">{uploadError}</p>}
        <p className="text-xs text-stone-400 mt-1">JPEG・PNG・WebP・GIF（上限10MB）</p>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="published"
          checked={form.published}
          onChange={(e) => setForm({ ...form, published: e.target.checked })}
          className="rounded border-stone-300"
        />
        <label htmlFor="published" className="text-sm text-stone-600">公開する</label>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading || uploading}
          className="bg-stone-700 text-white px-6 py-2 rounded-lg text-sm hover:bg-stone-800 transition-colors disabled:opacity-50"
        >
          {loading ? "保存中..." : "保存する"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-stone-300 text-stone-600 px-6 py-2 rounded-lg text-sm hover:bg-stone-50 transition-colors"
        >
          キャンセル
        </button>
      </div>
    </form>
  );
}
