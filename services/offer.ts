import { API_BASE_URL } from "@/constant/constant"
import { apiRequest } from "@/lib/api-request"
import { Offer, OfferQueryInput, OfferResponse, OffersResult, SingleOfferResponse } from "@/types/Offer.types"
import { CreateOfferFormValues, UpdateOfferFormValues } from "@/validations/offer"

export const getOffers = async (query: OfferQueryInput, locale: string): Promise<OffersResult> => {
  const params = new URLSearchParams()

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.set(key, String(value))
    }
  })

  const response = await apiRequest<OfferResponse>(`${API_BASE_URL}/offer/get?${params.toString()}`, {
    method: "GET",
    locale,
  })

  if (response.success === false || response.error) {
    const message = response.message || (typeof response.error === "string" ? response.error : response.error?.message) || "Failed to fetch offers"
    throw new Error(message)
  }

  return {
    data: response.data ?? [],
    total: response.total ?? (response.data?.length ?? 0),
  }
}

export const deleteOffer = async (id: string, locale: string): Promise<any> => {
  const response = await apiRequest<OfferResponse>(`${API_BASE_URL}/offer/delete/${id}`, {
    method: "DELETE",
    locale,
  })

  if (response.success === false || response.error) {
    const message = response.message || (typeof response.error === "string" ? response.error : response.error?.message) || "Failed to delete offer"
    throw new Error(message)
  }

  return response
}

export const addOffer = async (payload: CreateOfferFormValues, locale: string): Promise<any> => {
  const response = await apiRequest<OfferResponse>(`${API_BASE_URL}/offer/create`, {
    method: "POST",
    body: payload,
    locale,
  })
  if (response.success === false || response.error) {
    const message = response.message || (typeof response.error === "string" ? response.error : response.error?.message) || "Failed to add offer"
    throw new Error(message)
  }
  return response
}

export const getOfferById = async (id: string): Promise<Offer | null> => {
  const response = await apiRequest<SingleOfferResponse>(`${API_BASE_URL}/offer/get/${id}`, {
    method: "GET",
  })

  if (response.code === "OFFER_NOT_FOUND") return null

  if (response.success === false || response.error) {
    const message = response.message || (typeof response.error === "string" ? response.error : response.error?.message) || "Failed to fetch offer"
    throw new Error(message)
  }

  return response.data ?? null
}

export const updateOffer = async (payload: UpdateOfferFormValues, locale: string, id: string): Promise<any> => {
  const response = await apiRequest<OfferResponse>(`${API_BASE_URL}/offer/update/${id}`, {
    method: "PATCH",
    body: payload,
    locale,
  })

  if (response.success === false || response.error) {
    const message = response.message || (typeof response.error === "string" ? response.error : response.error?.message) || "Failed to update offer"
    throw new Error(message)
  }

  return response
}

