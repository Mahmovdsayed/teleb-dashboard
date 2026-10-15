export interface BannerImage {
  url: string
  publicId: string
  order: number
}

export type Banner = {
  id: number
  title: string
  images: BannerImage[]
  userId: number
  createdAt: Date
  updatedAt: Date
}

export type BannerResponse = {
  success: boolean
  data?: Banner[]
  message?: string
  error?: string | { message?: string }
}

export type SingleBannerResponse = {
  success: boolean
  data?: Banner
  message?: string
  error?: string | { message?: string }
  code?: string
}
