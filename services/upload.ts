import axios from "axios"

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

export const uploadImageApi = async (file: File, options?: UploadImageOptions): Promise<UploadImageResult> => {
  const formData = new FormData()
  formData.append("file", file)
  if (options?.folderName) formData.append("folderName", options.folderName)
  if (options?.width) formData.append("width", String(options.width))
  if (options?.height) formData.append("height", String(options.height))

  const response = await axios.post<{
    success: boolean
    data?: UploadImageResult
    message?: string
  }>("/api/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    signal: options?.signal,
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const rawPercent = (progressEvent.loaded / progressEvent.total) * 90
        const percentCompleted = Math.round(rawPercent)
        options?.onProgress?.(percentCompleted)
      }
    },
  })

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || "Upload failed")
  }

  options?.onProgress?.(100)
  return response.data.data
}

export const deleteImageApi = async (publicId: string): Promise<boolean> => {
  const response = await axios.delete<{ success: boolean; message?: string }>("/api/upload", {
    data: { publicId },
  })
  return response.data.success
}
