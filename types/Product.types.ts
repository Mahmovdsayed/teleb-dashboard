export type Locale = "ar" | "en";

export interface ProductTranslation {
  id?: number;
  productId?: number;
  locale: Locale;
  name: string;
  description?: string | null;
  smallDescription?: string | null;
  materials?: { name: string }[] | null;
  features?: { name: string }[] | null;
  height?: string | null;
  width?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string[] | null;
  tags?: string[] | null;
}

export interface ProductImage {
  id?: number;
  productId?: number;
  url: string;
  publicId: string;
  order: number;
  isMain?: boolean;
}

export interface ProductVariant {
  id?: number;
  productId?: number;
  size?: string | null;
  weight?: string | null;
  isAvailable?: boolean;
}

export interface Product {
  id: number;
  collectionId: number;
  offerId?: number | null;
  slug: string;
  status: "active" | "inactive";
  isBestSeller: boolean;
  isCustomizable: boolean;
  warranty: number;
  weight?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  translations: ProductTranslation[];
  images: ProductImage[];
  variants?: ProductVariant[];
}

export interface ProductListResponse {
  success: boolean;
  data: Product[];
  total: number;
  message?: string;
}

export interface SingleProductResponse {
  success: boolean;
  data?: Product;
  message?: string;
  code?: string;
}

export interface ProductQueryInput {
  page?: number;
  limit?: number;
  collectionId?: number;
  offerId?: number;
  status?: "active" | "inactive";
  bestSeller?: boolean;
  sort?: "createdAt" | "name";
  order?: "asc" | "desc";
  lang?: Locale;
  q?: string;
}

export interface ProductsResult {
  data: Product[];
  total: number;
}

export interface CreateProductPayload {
  collectionId: number;
  offerId?: number | null;
  slug: string;
  status?: "active" | "inactive";
  isBestSeller?: boolean;
  isCustomizable?: boolean;
  warranty?: number;
  weight?: string | null;
  translations: {
    ar: {
      name: string;
      description?: string;
      smallDescription?: string;
      materials?: { name: string }[];
      features?: { name: string }[];
      height?: string | null;
      width?: string | null;
      tags?: string[];
      metaTitle?: string;
      metaDescription?: string;
      metaKeywords?: string[];
    };
    en: {
      name: string;
      description?: string;
      smallDescription?: string;
      materials?: { name: string }[];
      features?: { name: string }[];
      height?: string | null;
      width?: string | null;
      tags?: string[];
      metaTitle?: string;
      metaDescription?: string;
      metaKeywords?: string[];
    };
  };
  variants?: {
    size?: string;
    weight?: string | null;
    isAvailable?: boolean;
  }[];
}

export interface UpdateProductPayload {
  collectionId?: number;
  offerId?: number | null;
  slug?: string;
  status?: "active" | "inactive";
  isBestSeller?: boolean;
  isCustomizable?: boolean;
  warranty?: number;
  weight?: string | null;
  translations?: {
    ar?: Partial<{
      name: string;
      description?: string;
      smallDescription?: string;
      materials?: { name: string }[];
      features?: { name: string }[];
      height?: string | null;
      width?: string | null;
      tags?: string[];
      metaTitle?: string;
      metaDescription?: string;
      metaKeywords?: string[];
    }>;
    en?: Partial<{
      name: string;
      description?: string;
      smallDescription?: string;
      materials?: { name: string }[];
      features?: { name: string }[];
      height?: string | null;
      width?: string | null;
      tags?: string[];
      metaTitle?: string;
      metaDescription?: string;
      metaKeywords?: string[];
    }>;
  };
}

export interface CreateProductImagePayload {
  url: string;
  publicId: string;
  order?: number;
  isMain?: boolean;
}
