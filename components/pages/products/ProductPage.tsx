"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Search } from "lucide-react";

import SectionInfo from "@/components/layout/dashboard/SectionInfo";
import { useAppQuery } from "@/hooks/useAppQuery";
import { getProducts } from "@/services/product";
import { getCollections } from "@/services/collection";
import { getOffers } from "@/services/offer";
import { Product, ProductQueryInput, ProductsResult } from "@/types/Product.types";
import { Collection } from "@/types/Collection.types";
import { OffersResult } from "@/types/Offer.types";
import { useResourceFilters } from "@/hooks/useResourceFilters";
import ResourceFilters from "@/components/ui/ResourceFilters";
import {
  createProductFilters,
  DEFAULT_FILTERS,
  FILTER_KEYS,
} from "@/config/product-filters";
import { usePageSync } from "@/hooks/usePageSync";
import EmptyState from "@/components/ui/EmptyState";
import ProductCard from "@/components/ui/ProductCard";
import ProductSkeleton, {
  ProductCardSkeleton,
} from "@/components/skeletons/ProductSkeleton";
import AppPagination from "@/components/ui/AppPagination";
import { Input } from "@/components/ui/input";

const ProductPage = () => {
  const t = useTranslations("dashboard.resources");
  const tf = useTranslations("dashboard.resources.products.filters");
  const tp = useTranslations("dashboard.resources.products");
  const locale = useLocale();

  const { currentPage, setCurrentPage } = usePageSync();
  const [searchTerm, setSearchTerm] = useState("");

  const defaultFilters = useMemo(
    () => ({ ...DEFAULT_FILTERS, page: currentPage }),
    [currentPage]
  );

  const { filters, updateFilter, resetFilters, hasFilters } =
    useResourceFilters<ProductQueryInput>({
      defaultFilters,
      filterKeys: FILTER_KEYS,
      onPageReset: () => setCurrentPage(1),
    });

  const { data: collectionsData } = useAppQuery<Collection[]>({
    queryFn: getCollections,
    queryKey: ["collections"],
  });

  const { data: offersData } = useAppQuery<OffersResult>({
    queryFn: () => getOffers({ limit: 100 }, locale),
    queryKey: ["offers", "all", locale],
  });

  const activeFilters = useMemo(() => {
    return {
      ...filters,
      q: searchTerm.trim() || undefined,
    };
  }, [filters, searchTerm]);

  const { data, isLoading, isFetching, refetch } = useAppQuery<ProductsResult>({
    queryFn: () => getProducts(activeFilters, locale),
    queryKey: ["products", locale, activeFilters],
  });

  const collections = collectionsData ?? [];
  const offers = offersData?.data ?? [];

  const fields = createProductFilters({
    filters,
    updateFilter,
    collections,
    offers,
    tf,
    locale,
  });

  if (isLoading) return <ProductSkeleton />;

  const products = data?.data ?? [];
  const total = data?.total ?? 0;

  return (
    <section className="space-y-6">
      <SectionInfo
        title={tp("title")}
        desc={tp("listDescription")}
        href="/products/add"
        buttonTitle={t("createTitle", {
          resource: tp("singular"),
        })}
      />

      <div className="relative w-full max-w-md">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          placeholder={tp("searchPlaceholder")}
          className="ps-9 h-10 rounded-xl bg-card border-border/70"
        />
      </div>

      <ResourceFilters
        title={tf("title")}
        resetLabel={tf("reset")}
        hasFilters={hasFilters || Boolean(searchTerm)}
        onReset={() => {
          resetFilters();
          setSearchTerm("");
        }}
        fields={fields}
      />

      <div className="space-y-6">
        {isFetching ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: products.length || 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {products.map((product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
                refetch={refetch}
                collections={collections}
                offers={offers}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title={tp("emptyTitle")}
            description={tp("emptyDescription")}
          />
        )}

        <AppPagination
          total={total}
          pageSize={10}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </section>
  );
};

export default ProductPage;
