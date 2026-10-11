import { API_BASE_URL } from "@/constant/constant"
import { apiRequest } from "@/lib/api-request"
import { Collection, CollectionResponse } from "@/types/Collection.types"

export const getCollections = async (): Promise<Collection[]> => {
  const response = await apiRequest<CollectionResponse>(`${API_BASE_URL}/collection/get`, {
    method: "GET",
  })

  if (response.success === false || response.error) {
    const message = response.message || (typeof response.error === "string" ? response.error : response.error?.message) || "Failed to fetch collections"
    throw new Error(message)
  }

  return response.data ?? []
}

export const deleteCollection = async (id: string, locale: string): Promise<any> => {
  const response = await apiRequest<CollectionResponse>(`${API_BASE_URL}/collection/delete/${id}`, {
    method: "DELETE",
    locale,
  })

  if (response.success === false || response.error) {
    const message = response.message || (typeof response.error === "string" ? response.error : response.error?.message) || "Failed to delete collection"

    throw new Error(message)
  }

  return response
}
