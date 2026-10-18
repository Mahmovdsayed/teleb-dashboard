import { ResourceFilterField } from "@/components/ui/ResourceFilters"
import { Collection } from "@/types/Collection.types"
import { Offer } from "@/types/Offer.types"
import { ProductQueryInput } from "@/types/Product.types"
import { CreateProductFormValues } from "@/validations/product"
import { FileText, FolderOpen, Image as ImageIcon, Languages, Tag } from "lucide-react"

type CreateProductFiltersOptions = {
  filters: ProductQueryInput
  updateFilter: <K extends keyof ProductQueryInput>(key: K, value: ProductQueryInput[K]) => void
  collections?: Collection[]
  offers?: Offer[]
  tf: (key: string) => string
  locale?: string
}

export function createProductFilters({ filters, updateFilter, collections = [], offers = [], tf, locale = "ar" }: CreateProductFiltersOptions): ResourceFilterField[] {
  const isEn = locale === "en"

  const collectionOptions = [
    { value: "all", label: tf("allCollections") },
    ...collections.map((col) => ({
      value: String(col.id),
      label: isEn ? col.enName : col.arName,
    })),
  ]

  const offerOptions = [
    { value: "all", label: tf("allOffers") },
    ...offers.map((off) => ({
      value: String(off.id),
      label: `${isEn ? off.enName : off.arName} (${off.percentage}%)`,
    })),
  ]

  const selectedCollection = collections.find((c) => String(c.id) === String(filters.collectionId))
  const selectedOffer = offers.find((o) => String(o.id) === String(filters.offerId))

  return [
    {
      key: "status",
      label: tf("status"),
      value: filters.status === undefined ? "all" : filters.status,
      selectedLabel: filters.status === undefined ? tf("allStatuses") : filters.status === "active" ? tf("active") : tf("inactive"),
      onValueChange: (value) => updateFilter("status", value === "all" ? undefined : (value as "active" | "inactive")),
      options: [
        { value: "all", label: tf("allStatuses") },
        { value: "active", label: tf("active") },
        { value: "inactive", label: tf("inactive") },
      ],
    },
    {
      key: "collectionId",
      label: tf("collection"),
      value: filters.collectionId === undefined ? "all" : String(filters.collectionId),
      selectedLabel: selectedCollection ? (isEn ? selectedCollection.enName : selectedCollection.arName) : tf("allCollections"),
      onValueChange: (value) => updateFilter("collectionId", value === "all" ? undefined : Number(value)),
      options: collectionOptions,
    },
    {
      key: "offerId",
      label: tf("offer"),
      value: filters.offerId === undefined ? "all" : String(filters.offerId),
      selectedLabel: selectedOffer ? `${isEn ? selectedOffer.enName : selectedOffer.arName} (${selectedOffer.percentage}%)` : tf("allOffers"),
      onValueChange: (value) => updateFilter("offerId", value === "all" ? undefined : Number(value)),
      options: offerOptions,
    },
    {
      key: "bestSeller",
      label: tf("bestSeller"),
      value: filters.bestSeller === undefined ? "all" : String(filters.bestSeller),
      selectedLabel: filters.bestSeller === undefined ? tf("all") : filters.bestSeller ? tf("yes") : tf("no"),
      onValueChange: (value) => updateFilter("bestSeller", value === "all" ? undefined : value === "true"),
      options: [
        { value: "all", label: tf("all") },
        { value: "true", label: tf("yes") },
        { value: "false", label: tf("no") },
      ],
    },
    {
      key: "sort",
      label: tf("sortBy"),
      value: filters.sort ?? "createdAt",
      selectedLabel: tf(filters.sort ?? "createdAt"),
      onValueChange: (value) => updateFilter("sort", value as ProductQueryInput["sort"]),
      options: [
        { value: "createdAt", label: tf("createdAt") },
        { value: "name", label: tf("name") },
      ],
    },
    {
      key: "order",
      label: tf("order"),
      value: filters.order ?? "desc",
      selectedLabel: filters.order === "asc" ? tf("ascending") : tf("descending"),
      onValueChange: (value) => updateFilter("order", value as ProductQueryInput["order"]),
      options: [
        { value: "desc", label: tf("descending") },
        { value: "asc", label: tf("ascending") },
      ],
    },
  ]
}

export const DEFAULT_FILTERS: ProductQueryInput = {
  page: 1,
  limit: 10,
  sort: "createdAt",
  order: "desc",
}

export const FILTER_KEYS: (keyof ProductQueryInput)[] = ["status", "collectionId", "offerId", "bestSeller", "sort", "order"]

export const stepConfig = [
  {
    id: "basicInfo",
    icon: FolderOpen,
  },
  {
    id: "arContent",
    icon: Languages,
  },
  {
    id: "enContent",
    icon: FileText,
  },
  {
    id: "tagsAndSeo",
    icon: Tag,
  },
  {
    id: "images",
    icon: ImageIcon,
  },
] as const

export const TOTAL_STEPS = stepConfig.length

export const stepFields: Record<number, (keyof CreateProductFormValues)[]> = {
  1: ["collectionId", "slug"],
  2: ["arName"],
  3: ["enName"],
  4: [],
  5: [],
}
