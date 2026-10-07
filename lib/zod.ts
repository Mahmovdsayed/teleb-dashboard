import { getLocale } from "next-intl/server"
import { z } from "zod"
import { localizedZodError, type Lang } from "./getValidationErrorMap"

export async function configureZodLocale() {
  const locale = (await getLocale()) as Lang
  z.config({ localeError: localizedZodError(locale) as any })
}