import { fileTypeFromBuffer } from "file-type"

export const isValidFileType = async (file: File, extensions: string[], strict = false): Promise<{ valid: boolean; detectedType?: string }> => {
  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const fileType = await fileTypeFromBuffer(buffer)

    if (!fileType) {
      if (strict) return { valid: false }
      const ext = file.name.split(".").pop()?.toLowerCase()
      return {
        valid: ext ? extensions.includes(ext) : false,
        detectedType: ext,
      }
    }

    return {
      valid: extensions.includes(fileType.ext),
      detectedType: fileType.ext,
    }
  } catch {
    return { valid: false }
  }
}

export const isValidFileSize = (file: File, maxSize?: number): boolean => {
  if (!maxSize) return true
  return file.size <= maxSize
}

export const fileToBuffer = async (file: File): Promise<Buffer> => {
  const arrayBuffer = await file.arrayBuffer()
  return Buffer.from(arrayBuffer)
}
