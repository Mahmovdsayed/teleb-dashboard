export type MessagePriority = "low" | "medium" | "high"

export type Message = {
  id: string
  fullName: string
  email: string
  phone: string
  subject: string
  message: string
  isViewed: boolean
  priority: MessagePriority
  createdAt: Date
  updatedAt: Date
}

export type MessageResponse = {
  success: boolean
  data?: Message[]
  total?: number
  message?: string
  error?: string | { message?: string }
}

export type SingleMessageResponse = {
  success: boolean
  data?: Message
  message?: string
  error?: string | { message?: string }
}

export type MessagesResult = {
  data: Message[]
  total: number
}

export type MessageQueryInput = {
  page?: number
  limit?: number
  isViewed?: boolean
  sort?: "createdAt" | "fullName" | "email" | "subject" | "isViewed" | "priority"
  order?: "asc" | "desc"
  search?: string
  priority?: MessagePriority
}
