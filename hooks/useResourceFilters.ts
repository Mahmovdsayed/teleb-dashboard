"use client"

import { useCallback, useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"

type UseResourceFiltersOptions<TFilters> = {
  defaultFilters: TFilters
  filterKeys: (keyof TFilters)[]
  onPageReset?: () => void
}

function parseFilterValue(value: string, defaultValue: unknown): unknown {
  if (value === "true") return true
  if (value === "false") return false

  if (typeof defaultValue === "number") {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : defaultValue
  }

  return value
}

export function useResourceFilters<TFilters extends { page?: number }>({ defaultFilters, filterKeys, onPageReset }: UseResourceFiltersOptions<TFilters>) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const readFiltersFromUrl = useCallback((): TFilters => {
    const params = new URLSearchParams(searchParams.toString())
    const result = { ...defaultFilters } as TFilters

    for (const key of filterKeys) {
      const name = String(key)
      const value = params.get(name)

      if (value === null) {
        ;(result as Record<string, unknown>)[name] = (defaultFilters as Record<string, unknown>)[name]
      } else {
        ;(result as Record<string, unknown>)[name] = parseFilterValue(value, (defaultFilters as Record<string, unknown>)[name])
      }
    }

    return result
  }, [searchParams, defaultFilters, filterKeys])

  const [filters, setFilters] = useState<TFilters>(readFiltersFromUrl)

  useEffect(() => {
    setFilters(readFiltersFromUrl())
  }, [readFiltersFromUrl])

  const writeFiltersToUrl = useCallback(
    (nextFilters: TFilters) => {
      const params = new URLSearchParams(searchParams.toString())

      for (const key of filterKeys) {
        const name = String(key)
        const value = (nextFilters as Record<string, unknown>)[name]
        const defaultValue = (defaultFilters as Record<string, unknown>)[name]

        if (value === undefined || value === null || value === defaultValue) {
          params.delete(name)
        } else {
          params.set(name, String(value))
        }
      }

      const query = params.toString()
      const url = query ? `${pathname}?${query}` : pathname

      window.history.pushState({}, "", url)
    },
    [pathname, searchParams, filterKeys, defaultFilters]
  )

  const updateFilter = <K extends keyof TFilters>(key: K, value: TFilters[K]) => {
    const nextFilters = {
      ...filters,
      [key]: value,
      page: 1,
    }

    setFilters(nextFilters)
    writeFiltersToUrl(nextFilters)
    onPageReset?.()
  }

  const resetFilters = () => {
    const nextFilters = { ...defaultFilters }
    setFilters(nextFilters)
    writeFiltersToUrl(nextFilters)
    onPageReset?.()
  }

  const hasFilters = filterKeys.some((key) => {
    if (key === "page" || key === "limit") return false

    return !Object.is((filters as Record<string, unknown>)[String(key)], (defaultFilters as Record<string, unknown>)[String(key)])
  })

  return {
    filters,
    setFilters,
    updateFilter,
    resetFilters,
    hasFilters,
  }
}
