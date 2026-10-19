'use client';

import { useState } from "react";
import { useLocale } from "next-intl";
import { useAppQuery, keepPreviousData } from "@/hooks/useAppQuery";
import { getAnalytics } from "@/services/analytics";
import { getProducts } from "@/services/product";
import { getCollections } from "@/services/collection";
import { AnalyticsData } from "@/types/Analytics.types";
import { ProductsResult } from "@/types/Product.types";
import { Collection } from "@/types/Collection.types";
import StatCardsSection from "./StatCardsSection";
import RecentProductsTable from "./RecentProductsTable";

export default function HomePage() {
    const locale = useLocale();
    const [currentPage, setCurrentPage] = useState(1);

    const { data: analytics, isLoading: analyticsLoading } = useAppQuery<AnalyticsData>({
        queryFn: () => getAnalytics(),
        queryKey: ["analytics"],
    });

    const {
        data: productsData,
        isLoading: productsLoading,
        refetch: refetchProducts,
    } = useAppQuery<ProductsResult>({
        queryFn: () => getProducts({ page: currentPage, limit: 1, sort: "createdAt", order: "desc" }, locale),
        queryKey: ["products", "home-table", locale, currentPage],
        placeholderData: keepPreviousData,
    });

    const { data: collectionsData } = useAppQuery<Collection[]>({
        queryFn: getCollections,
        queryKey: ["collections"],
    });

    const collections = collectionsData ?? [];
    const products = productsData?.data ?? [];
    const total = productsData?.total ?? 0;

    return (
        <div className="space-y-6 pb-10">
            <StatCardsSection analytics={analytics} isLoading={analyticsLoading} />
            <RecentProductsTable
                products={products}
                collections={collections}
                isLoading={productsLoading}
                total={total}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                onRefetch={refetchProducts}
            />
        </div>
    );
}