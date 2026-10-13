'use client';

import { useLocale, useTranslations } from "next-intl";
import SectionInfo from "@/components/layout/dashboard/SectionInfo";
import { useAppQuery } from "@/hooks/useAppQuery";
import { getOffers } from "@/services/offer";
import { Offer, OfferQueryInput, OffersResult } from "@/types/Offer.types";
import { useResourceFilters } from "@/hooks/useResourceFilters";
import ResourceFilters from "@/components/ui/ResourceFilters";
import { createOfferFilters, DEFAULT_FILTERS, FILTER_KEYS } from "@/config/offer-filters";
import { usePageSync } from "@/hooks/usePageSync";
import { useMemo } from "react";
import EmptyState from "@/components/ui/EmptyState";
import OfferCard from "@/components/ui/OfferCard";
import OfferSkeleton, { OfferCardSkeleton } from "@/components/skeletons/OfferSkeleton";
import AppPagination from "@/components/ui/AppPagination";

const OfferPage = () => {
    const t = useTranslations("dashboard.resources");
    const tf = useTranslations("dashboard.resources.offers.filters");
    const locale = useLocale();

    const { currentPage, setCurrentPage } = usePageSync();
    const defaultFilters = useMemo(() => ({ ...DEFAULT_FILTERS, page: currentPage }), [currentPage]);

    const { filters, updateFilter, resetFilters, hasFilters } = useResourceFilters<OfferQueryInput>({ defaultFilters, filterKeys: FILTER_KEYS, onPageReset: () => setCurrentPage(1) });
    const { data, isLoading, isFetching, refetch } = useAppQuery<OffersResult>({ queryFn: () => getOffers(filters, locale), queryKey: ["offers", locale, filters] });
    const fields = createOfferFilters({ filters, updateFilter, tf });

    if (isLoading) return <OfferSkeleton />;

    const offers = data?.data ?? [];
    const total = data?.total ?? 0;

    return (
        <section className="space-y-6">
            <SectionInfo
                title={t("offers.title")}
                desc={t("offers.listDescription")}
                href="/offer/add"
                buttonTitle={t("createTitle", {
                    resource: t("offers.singular"),
                })}
            />

            <ResourceFilters
                title={tf("title")}
                resetLabel={tf("reset")}
                hasFilters={hasFilters}
                onReset={resetFilters}
                fields={fields}
            />

            <div className="space-y-6">
                {isFetching ? (
                    <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                        {Array.from({ length: offers.length || 4 }).map((_, i) => (
                            <OfferCardSkeleton key={i} />
                        ))}
                    </div>
                ) : offers.length ? (
                    <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                        {offers.map((offer: Offer) => (
                            <OfferCard key={offer.id} offer={offer} refetch={refetch} />
                        ))}
                    </div>
                ) : (
                    <EmptyState title={tf("emptyTitle")} description={tf("emptyDescription")} />
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

export default OfferPage;
