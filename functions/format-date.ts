export const formatDate = (date: Date | string, locale: string = "en"): string => {
  return new Date(date).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}
