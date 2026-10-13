import { ResourceFilterField } from "@/components/ui/ResourceFilters"
import type { OfferQueryInput } from "@/types/Offer.types"
import { CreateOfferFormValues } from "@/validations/offer"
import { FileText, Languages, Palette, Percent, Settings2 } from "lucide-react"

type CreateOfferFiltersOptions = {
  filters: OfferQueryInput
  updateFilter: <K extends keyof OfferQueryInput>(key: K, value: OfferQueryInput[K]) => void
  tf: (key: string) => string
}

export function createOfferFilters({ filters, updateFilter, tf }: CreateOfferFiltersOptions): ResourceFilterField[] {
  return [
    {
      key: "isActive",
      label: tf("status"),
      value: filters.isActive === undefined ? "all" : String(filters.isActive),
      selectedLabel: filters.isActive === undefined ? tf("allStatuses") : filters.isActive ? tf("active") : tf("inactive"),
      onValueChange: (value) => updateFilter("isActive", value === "all" ? undefined : value === "true"),
      options: [
        { value: "all", label: tf("allStatuses") },
        { value: "true", label: tf("active") },
        { value: "false", label: tf("inactive") },
      ],
    },
    {
      key: "showBanner",
      label: tf("banner"),
      value: filters.showBanner === undefined ? "all" : String(filters.showBanner),
      selectedLabel: filters.showBanner === undefined ? tf("allBanners") : filters.showBanner ? tf("shown") : tf("hidden"),
      onValueChange: (value) => updateFilter("showBanner", value === "all" ? undefined : value === "true"),
      options: [
        { value: "all", label: tf("allBanners") },
        { value: "true", label: tf("shown") },
        { value: "false", label: tf("hidden") },
      ],
    },
    {
      key: "sort",
      label: tf("sortBy"),
      value: filters.sort ?? "createdAt",
      selectedLabel: tf(filters.sort ?? "createdAt"),
      onValueChange: (value) => updateFilter("sort", value as OfferQueryInput["sort"]),
      options: [
        { value: "createdAt", label: tf("createdAt") },
        { value: "startDate", label: tf("startDate") },
        { value: "endDate", label: tf("endDate") },
        { value: "percentage", label: tf("percentage") },
      ],
    },
    {
      key: "order",
      label: tf("order"),
      value: filters.order ?? "desc",
      selectedLabel: filters.order === "asc" ? tf("ascending") : tf("descending"),
      onValueChange: (value) => updateFilter("order", value as OfferQueryInput["order"]),
      options: [
        { value: "desc", label: tf("descending") },
        { value: "asc", label: tf("ascending") },
      ],
    },
  ]
}

export const DEFAULT_FILTERS: OfferQueryInput = {
  page: 1,
  limit: 10,
  sort: "createdAt",
  order: "desc",
}

export const FILTER_KEYS: (keyof OfferQueryInput)[] = ["isActive", "showBanner", "sort", "order"]

export const stepConfig = [
  {
    id: "basicInformation",
    icon: FileText,
  },
  {
    id: "descriptions",
    icon: Languages,
  },
  {
    id: "discountDetails",
    icon: Percent,
  },
  {
    id: "bannerCustomization",
    icon: Palette,
  },
  {
    id: "visibilityStatus",
    icon: Settings2,
  },
] as const

export const TOTAL_STEPS = stepConfig.length

export const stepFields: Record<number, (keyof CreateOfferFormValues)[]> = {
  1: ["arName", "enName"],
  2: ["arDescription", "enDescription"],
  3: ["percentage", "startDate", "endDate"],
  4: ["arBannerText", "enBannerText", "bannerBackgroundColor", "bannerTextColor"],
  5: [],
}
