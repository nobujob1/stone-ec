import ProductForm from "@/components/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-700 mb-6">商品を追加</h1>
      <ProductForm />
    </div>
  );
}
