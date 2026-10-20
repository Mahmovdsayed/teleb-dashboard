import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getOfferById } from "@/services/offer";
import EditOfferForm from "@/components/forms/offer/EditOfferForm";
import EditOfferSkeleton from "@/components/skeletons/EditOfferSkeleton";

interface IProps {
  params: Promise<{ id: string }>;
}

const OfferData = async ({ params }: IProps) => {
  const { id } = await params;
  const offer = await getOfferById(id);
  if (!offer) notFound();

  const offerData = Array.isArray(offer) ? offer[0] : offer;
  if (!offerData) notFound();

  return (
    <main className="flex flex-col justify-center text-center">
      <EditOfferForm key={id} id={id} offer={offerData} />
    </main>
  );
};

const Page = ({ params }: IProps) => (
  <Suspense fallback={<EditOfferSkeleton />}>
    <OfferData params={params} />
  </Suspense>
);

export default Page;