import { API_BASE_URL } from "@/constant/constant"
import { apiRequest } from "@/lib/api-request"
import { Collection, CollectionResponse, SingleCollectionResponse } from "@/types/Collection.types"
import { CreateCollectionInput, UpdateCollectionInput } from "@/validations/collection"

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

export const addCollection = async (payload: CreateCollectionInput, locale: string): Promise<any> => {
  const response = await apiRequest<CollectionResponse>(`${API_BASE_URL}/collection/create`, {
    method: "POST",
    body: payload,
    locale,
  })
  if (response.success === false || response.error) {
    const message = response.message || (typeof response.error === "string" ? response.error : response.error?.message) || "Failed to add collection"
    throw new Error(message)
  }
  return response
}

export const getCollectionById = async (id: string): Promise<any> => {
  const response = await apiRequest<SingleCollectionResponse>(`${API_BASE_URL}/collection/get/${id}`, {
    method: "GET",
  })

  if (response.code === "COLLECTION_NOT_FOUND") return null

  if (response.success === false || response.error) {
    const message = response.message || (typeof response.error === "string" ? response.error : response.error?.message) || "Failed to fetch collection"
    throw new Error(message)
  }

  return response.data ?? null
}

export const updateCollection = async (payload: UpdateCollectionInput, locale: string, id: string): Promise<any> => {
  const response = await apiRequest<CollectionResponse>(`${API_BASE_URL}/collection/update/${id}`, {
    method: "PATCH",
    body: payload,
    locale,
  })
  if (response.success === false || response.error) {
    const message = response.message || (typeof response.error === "string" ? response.error : response.error?.message) || "Failed to update collection"
    throw new Error(message)
  }
  return response
}
