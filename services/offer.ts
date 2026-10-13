import { API_BASE_URL } from "@/constant/constant"
import { apiRequest } from "@/lib/api-request"
import { Offer, OfferQueryInput, OfferResponse } from "@/types/Offer.types"

export const getOffers = async (query: OfferQueryInput, locale: string): Promise<Offer[]> => {
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

  return response.data ?? []
}
