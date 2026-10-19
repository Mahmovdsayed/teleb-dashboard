"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Flame,
  Layers,
  Percent,
  Ruler,
  ShieldCheck,
  Sparkles,
  Tag,
  Weight,
} from "lucide-react";

import { Product } from "@/types/Product.types";
import { Collection } from "@/types/Collection.types";
import { Offer } from "@/types/Offer.types";
import { formatDate } from "@/functions/format-date";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/ui/StatusBadge";

interface IProps {
  product: Product;
  collections?: Collection[];
  offers?: Offer[];
}

const ProductViewPage = ({
  product,
  collections = [],
  offers = [],
}: IProps) => {
  const currentLocale = useLocale();
  const isEn = currentLocale === "en";

  const t = useTranslations("dashboard.resources");
  const tp = useTranslations("dashboard.resources.products");

  const translation = useMemo(() => {
    const direct = product.translations.find((tr) => tr.locale === currentLocale);
    return direct || product.translations[0] || { name: product.slug };
  }, [product.translations, currentLocale]);

  const collection = useMemo(() => {
    return collections.find((c) => String(c.id) === String(product.collectionId));
  }, [collections, product.collectionId]);

  const offer = useMemo(() => {
    if (!product.offerId) return null;
    return offers.find((o) => String(o.id) === String(product.offerId));
  }, [offers, product.offerId]);

  const sortedImages = useMemo(() => {
    if (!product.images || product.images.length === 0) return [];
    return [...product.images].sort((a, b) => {
      if (a.isMain) return -1;
      if (b.isMain) return 1;
      return (a.order ?? 0) - (b.order ?? 0);
    });
  }, [product.images]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const activeImage = sortedImages[activeImageIndex] || sortedImages[0];

  const tags = translation.tags || [];

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto pb-16 px-3 sm:px-6">
      <div className="border-b border-border/60 pb-5">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
          {translation.name}
        </h1>
        <p className="text-xs text-muted-foreground font-mono truncate mt-0.5">
          {product.slug}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 w-full space-y-3">
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-border/70 bg-muted/40 shadow-xs">
            {activeImage?.url ? (
              <img
                src={activeImage.url}
                alt={translation.name || product.slug}
                className="w-full h-full object-cover transition-all duration-300"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
                <span className="text-sm font-medium">{t("noImages")}</span>
              </div>
            )}

            {activeImage?.isMain && (
              <span className="absolute top-3 start-3 bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-md shadow-xs">
                {tp("mainImage")}
              </span>
            )}
          </div>

          {sortedImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {sortedImages.map((img, idx) => {
                const isSelected = idx === activeImageIndex;
                return (
                  <button
                    key={img.publicId || idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative size-16 sm:size-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/20 shadow-xs scale-95"
                        : "border-border/60 hover:border-primary/50 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`Thumb ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {img.isMain && (
                      <span className="absolute bottom-0 inset-x-0 bg-primary/90 text-primary-foreground text-[8px] text-center font-bold py-0.5 leading-tight">
                        ★
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="lg:col-span-7 space-y-6">
          <Card className="border-border/70 shadow-none">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle className="text-base font-semibold">
                  {tp("viewOverview")}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge active={product.status === "active"}>
                    {product.status === "active"
                      ? tp("statusActive")
                      : tp("statusInactive")}
                  </StatusBadge>

                  {product.isBestSeller && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-full">
                      <Flame className="size-3.5 fill-amber-500" />
                      {tp("bestSellerBadge")}
                    </span>
                  )}

                  {product.isCustomizable && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                      <Sparkles className="size-3.5" />
                      {tp("customizableBadge")}
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 p-3 text-xs">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Layers className="size-4 text-primary shrink-0" />
                    {tp("fields.collection.label")}
                  </span>
                  <span className="font-semibold text-foreground truncate max-w-[150px]">
                    {collection
                      ? isEn
                        ? collection.enName
                        : collection.arName
                      : "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 p-3 text-xs">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Percent className="size-4 text-primary shrink-0" />
                    {tp("fields.offer.label")}
                  </span>
                  <span className="font-semibold text-primary truncate max-w-[150px]">
                    {offer
                      ? `${isEn ? offer.enName : offer.arName} (${offer.percentage}%)`
                      : tp("noOffer")}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 p-3 text-xs">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <ShieldCheck className="size-4 text-primary shrink-0" />
                    {tp("fields.warranty.label")}
                  </span>
                  <span className="font-semibold text-foreground">
                    {product.warranty ? `${product.warranty} ${tp("yearsWarranty")}` : "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 p-3 text-xs">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Weight className="size-4 text-primary shrink-0" />
                    {tp("fields.weight.label")}
                  </span>
                  <span className="font-semibold text-foreground">
                    {product.weight || "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 p-3 text-xs sm:col-span-2">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Ruler className="size-4 text-primary shrink-0" />
                    {tp("dimensions")}
                  </span>
                  <span className="font-semibold text-foreground">
                    {[
                      translation.height && `H: ${translation.height}`,
                      translation.width && `W: ${translation.width}`,
                    ]
                      .filter(Boolean)
                      .join(" × ") || "—"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-border/60 pt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="size-3.5 text-muted-foreground" />
                  <span>{t("createdAt")}: {formatDate(product.createdAt, currentLocale)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3.5 text-muted-foreground" />
                  <span>{tp("updatedAt")}: {formatDate(product.updatedAt, currentLocale)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 shadow-none">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base font-semibold">
                {isEn ? "Content & Details" : "محتوى وتفاصيل المنتج"}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5 pt-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">
                  {t("nameLabel")}
                </p>
                <p className="text-base font-bold text-foreground">
                  {translation.name || "—"}
                </p>
              </div>

              {translation.smallDescription && (
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1.5">
                    {isEn ? "Short Summary" : "الوصف المختصر"}
                  </p>
                  <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed bg-muted/30 p-3.5 rounded-xl border border-border/50">
                    {translation.smallDescription}
                  </p>
                </div>
              )}

              {translation.description && (
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1.5">
                    {isEn ? "Full Description" : "الوصف التفصيلي"}
                  </p>
                  <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-line bg-muted/20 p-4 rounded-xl border border-border/50">
                    {translation.description}
                  </p>
                </div>
              )}

              {translation.materials && translation.materials.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-2">
                    {isEn ? "Materials Used" : "الخامات والمواد"}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {translation.materials.map((m, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                      >
                        {m.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {translation.features && translation.features.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-2">
                    {isEn ? "Key Features" : "الميزات والمواصفات"}
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {translation.features.map((f, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/30 border border-border/40 text-foreground/90"
                      >
                        <CheckCircle2 className="size-4 text-primary shrink-0" />
                        <span className="font-medium">{f.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {tags.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2 text-xs text-muted-foreground font-medium">
                    <Tag className="size-3.5 text-primary" />
                    <span>{tp("fields.tags.label")}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center rounded-md bg-muted px-2.5 py-0.5 text-xs text-foreground font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(translation.metaTitle ||
                translation.metaDescription ||
                Boolean(translation.metaKeywords?.length)) && (
                <div className="border-t border-border/60 pt-4 space-y-3 text-xs">
                  <p className="font-semibold text-foreground">
                    {isEn ? "Search Engine Optimization (SEO)" : "تحسين محركات البحث (SEO)"}
                  </p>

                  {translation.metaTitle && (
                    <div className="bg-muted/30 p-3 rounded-xl border border-border/40 space-y-1">
                      <span className="text-muted-foreground block text-[11px]">
                        {isEn ? "Meta Title" : "عنوان الصفحة"}
                      </span>
                      <p className="font-semibold text-foreground">{translation.metaTitle}</p>
                    </div>
                  )}

                  {translation.metaDescription && (
                    <div className="bg-muted/30 p-3 rounded-xl border border-border/40 space-y-1">
                      <span className="text-muted-foreground block text-[11px]">
                        {isEn ? "Meta Description" : "وصف الميتا"}
                      </span>
                      <p className="text-muted-foreground leading-relaxed">
                        {translation.metaDescription}
                      </p>
                    </div>
                  )}

                  {translation.metaKeywords && translation.metaKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {translation.metaKeywords.map((k, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-muted px-2 py-0.5 rounded-md text-muted-foreground font-medium"
                        >
                          #{k}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductViewPage;
