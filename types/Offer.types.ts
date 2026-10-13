import { ApiResponse } from "./ApiResponse"

export type Offer = {
  id: string
  arName: string
  arDescription?: string
  arBannerText?: string
  enName: string
  enDescription?: string
  enBannerText?: string
  percentage: string
  startDate: Date
  endDate: Date
  isActive?: boolean
  showBanner?: boolean
  bannerBackgroundColor?: string
  bannerTextColor?: string
  createdAt: Date
  updatedAt: Date
}

export type OfferPayload = {
  arName: string
  arDescription?: string
  arBannerText?: string
  enName: string
  enDescription?: string
  enBannerText?: string
  percentage: string
  startDate: Date
  endDate: Date
  isActive?: boolean
  showBanner?: boolean
  bannerBackgroundColor?: string
  bannerTextColor?: string
}

export type OfferResponse = {
  success: boolean
  data?: Offer[]
  total?: number
  message?: string
  error?: string | { message?: string }
}

export type OffersResult = {
  data: Offer[]
  total: number
}

export type OfferQueryInput = {
  page?: number
  limit?: number
  isActive?: boolean
  showBanner?: boolean
  sort?: "createdAt" | "startDate" | "endDate" | "percentage"
  order?: "asc" | "desc"
}

export type SingleOfferResponse = ApiResponse<Offer>
