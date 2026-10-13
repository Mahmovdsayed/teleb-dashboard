export type ApiResponse<T> = {
  success: boolean
  data?: T
  code?: string
  message?: string
  error?: string | { message?: string }
}
