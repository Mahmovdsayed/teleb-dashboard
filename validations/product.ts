import { z } from "zod"

const optionalTrimmedString = (max?: number) => {
  let schema = z.string().trim()
  if (max) schema = schema.max(max)
  return schema.optional().transform((val) => (val === "" ? undefined : val))
}

const optionalStringArray = () =>
  z
    .array(z.string().trim().min(1))
    .optional()
    .default([])
    .transform((val) => (val && val.length > 0 ? val : []))

export const productFormSchema = z.object({
  collectionId: z.coerce.number().int().positive({ message: "Collection is required" }),
  offerId: z.coerce
    .number()
    .int()
    .positive()
    .nullable()
    .optional()
    .transform((val) => (val && val > 0 ? val : null))
    .catch(null),
  slug: z
    .string()
    .trim()
    .min(1, { message: "Slug is required" })
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug must contain only lowercase letters, numbers, and hyphens",
    }),
  status: z.enum(["active", "inactive"]).default("active"),
  isBestSeller: z.boolean().default(false),
  isCustomizable: z.boolean().default(false),
  warranty: z.coerce.number().int().min(0).default(0),
  weight: optionalTrimmedString(50),

  arName: z.string().trim().min(1, { message: "Arabic name is required" }).max(200),
  arSmallDescription: optionalTrimmedString(500),
  arDescription: optionalTrimmedString(5000),
  arMaterials: optionalStringArray(),
  arFeatures: optionalStringArray(),
  arHeight: optionalTrimmedString(50),
  arWidth: optionalTrimmedString(50),

  enName: z.string().trim().min(1, { message: "English name is required" }).max(200),
  enSmallDescription: optionalTrimmedString(500),
  enDescription: optionalTrimmedString(5000),
  enMaterials: optionalStringArray(),
  enFeatures: optionalStringArray(),
  enHeight: optionalTrimmedString(50),
  enWidth: optionalTrimmedString(50),

  tags: optionalStringArray(),
  metaTitleAr: optionalTrimmedString(200),
  metaTitleEn: optionalTrimmedString(200),
  metaDescriptionAr: optionalTrimmedString(500),
  metaDescriptionEn: optionalTrimmedString(500),
  metaKeywords: optionalStringArray(),
})

export const createProductSchema = z.compile(productFormSchema)
export const updateProductSchema = z.compile(productFormSchema.partial())

export type CreateProductFormValues = z.input<typeof createProductSchema>
export type UpdateProductFormValues = z.input<typeof updateProductSchema>

export function toObjectArray(arr?: string[] | null): { name: string }[] {
  if (!Array.isArray(arr)) return []
  return arr.filter(Boolean).map((name) => ({ name }))
}

export function splitCommaString(str?: string | null): string[] {
  if (!str) return []
  return str
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

export function splitToObjectArray(str?: string | null): { name: string }[] {
  return splitCommaString(str).map((name) => ({ name }))
}
