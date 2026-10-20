import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProductById } from "@/services/product";
import { getCollections } from "@/services/collection";
import { getOffers } from "@/services/offer";
import ProductViewPage from "@/components/pages/products/ProductViewPage";
import EditProductSkeleton from "@/components/skeletons/EditProductSkeleton";

interface IProps {
  params: Promise<{ id: string; locale: string }>;
}

const ProductViewData = async ({ params }: IProps) => {
  const { id, locale } = await params;
  const [product, collections, offersRes] = await Promise.all([
    getProductById(id, locale),
    getCollections().catch(() => []),
    getOffers({ limit: 100 }, locale).catch(() => ({ data: [], total: 0 })),
  ]);

  if (!product) notFound();

  return (
    <ProductViewPage
      product={product}
      collections={collections}
      offers={offersRes.data}
    />
  );
};

const Page = ({ params }: IProps) => {
  return (
    <Suspense fallback={<EditProductSkeleton />}>
      <ProductViewData params={params} />
    </Suspense>
  );
};

export default Page;
