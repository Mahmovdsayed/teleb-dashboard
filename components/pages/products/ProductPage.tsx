"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Loader2, Search, X } from "lucide-react";
import SectionInfo from "@/components/layout/dashboard/SectionInfo";
import { useAppQuery, keepPreviousData } from "@/hooks/useAppQuery";
import { cn } from "@/lib/utils";
import { getProducts } from "@/services/product";
import { getCollections } from "@/services/collection";
import { getOffers } from "@/services/offer";
import { Product, ProductQueryInput, ProductsResult } from "@/types/Product.types";
import { Collection } from "@/types/Collection.types";
import { OffersResult } from "@/types/Offer.types";
import { useResourceFilters } from "@/hooks/useResourceFilters";
import ResourceFilters from "@/components/ui/ResourceFilters";
import { createProductFilters, DEFAULT_FILTERS, FILTER_KEYS } from "@/config/product-filters";
import { usePageSync } from "@/hooks/usePageSync";
import EmptyState from "@/components/ui/EmptyState";
import ProductCard from "@/components/ui/ProductCard";
import ProductSkeleton, { ProductCardSkeleton } from "@/components/skeletons/ProductSkeleton";
import AppPagination from "@/components/ui/AppPagination";
import { Input } from "@/components/ui/input";

const ProductPage = () => {
  const t = useTranslations("dashboard.resources");
  const tf = useTranslations("dashboard.resources.products.filters");
  const tp = useTranslations("dashboard.resources.products");
  const locale = useLocale();

  const { currentPage, setCurrentPage } = usePageSync();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      const nextSearch = searchTerm.trim();

      setDebouncedSearch((previous) => {
        if (previous.trim() !== nextSearch) {
          setCurrentPage(1);
        }

        return nextSearch;
      });
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm, setCurrentPage]);

  const defaultFilters = DEFAULT_FILTERS;

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
      q: debouncedSearch.trim() || undefined,
    };
  }, [filters, debouncedSearch]);

  const { data, isLoading, isFetching, refetch } = useAppQuery<ProductsResult>({
    queryFn: () => getProducts(activeFilters, locale),
    queryKey: ["products", locale, activeFilters],
    placeholderData: keepPreviousData,
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

  if (isLoading && !data) return <ProductSkeleton />;

  const products = data?.data ?? [];
  const total = data?.total ?? 0;
  const isSearching = isFetching || searchTerm !== debouncedSearch;

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
        <Search className="absolute inset-s-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={tp("searchPlaceholder")}
          className="ps-9 pe-9 h-10 rounded-xl bg-card border-border/70"
        />
        <div className="absolute inset-e-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {isSearching && (
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          )}
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setDebouncedSearch("");
                setCurrentPage(1);
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      <ResourceFilters
        title={tf("title")}
        resetLabel={tf("reset")}
        hasFilters={hasFilters || Boolean(searchTerm)}
        onReset={() => {
          resetFilters();
          setSearchTerm("");
          setDebouncedSearch("");
        }}
        fields={fields}
      />

      <div className="space-y-6">
        {products.length ? (
          <div
            className={cn(
              "grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3 transition-opacity duration-200",
              isFetching && "opacity-60 pointer-events-none"
            )}
          >
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
        ) : isFetching ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
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
          pageSize={100}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </section>
  );
};

export default ProductPage;
