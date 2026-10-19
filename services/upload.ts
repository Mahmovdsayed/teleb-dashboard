export interface UploadImageOptions {
  folderName?: string
  width?: number
  height?: number
  onProgress?: (progress: number) => void
  signal?: AbortSignal
}

export interface UploadImageResult {
  imageUrl: string
  publicId: string
}

interface UploadImageResponse {
  success: boolean
  data?: UploadImageResult
  message?: string
}

export const uploadImageApi = async (file: File, options?: UploadImageOptions): Promise<UploadImageResult> => {
  const formData = new FormData()

  formData.append("file", file)

  if (options?.folderName) {
    formData.append("folderName", options.folderName)
  }

  if (options?.width) {
    formData.append("width", String(options.width))
  }

  if (options?.height) {
    formData.append("height", String(options.height))
  }

  options?.onProgress?.(0)

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
    signal: options?.signal,
    credentials: "same-origin",
  })

  const result = (await response.json()) as UploadImageResponse

  if (!response.ok) {
    throw new Error(result.message || `Upload failed with status ${response.status}`)
  }

  if (!result.success || !result.data) {
    throw new Error(result.message || "Upload failed")
  }

  options?.onProgress?.(100)

  return result.data
}

export const deleteImageApi = async (publicId: string): Promise<boolean> => {
  const response = await fetch("/api/upload", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify({ publicId }),
  })

  const result = (await response.json()) as {
    success: boolean
    message?: string
  }

  if (!response.ok) {
    throw new Error(result.message || `Delete failed with status ${response.status}`)
  }

  return result.success
}
