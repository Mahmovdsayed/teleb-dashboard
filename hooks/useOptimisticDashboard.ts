import { useQueryClient, type QueryKey } from "@tanstack/react-query"

interface OptimisticConfig {
  queryKey: QueryKey
  arrayKey: string
  countKey?: string
}

export const useOptimisticDashboard = ({ queryKey, arrayKey, countKey }: OptimisticConfig) => {
  const queryClient = useQueryClient()

  const onAdd = async (newData: any) => {
    await queryClient.cancelQueries({ queryKey })
    const previousData = queryClient.getQueryData(queryKey)
    const tempId = `temp-${Date.now()}`

    queryClient.setQueryData(queryKey, (old: any) => {
      const item = {
        ...newData,
        id: tempId,
        tempId,
        isOptimistic: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      if (Array.isArray(old)) return [item, ...old]
      
      return {
        ...old,
        [arrayKey]: [item, ...(old?.[arrayKey] ?? [])],
        ...(countKey ? { [countKey]: (old?.[countKey] ?? 0) + 1 } : {}),
      }
    })

    return { previousData, tempId }
  }

  const onUpdate = async (id: string | number, newData: any) => {
    await queryClient.cancelQueries({ queryKey })
    const previousData = queryClient.getQueryData(queryKey)

    queryClient.setQueryData(queryKey, (old: any) => {
      const updateItem = (item: any) => (String(item.id) === String(id) ? { ...item, ...newData, updatedAt: new Date() } : item)
      if (Array.isArray(old)) return old.map(updateItem)

      return {
        ...old,
        [arrayKey]: old?.[arrayKey]?.map(updateItem),
      }
    })

    return { previousData }
  }

  const onDelete = async (id: string | number) => {
    await queryClient.cancelQueries({ queryKey })
    const previousData = queryClient.getQueryData(queryKey)

    queryClient.setQueryData(queryKey, (old: any) => {
      const matchesId = (item: any) => String(item.id) === String(id)
      if (Array.isArray(old)) return old.filter((item: any) => !matchesId(item))
      
      return {
        ...old,
        [arrayKey]: old?.[arrayKey]?.filter((item: any) => !matchesId(item)),
        ...(countKey
          ? {
              [countKey]: Math.max(0, (old?.[countKey] ?? 1) - 1),
            }
          : {}),
      }
    })

    return { previousData }
  }

  const onError = (_error: unknown, context: any) => {
    if (context?.previousData !== undefined) {
      queryClient.setQueryData(queryKey, context.previousData)
    }
  }

  const onSuccess = (data?: any, context?: any) => {
    if (data?.data && context?.tempId) {
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old

        const replaceItem = (item: any) => (item.tempId === context.tempId ? { ...data.data, tempId: context.tempId } : item)
        if (Array.isArray(old)) return old.map(replaceItem)
        
        return {
          ...old,
          [arrayKey]: old[arrayKey]?.map(replaceItem),
        }
      })

      return
    }

    return queryClient.invalidateQueries({ queryKey })
  }

  return {
    onAdd,
    onUpdate,
    onDelete,
    onError,
    onSuccess,
  }
}
