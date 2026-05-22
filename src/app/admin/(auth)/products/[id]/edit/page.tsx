import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductForm from "@/components/ProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id: Number(id) } });
  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-700 mb-6">商品を編集</h1>
      <ProductForm
        productId={product.id}
        initialData={{
          name: product.name,
          description: product.description,
          price: String(product.price),
          stock: String(product.stock),
          imageUrl: product.imageUrl ?? "",
          published: product.published,
        }}
      />
    </div>
  );
}
