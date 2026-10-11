import { useQueryClient } from "@tanstack/react-query"

interface OptimisticConfig {
  queryKey: any[]
  arrayKey: string
  countKey?: string
}

export const useOptimisticDashboard = ({ queryKey, arrayKey, countKey }: OptimisticConfig) => {
  const queryClient = useQueryClient()

  const onAdd = async (newData: any) => {
    await queryClient.cancelQueries({ queryKey })
    const previousData = queryClient.getQueryData(queryKey)
    const tempId = `temp-${Date.now()}`

    queryClient.setQueryData(queryKey, (old: any) => ({
      ...old,
      [arrayKey]: [
        {
          id: tempId,
          tempId,
          ...newData,
          isOptimistic: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        ...(old?.[arrayKey] || []),
      ],
      ...(countKey ? { [countKey]: (old?.[countKey] || 0) + 1 } : {}),
    }))

    return { previousData, tempId }
  }

  const onUpdate = async (id: string, newData: any) => {
    await queryClient.cancelQueries({ queryKey })
    const previousData = queryClient.getQueryData(queryKey)

    queryClient.setQueryData(queryKey, (old: any) => ({
      ...old,
      [arrayKey]: old?.[arrayKey]?.map((item: any) => (item.id === id ? { ...item, ...newData, updatedAt: new Date() } : item)),
    }))

    return { previousData }
  }

  const onDelete = async (id: string) => {
    await queryClient.cancelQueries({ queryKey })
    const previousData = queryClient.getQueryData(queryKey)

    queryClient.setQueryData(queryKey, (old: any) => ({
      ...old,
      [arrayKey]: old?.[arrayKey]?.filter((item: any) => item.id !== id),
      ...(countKey ? { [countKey]: Math.max(0, (old?.[countKey] || 1) - 1) } : {}),
    }))

    return { previousData }
  }

  const onError = (_error: any, context: any) => {
    if (context?.previousData !== undefined) {
      queryClient.setQueryData(queryKey, context.previousData)
    }
  }

  const onSuccess = (data?: any, context?: any) => {
    if (data?.data && context?.tempId) {
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old

        return {
          ...old,
          [arrayKey]: old[arrayKey]?.map((item: any) => (item.tempId === context.tempId ? { ...data.data, tempId: context.tempId } : item)),
        }
      })
    } else {
      queryClient.invalidateQueries({ queryKey })
    }
  }

  return {
    onAdd,
    onUpdate,
    onDelete,
    onError,
    onSuccess,
  }
}
