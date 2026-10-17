"use client"

import { useQuery, type UseQueryResult, type QueryKey, type UseQueryOptions, keepPreviousData } from "@tanstack/react-query"

const ONE_DAY = 1000 * 60 * 60 * 24

type AppQueryArgs<TData> = {
  queryKey: QueryKey
  queryFn: () => Promise<TData>
  enabled?: boolean
  retry?: number
  staleTime?: number
  refetchInterval?: number
  refetchOnWindowFocus?: boolean
  gcTime?: number
  initialData?: TData
  placeholderData?: UseQueryOptions<TData, Error, TData>["placeholderData"]
}

export function useAppQuery<TData>({
  gcTime = ONE_DAY,
  refetchInterval = 0,
  refetchOnWindowFocus = false,
  staleTime = ONE_DAY,
  queryKey,
  queryFn,
  enabled = true,
  retry = 0,
  initialData,
  placeholderData,
}: AppQueryArgs<TData>): UseQueryResult<TData> {
  return useQuery({
    queryKey,
    queryFn,
    enabled,
    staleTime,
    gcTime,
    refetchInterval,
    refetchOnMount: "always",
    refetchOnWindowFocus,
    retry,
    initialData,
    placeholderData,
  })
}

export { keepPreviousData }
