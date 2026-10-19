import { API_BASE_URL } from "@/constant/constant"
import { apiRequest } from "@/lib/api-request"
import { AnalyticsData, AnalyticsResponse } from "@/types/Analytics.types"

export const getAnalytics = async (): Promise<AnalyticsData> => {
  const response = await apiRequest<AnalyticsResponse>(`${API_BASE_URL}/analytics/all`, {
    method: "GET",
  })

  if (response.success === false || response.error) {
    const message = response.message || (typeof response.error === "string" ? response.error : response.error?.message) || "Failed to fetch analytics"
    throw new Error(message)
  }

  return response.data
}
