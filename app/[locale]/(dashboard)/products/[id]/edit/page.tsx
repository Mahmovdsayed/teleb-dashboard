import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProductById } from "@/services/product";
import EditProductForm from "@/components/forms/product/EditProductForm";
import EditProductSkeleton from "@/components/skeletons/EditProductSkeleton";

interface IProps {
  params: Promise<{ id: string; locale: string }>;
}

export const instant = false;

const ProductEditData = async ({ params }: IProps) => {
  const { id, locale } = await params;
  const product = await getProductById(id, locale);
  if (!product) notFound();

  return (
    <main className="flex flex-col justify-center text-center">
      <EditProductForm key={id} id={id} product={product} />
    </main>
  );
};

const Page = ({ params }: IProps) => {
  return (
    <Suspense fallback={<EditProductSkeleton />}>
      <ProductEditData params={params} />
    </Suspense>
  );
};

export default Page;