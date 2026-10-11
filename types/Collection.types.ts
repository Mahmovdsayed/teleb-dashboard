export type Collection = {
  id: string
  arName: string
  enName: string
  icon: string
  createdAt: Date
  updatedAt: Date
}

export type CollectionResponse = {
  success: boolean
  data?: Collection[]
  message?: string
  error?: string | { message?: string }
}
