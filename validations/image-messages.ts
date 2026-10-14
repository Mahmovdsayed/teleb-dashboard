import { MAX_IMAGE_SIZE } from "@/constant/image-constants"
import { Lang } from "@/lib/getValidationErrorMap"

const MAX_MB = MAX_IMAGE_SIZE / 1024 / 1024

export const imageMessages: Record<Lang, { required: string; tooLarge: string; invalidType: string }> = {
  en: {
    required: "Image is required",
    tooLarge: `Image must be ${MAX_MB}MB or less`,
    invalidType: "Only JPG, PNG and WebP images are allowed",
  },
  ar: {
    required: "الصورة مطلوبة",
    tooLarge: `حجم الصورة لازم يكون ${MAX_MB} ميجا أو أقل`,
    invalidType: "مسموح بصور JPG وPNG وWebP بس",
  },
}
