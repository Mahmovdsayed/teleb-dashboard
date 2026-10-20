import ProductPage from "@/components/pages/products/ProductPage";
import ProductSkeleton from "@/components/skeletons/ProductSkeleton";
import { Suspense } from "react";

const Page = () => {
  return (
    <main>
      <Suspense fallback={<ProductSkeleton />}>
        <ProductPage />
      </Suspense>
    </main>
  );
};

export default Page;