import { z } from "zod"

import { imageMessages } from "./image-messages"
import { Lang } from "@/lib/getValidationErrorMap"
import { IMAGE_MIME_TYPES, MAX_IMAGE_SIZE } from "@/constant/image-constants"

export const ImageSchema = (lang: Lang) => {
  const m = imageMessages[lang]

  return z.compile(
    z
      .instanceof(File, { error: m.required })
      .refine((file) => file.size > 0, m.required)
      .refine((file) => file.size <= MAX_IMAGE_SIZE, m.tooLarge)
      .refine((file) => IMAGE_MIME_TYPES.includes(file.type), m.invalidType)
  )
}
