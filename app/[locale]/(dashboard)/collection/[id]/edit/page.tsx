import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getCollectionById } from "@/services/collection"
import EditCollectionForm from "@/components/forms/collection/EditCollectionForm"
import EditCollectionSkeleton from "@/components/skeletons/EditCollectionSkeleton"

interface IProps {
  params: Promise<{ id: string }>
}

const CollectionData = async ({ params }: IProps) => {
  const { id } = await params
  const collection = await getCollectionById(id)
  if (!collection) notFound()

  const collectionData = Array.isArray(collection) ? collection[0] : collection
  if (!collectionData) notFound()

  return (
    <main className="flex flex-col justify-center text-center">
      <EditCollectionForm key={id} id={id} collection={collectionData} />
    </main>
  )
}

const Page = ({ params }: IProps) => (
  <Suspense fallback={<EditCollectionSkeleton />}>
    <CollectionData params={params} />
  </Suspense>
)

export default Page