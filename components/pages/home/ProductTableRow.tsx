'use client';

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Eye, ShieldCheck, ImageIcon } from "lucide-react";
import { Product } from "@/types/Product.types";
import { Collection } from "@/types/Collection.types";
import { formatDate } from "@/functions/format-date";
import { deleteProduct } from "@/services/product";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/StatusBadge";
import DeleteButton from "@/components/ui/DeleteButton";

interface ProductTableRowProps {
  product: Product;
  collections: Collection[];
  onRefetch: () => void;
}

export default function ProductTableRow({ product, collections, onRefetch }: ProductTableRowProps) {
  const locale = useLocale();
  const isEn = locale === "en";

  const tHome = useTranslations("dashboard.home");
  const tResources = useTranslations("dashboard.resources");

  const translation =
    product.translations.find((tr) => tr.locale === locale) ||
    product.translations[0] || { name: product.slug };

  const collection = collections.find((c) => String(c.id) === String(product.collectionId));
  const collectionName = collection ? (isEn ? collection.enName : collection.arName) : "—";
  const mainImage = product.images?.find((img) => img.isMain) || product.images?.[0];
  const publicIds = product.images?.map((img) => img.publicId).filter(Boolean) as string[];

  return (
    <TableRow className="group hover:bg-muted/40 transition-colors">
      <TableCell className="text-center p-2.5">
        <div className="size-10 mx-auto rounded-lg overflow-hidden bg-muted/60 border border-border/50 shrink-0 flex items-center justify-center">
          {mainImage?.url ? (
            <img
              src={mainImage.url}
              alt={translation.name || "Product Image"}
              className="size-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="size-full flex items-center justify-center text-muted-foreground/60">
              <ImageIcon className="size-3.5" />
            </div>
          )}
        </div>
      </TableCell>

      <TableCell className="max-w-[180px] sm:max-w-xs truncate py-2.5">
        <Link
          href={`/products/${product.id}`}
          className="font-semibold text-xs sm:text-sm text-foreground hover:text-primary transition-colors block truncate"
        >
          {translation.name}
        </Link>
        <span className="text-[11px] text-muted-foreground truncate block font-mono">
          {product.slug}
        </span>
      </TableCell>

      <TableCell className="hidden md:table-cell text-muted-foreground text-xs font-medium py-2.5">
        {collectionName}
      </TableCell>

      <TableCell className="text-center py-2.5">
        <StatusBadge active={product.status === "active"}>
          <span className="text-[11px]">
            {product.status === "active" ? tHome("table.active") : tHome("table.inactive")}
          </span>
        </StatusBadge>
      </TableCell>

      <TableCell className="hidden lg:table-cell text-center text-xs text-muted-foreground py-2.5">
        {product.warranty ? (
          <span className="inline-flex items-center gap-1 font-medium">
            <ShieldCheck className="size-3.5 text-primary shrink-0" />
            <span>{tHome("table.years", { count: product.warranty })}</span>
          </span>
        ) : (
          "—"
        )}
      </TableCell>

      <TableCell className="hidden xl:table-cell text-xs text-muted-foreground py-2.5">
        {formatDate(product.createdAt, locale)}
      </TableCell>

      <TableCell className="text-end pe-3 py-2.5">
        <div className="inline-flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            nativeButton={false}
            render={<Link href={`/products/${product.id}`} />}
            className="size-7.5 rounded-lg text-muted-foreground hover:text-foreground"
          >
            <Eye className="size-3.5" />
          </Button>
          <DeleteButton
            isIcon
            title={tResources("delete")}
            warningMessage={
              isEn
                ? `Are you sure you want to delete "${translation.name}"? All associated data and images will be permanently removed.`
                : `هل أنت متأكد من حذف "${translation.name}"؟ سيتم حذف جميع الصور والبيانات المرتبطة به نهائيًا.`
            }
            serviceFunc={() => deleteProduct(product.id, locale, publicIds)}
            refetch={onRefetch}
            className="size-7.5"
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
