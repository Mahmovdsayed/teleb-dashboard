import { API_BASE_URL } from "@/constant/constant"
import { apiRequest } from "@/lib/api-request"
import { Message, MessageQueryInput, MessageResponse, MessagesResult, SingleMessageResponse } from "@/types/Message.types"

export const getMessages = async (query: MessageQueryInput, locale: string): Promise<MessagesResult> => {
  const params = new URLSearchParams()

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value))
    }
  })

  const response = await apiRequest<MessageResponse>(`${API_BASE_URL}/message/get?${params.toString()}`, {
    method: "GET",
    locale,
  })

  if (response.success === false || response.error) {
    const message = response.message || (typeof response.error === "string" ? response.error : response.error?.message) || "Failed to fetch messages"
    throw new Error(message)
  }

  return {
    data: response.data ?? [],
    total: response.total ?? response.data?.length ?? 0,
  }
}

export const getMessageById = async (id: string, locale: string): Promise<Message | null> => {
  const response = await apiRequest<SingleMessageResponse>(`${API_BASE_URL}/message/get/${id}`, {
    method: "GET",
    locale,
  })

  if (response.success === false || response.error) {
    const message = response.message || (typeof response.error === "string" ? response.error : response.error?.message) || "Failed to fetch message"
    throw new Error(message)
  }

  return response.data ?? null
}

export const deleteMessage = async (id: string, locale: string): Promise<any> => {
  const response = await apiRequest<MessageResponse>(`${API_BASE_URL}/message/delete/${id}`, {
    method: "DELETE",
    locale,
  })

  if (response.success === false || response.error) {
    const message = response.message || (typeof response.error === "string" ? response.error : response.error?.message) || "Failed to delete message"
    throw new Error(message)
  }

  return response
}

export const markMessageAsViewed = async (id: string, locale: string): Promise<Message | null> => {
  const response = await apiRequest<SingleMessageResponse>(`${API_BASE_URL}/message/update/${id}/view`, {
    method: "PATCH",
    locale,
  })

  if (response.success === false || response.error) {
    const message = response.message || (typeof response.error === "string" ? response.error : response.error?.message) || "Failed to mark message as viewed"
    throw new Error(message)
  }

  return response.data ?? null
}
