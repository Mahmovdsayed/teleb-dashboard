export interface AnalyticsData {
  collections: {
    total: number
  }
  offers: {
    total: number
    currentlyActive: number
  }
  products: {
    total: number
    active: number
  }
  messages: {
    total: number
    unread: number
    highPriority: number
  }
}

export interface AnalyticsResponse {
  success: boolean
  data: AnalyticsData
  message?: string
  error?: string | { message?: string }
}
