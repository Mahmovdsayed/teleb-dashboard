type ApiRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  body?: unknown
  locale?: string
  credentials?: RequestCredentials
}

export class ApiRequestError extends Error {
  status: number
  data: unknown

  constructor(message: string, status: number, data: unknown) {
    super(message)
    this.name = "ApiRequestError"
    this.status = status
    this.data = data
  }
}

export async function apiRequest<T = unknown>(
  url: string,
  { method = "GET", body, locale, credentials = "include" }: ApiRequestOptions = {},
): Promise<T> {
  const headers = new Headers()
  if (body !== undefined) headers.set("Content-Type", "application/json")
  if (locale) headers.set("Accept-Language", locale)

  const response = await fetch(url, {
    method,
    headers,
    credentials,
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  const responseText = await response.text()
  let data: any = responseText || null

  if (responseText) {
    try {
      data = JSON.parse(responseText)
    } catch {
      // Keep plain text responses available for useful error messages.
    }
  }

  if (!response.ok) {
    const rawMessage = data?.message || data?.error?.message || data?.error
    const message =
      typeof rawMessage === "string" ? rawMessage : response.statusText || "Request failed"
    throw new ApiRequestError(message, response.status, data)
  }

  return data as T
}
