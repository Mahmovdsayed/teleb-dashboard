import { API_BASE_URL } from "@/constant/constant"
import { apiRequest } from "@/lib/api-request"
import {
  CreateProductImagePayload,
  CreateProductPayload,
  Product,
  ProductListResponse,
  ProductQueryInput,
  ProductsResult,
  SingleProductResponse,
  UpdateProductPayload,
} from "@/types/Product.types"
import { deleteImageApi } from "./upload"

export const getProducts = async (query: ProductQueryInput = {}, locale?: string): Promise<ProductsResult> => {
  const params = new URLSearchParams()

  if (query.page) params.set("page", String(query.page))
  if (query.limit) params.set("limit", String(query.limit))
  if (query.collectionId) params.set("collectionId", String(query.collectionId))
  if (query.offerId) params.set("offerId", String(query.offerId))
  if (query.status) params.set("status", query.status)
  if (query.bestSeller !== undefined) params.set("bestSeller", String(query.bestSeller))
  if (query.sort) params.set("sort", query.sort)
  if (query.order) params.set("order", query.order)
  if (query.lang) params.set("lang", query.lang)

  const endpoint = query.q ? `${API_BASE_URL}/products/search?q=${encodeURIComponent(query.q)}&${params.toString()}` : `${API_BASE_URL}/products?${params.toString()}`

  const response = await apiRequest<ProductListResponse>(endpoint, {
    method: "GET",
    locale,
  })

  if (response.success === false) {
    const message = response.message || "Failed to fetch products"
    throw new Error(message)
  }

  return {
    data: response.data ?? [],
    total: response.total ?? 0,
  }
}

export const getProductById = async (id: string | number, locale?: string): Promise<Product | null> => {
  const response = await apiRequest<SingleProductResponse>(`${API_BASE_URL}/products/${id}`, {
    method: "GET",
    locale,
  })

  if (response.code === "PRODUCT_NOT_FOUND") return null

  if (response.success === false) {
    const message = response.message || "Failed to fetch product"
    throw new Error(message)
  }

  return response.data ?? null
}

export const createProduct = async (payload: CreateProductPayload, locale?: string): Promise<Product> => {
  const response = await apiRequest<SingleProductResponse>(`${API_BASE_URL}/products/create`, {
    method: "POST",
    body: payload,
    locale,
  })

  if (response.success === false || !response.data) {
    const message = response.message || "Failed to create product"
    throw new Error(message)
  }

  return response.data
}

export const updateProduct = async (id: string | number, payload: UpdateProductPayload, locale?: string): Promise<Product> => {
  const response = await apiRequest<SingleProductResponse>(`${API_BASE_URL}/products/update/${id}`, {
    method: "PATCH",
    body: payload,
    locale,
  })

  if (response.success === false || !response.data) {
    const message = response.message || "Failed to update product"
    throw new Error(message)
  }

  return response.data
}

export const deleteProduct = async (id: string | number, locale?: string, publicIds?: string[]): Promise<void> => {
  if (publicIds && publicIds.length > 0) {
    await Promise.allSettled(publicIds.filter(Boolean).map((publicId) => deleteImageApi(publicId)))
  }

  const response = await apiRequest<{ success: boolean; message?: string }>(`${API_BASE_URL}/products/delete/${id}`, {
    method: "DELETE",
    locale,
  })

  if (response.success === false) {
    const message = response.message || "Failed to delete product"
    throw new Error(message)
  }
}

export const addProductImages = async (productId: string | number, images: CreateProductImagePayload[], locale?: string): Promise<any> => {
  if (images.length === 0) return []

  const response = await apiRequest<any>(`${API_BASE_URL}/products/images/${productId}`, {
    method: "POST",
    body: { images },
    locale,
  })

  if (response.success === false) {
    const message = response.message || "Failed to add product images"
    throw new Error(message)
  }

  return response.data
}

export const deleteProductImage = async (productId: string | number, imageId: string | number, locale?: string): Promise<void> => {
  const response = await apiRequest<{ success: boolean; message?: string }>(`${API_BASE_URL}/products/images/delete/${productId}/${imageId}`, {
    method: "DELETE",
    locale,
  })

  if (response.success === false) {
    const message = response.message || "Failed to delete image"
    throw new Error(message)
  }
}

export const updateProductStatus = async (id: string | number, status: "active" | "inactive", locale?: string): Promise<Product> => {
  const response = await apiRequest<SingleProductResponse>(`${API_BASE_URL}/products/status/${id}`, {
    method: "PATCH",
    body: { status },
    locale,
  })

  if (response.success === false || !response.data) {
    const message = response.message || "Failed to update product status"
    throw new Error(message)
  }

  return response.data
}

export const updateProductBestSeller = async (id: string | number, value: boolean, locale?: string): Promise<Product> => {
  const response = await apiRequest<SingleProductResponse>(`${API_BASE_URL}/products/best-seller/${id}`, {
    method: "PATCH",
    body: { value },
    locale,
  })

  if (response.success === false || !response.data) {
    const message = response.message || "Failed to update best seller status"
    throw new Error(message)
  }

  return response.data
}
