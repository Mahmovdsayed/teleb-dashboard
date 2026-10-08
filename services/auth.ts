import { API_BASE_URL } from "@/constant/constant"
import { apiRequest } from "@/lib/api-request"

type LogoutResponse = {
  success?: boolean
  message?: string
  error?: string | { message?: string }
}

export async function logout(locale: string): Promise<void> {
  const response = await apiRequest<LogoutResponse>(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    locale,
  })

  if (response?.success === false || response?.error) {
    const message = response.message || (typeof response.error === "string" ? response.error : response.error?.message) || "Logout failed"
    throw new Error(message)
  }
}
