import { API_BASE_URL } from "@/constant/constant"
import { apiRequest } from "@/lib/api-request"
import { Banner, BannerResponse, SingleBannerResponse } from "@/types/Banner.types"
import { CreateBannerInput, UpdateBannerInput } from "@/validations/banner"

import { deleteImageApi } from "./upload"

export const getBanners = async (): Promise<Banner[]> => {
  const response = await apiRequest<BannerResponse>(`${API_BASE_URL}/banner/get`, {
    method: "GET",
  })

  if (response.success === false || response.error) {
    const message = response.message || (typeof response.error === "string" ? response.error : response.error?.message) || "Failed to fetch banners"
    throw new Error(message)
  }

  return response.data ?? []
}

export const deleteBanner = async (id: string, locale: string, publicIds?: string[]): Promise<any> => {
  if (publicIds && publicIds.length > 0) {
    await Promise.allSettled(publicIds.filter(Boolean).map((publicId) => deleteImageApi(publicId)))
  }

  const response = await apiRequest<BannerResponse>(`${API_BASE_URL}/banner/delete/${id}`, {
    method: "DELETE",
    locale,
  })

  if (response.success === false || response.error) {
    const message = response.message || (typeof response.error === "string" ? response.error : response.error?.message) || "Failed to delete banner"
    throw new Error(message)
  }

  return response
}

export const addBanner = async (payload: CreateBannerInput, locale: string) => {
  const response = await apiRequest<BannerResponse>(`${API_BASE_URL}/banner/create`, {
    method: "POST",
    body: payload,
    locale,
  })
  if (response.success === false || response.error) {
    const message = response.message || (typeof response.error === "string" ? response.error : response.error?.message) || "Failed to add banner"
    throw new Error(message)
  }
  return response
}

export const getBannerById = async (id: string): Promise<Banner | null> => {
  const response = await apiRequest<SingleBannerResponse>(`${API_BASE_URL}/banner/get/${id}`, {
    method: "GET",
  })

  if (response.code === "BANNER_NOT_FOUND") return null

  if (response.success === false || response.error) {
    const message = response.message || (typeof response.error === "string" ? response.error : response.error?.message) || "Failed to fetch banner"
    throw new Error(message)
  }

  return response.data ?? null
}

export const updateBanner = async (payload: UpdateBannerInput, locale: string, id: string): Promise<any> => {
  const response = await apiRequest<BannerResponse>(`${API_BASE_URL}/banner/update/${id}`, {
    method: "PATCH",
    body: payload,
    locale,
  })

  if (response.success === false || response.error) {
    const message = response.message || (typeof response.error === "string" ? response.error : response.error?.message) || "Failed to update banner"
    throw new Error(message)
  }

  return response
}
