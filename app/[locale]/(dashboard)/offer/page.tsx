import OfferPage from "@/components/pages/offer/OfferPage";
import OfferSkeleton from "@/components/skeletons/OfferSkeleton";
import { Suspense } from "react";

export const instant = false

const page = () => {
  return <>
    <Suspense fallback={<OfferSkeleton />}>
      <OfferPage />
    </Suspense>
  </>;
};

export default page;