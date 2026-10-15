import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getBannerById } from "@/services/banner"
import EditBannerForm from "@/components/forms/banner/EditBannerForm"
import EditBannerSkeleton from "@/components/skeletons/EditBannerSkeleton"

interface IProps {
  params: Promise<{ id: string }>
}

export const instant = false

const BannerData = async ({ params }: IProps) => {
  const { id } = await params
  const banner = await getBannerById(id)
  if (!banner) notFound()

  const bannerData = Array.isArray(banner) ? banner[0] : banner
  if (!bannerData) notFound()

  return (
    <main className="flex flex-col justify-center text-center">
      <EditBannerForm key={id} id={id} banner={bannerData} />
    </main>
  )
}

const Page = ({ params }: IProps) => (
  <Suspense fallback={<EditBannerSkeleton />}>
    <BannerData params={params} />
  </Suspense>
)

export default Page