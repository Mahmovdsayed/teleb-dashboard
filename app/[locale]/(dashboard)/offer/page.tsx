import OfferPage from "@/components/pages/offer/OfferPage";
import OfferSkeleton from "@/components/skeletons/OfferSkeleton";
import { Suspense } from "react";

const page = () => {
  return <>
    <Suspense fallback={<OfferSkeleton />}>
      <OfferPage />
    </Suspense>
  </>;
};

export default page;