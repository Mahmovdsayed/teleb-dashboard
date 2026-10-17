import { ResourceFilterField } from "@/components/ui/ResourceFilters"
import type { MessageQueryInput } from "@/types/Message.types"

type CreateMessageFiltersOptions = {
  filters: MessageQueryInput
  updateFilter: <K extends keyof MessageQueryInput>(key: K, value: MessageQueryInput[K]) => void
  tf: (key: string) => string
}

export function createMessageFilters({ filters, updateFilter, tf }: CreateMessageFiltersOptions): ResourceFilterField[] {
  return [
    {
      key: "isViewed",
      label: tf("status"),
      value: filters.isViewed === undefined ? "all" : String(filters.isViewed),
      selectedLabel: filters.isViewed === undefined ? tf("allStatuses") : filters.isViewed ? tf("read") : tf("unread"),
      onValueChange: (value) => updateFilter("isViewed", value === "all" ? undefined : value === "true"),
      options: [
        { value: "all", label: tf("allStatuses") },
        { value: "false", label: tf("unread") },
        { value: "true", label: tf("read") },
      ],
    },
    {
      key: "priority",
      label: tf("priority"),
      value: filters.priority ?? "all",
      selectedLabel: filters.priority ? tf(filters.priority) : tf("allPriorities"),
      onValueChange: (value) => updateFilter("priority", value === "all" ? undefined : (value as MessageQueryInput["priority"])),
      options: [
        { value: "all", label: tf("allPriorities") },
        { value: "high", label: tf("high") },
        { value: "medium", label: tf("medium") },
        { value: "low", label: tf("low") },
      ],
    },
    {
      key: "sort",
      label: tf("sortBy"),
      value: filters.sort ?? "createdAt",
      selectedLabel: tf(filters.sort ?? "createdAt"),
      onValueChange: (value) => updateFilter("sort", value as MessageQueryInput["sort"]),
      options: [
        { value: "createdAt", label: tf("createdAt") },
        { value: "fullName", label: tf("fullName") },
        { value: "priority", label: tf("priority") },
        { value: "isViewed", label: tf("status") },
      ],
    },
    {
      key: "order",
      label: tf("order"),
      value: filters.order ?? "desc",
      selectedLabel: filters.order === "asc" ? tf("ascending") : tf("descending"),
      onValueChange: (value) => updateFilter("order", value as MessageQueryInput["order"]),
      options: [
        { value: "desc", label: tf("descending") },
        { value: "asc", label: tf("ascending") },
      ],
    },
  ]
}

export const DEFAULT_FILTERS: MessageQueryInput = {
  page: 1,
  limit: 10,
  sort: "createdAt",
  order: "desc",
}

export const FILTER_KEYS: (keyof MessageQueryInput)[] = ["isViewed", "priority", "sort", "order"]
