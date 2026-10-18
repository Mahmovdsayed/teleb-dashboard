"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Eye,
  Flame,
  Layers,
  Pencil,
  Percent,
  Ruler,
  ShieldCheck,
  Sparkles,
  Weight,
} from "lucide-react";

import { Product } from "@/types/Product.types";
import { Collection } from "@/types/Collection.types";
import { Offer } from "@/types/Offer.types";
import { formatDate } from "@/functions/format-date";
import { deleteProduct } from "@/services/product";
import { Card, CardContent, CardFooter, CardHeader } from "./card";
import { Button } from "./button";
import DeleteButton from "./DeleteButton";
import MediaCarousel from "./MediaCarousel";
import StatusBadge from "./StatusBadge";

interface IProps {
  product: Product;
  refetch: () => void;
  collections?: Collection[];
  offers?: Offer[];
}

const ProductCard = ({ product, refetch, collections = [], offers = [] }: IProps) => {
  const { push } = useRouter();
  const locale = useLocale();
  const isEn = locale === "en";

  const t = useTranslations("dashboard.resources");
  const tp = useTranslations("dashboard.resources.products");

  const translation = useMemo(() => {
    const direct = product.translations.find((tr) => tr.locale === locale);
    return direct || product.translations[0] || { name: product.slug };
  }, [product.translations, locale]);

  const secondaryTranslation = useMemo(() => {
    return product.translations.find((tr) => tr.locale !== locale);
  }, [product.translations, locale]);

  const collection = useMemo(() => {
    return collections.find((c) => String(c.id) === String(product.collectionId));
  }, [collections, product.collectionId]);

  const offer = useMemo(() => {
    if (!product.offerId) return null;
    return offers.find((o) => String(o.id) === String(product.offerId));
  }, [offers, product.offerId]);

  const carouselItems = useMemo(() => {
    if (!product.images || product.images.length === 0) return [];
    return [...product.images]
      .sort((a, b) => {
        if (a.isMain) return -1;
        if (b.isMain) return 1;
        return (a.order ?? 0) - (b.order ?? 0);
      })
      .map((img, index) => ({
        id: img.publicId || String(img.id || index),
        url: img.url,
        alt: `${translation.name} - ${index + 1}`,
      }));
  }, [product.images, translation.name]);

  const collectionName = collection
    ? isEn
      ? collection.enName
      : collection.arName
    : null;

  const offerName = offer
    ? isEn
      ? offer.enName
      : offer.arName
    : null;

  const publicIds = product.images.map((img) => img.publicId).filter(Boolean);

  return (
    <Card className="gap-0 overflow-hidden shadow-none transition-colors hover:bg-muted/20 border-border/70">
      <CardHeader className="pb-3 space-y-3">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-semibold" title={translation.name}>
              {translation.name}
            </h2>
            {secondaryTranslation?.name && (
              <p
                className="truncate text-xs text-muted-foreground mt-0.5"
                title={secondaryTranslation.name}
              >
                {secondaryTranslation.name}
              </p>
            )}
            <p className="mt-1 text-xs text-muted-foreground font-mono">
              {product.slug}
            </p>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <StatusBadge active={product.status === "active"}>
              {product.status === "active" ? tp("statusActive") : tp("statusInactive")}
            </StatusBadge>
            {product.isBestSeller && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                <Flame className="size-3 fill-amber-500" />
                {tp("bestSellerBadge")}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {collectionName && (
            <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
              <Layers className="size-3" />
              {collectionName}
            </span>
          )}

          {offer && (
            <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              <Percent className="size-3" />
              {offerName ? `${offerName} (${offer.percentage}%)` : `${offer.percentage}% OFF`}
            </span>
          )}

          {product.isCustomizable && (
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <Sparkles className="size-3" />
              {tp("customizableBadge")}
            </span>
          )}
        </div>

        {translation.smallDescription && (
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground pt-1">
            {translation.smallDescription}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        <MediaCarousel
          items={carouselItems}
          aspect="square"
          fit="cover"
          emptyLabel={t("noImages")}
          className="rounded-xl overflow-hidden border border-border/60"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-xs text-muted-foreground">
          {product.warranty !== undefined && product.warranty > 0 ? (
            <div className="flex items-center gap-1.5 rounded-md bg-muted/40 p-2">
              <ShieldCheck className="size-3.5 shrink-0 text-primary" />
              <span className="truncate">
                {product.warranty} {tp("yearsWarranty")}
              </span>
            </div>
          ) : null}

          {product.weight ? (
            <div className="flex items-center gap-1.5 rounded-md bg-muted/40 p-2">
              <Weight className="size-3.5 shrink-0 text-primary" />
              <span className="truncate">{product.weight}</span>
            </div>
          ) : null}

          {(translation.height || translation.width) ? (
            <div className="flex items-center gap-1.5 rounded-md bg-muted/40 p-2">
              <Ruler className="size-3.5 shrink-0 text-primary" />
              <span className="truncate">
                {[translation.height && `H: ${translation.height}`, translation.width && `W: ${translation.width}`].filter(Boolean).join(" x ")}
              </span>
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-3.5 shrink-0" />
            <span>
              {t("createdAt")}: {formatDate(product.createdAt, locale)}
            </span>
          </div>
          <span className="text-xs">
            {t("id")}: {product.id}
          </span>
        </div>
      </CardContent>

      <CardFooter className="mt-2 grid grid-cols-3 gap-2">
        <Button
          onClick={() => push(`/${locale}/products/${product.id}`)}
          variant="outline"
          className="flex-1 gap-1.5"
          size="sm"
        >
          <Eye className="size-3.5" />
          {tp("view")}
        </Button>

        <Button
          onClick={() => push(`/${locale}/products/${product.id}/edit`)}
          variant="default"
          className="flex-1 gap-1.5"
          size="sm"
        >
          <Pencil className="size-3.5" />
          {t("edit")}
        </Button>

        <DeleteButton
          refetch={refetch}
          title={t("delete")}
          serviceFunc={() => deleteProduct(product.id, locale, publicIds)}
          warningMessage={
            isEn
              ? "Are you sure you want to delete this product? All images and translations will also be permanently removed."
              : "هل أنت متأكد من حذف هذا المنتج؟ سيتم حذف جميع الصور والبيانات المرتبطة به نهائيًا."
          }
          isIcon={false}
          className="text-xs"
        />
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
