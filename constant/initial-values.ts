export const loginInitialValues = {
  email: "",
  password: "",
}

export const collectionInitialValues = {
  arName: "",
  enName: "",
  icon: "",
}

export const offerInitialValues = {
  arName: "",
  enName: "",
  arDescription: "",
  arBannerText: "",
  enDescription: "",
  enBannerText: "",
  percentage: "",
  startDate: "",
  endDate: "",
  isActive: true,
  showBanner: false,
  bannerBackgroundColor: "#2563eb",
  bannerTextColor: "#ffffff",
}

export const bannerInitialValues = {
  title: "",
  images: [] as { url: string; publicId: string; order: number }[],
}

export const productInitialValues = {
  collectionId: "" as unknown as number,
  offerId: "" as unknown as number,
  slug: "",
  status: "active" as const,
  isBestSeller: false,
  isCustomizable: false,
  warranty: 0,
  weight: "",
  arName: "",
  arSmallDescription: "",
  arDescription: "",
  arMaterials: [] as string[],
  arFeatures: [] as string[],
  arHeight: "",
  arWidth: "",
  enName: "",
  enSmallDescription: "",
  enDescription: "",
  enMaterials: [] as string[],
  enFeatures: [] as string[],
  enHeight: "",
  enWidth: "",
  tags: [] as string[],
  metaTitleAr: "",
  metaTitleEn: "",
  metaDescriptionAr: "",
  metaDescriptionEn: "",
  metaKeywords: [] as string[],
}

