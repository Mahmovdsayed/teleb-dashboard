'use client';

import { useLocale, useTranslations } from "next-intl";
import SectionInfo from "@/components/layout/dashboard/SectionInfo";
import { useAppQuery } from "@/hooks/useAppQuery";
import { getOffers } from "@/services/offer";
import { Offer, OfferQueryInput } from "@/types/Offer.types";
import { Card, CardContent } from "@/components/ui/card";
import { useResourceFilters } from "@/hooks/useResourceFilters";
import ResourceFilters from "@/components/ui/ResourceFilters";
import { createOfferFilters, DEFAULT_FILTERS, FILTER_KEYS } from "@/config/offer-filters";
import { usePageSync } from "@/hooks/usePageSync";
import { useMemo } from "react";
import EmptyState from "@/components/ui/EmptyState";



const OfferPage = () => {
    const t = useTranslations("dashboard.resources");
    const tf = useTranslations("dashboard.resources.offers.filters");
    const locale = useLocale();

    const { currentPage, setCurrentPage } = usePageSync();
    const defaultFilters = useMemo(() => ({ ...DEFAULT_FILTERS, page: currentPage }), [currentPage]);

    const { filters, updateFilter, resetFilters, hasFilters } = useResourceFilters<OfferQueryInput>({ defaultFilters, filterKeys: FILTER_KEYS, onPageReset: () => setCurrentPage(1) });
    const { data, isLoading, isFetching } = useAppQuery<Offer[]>({ queryFn: () => getOffers(filters, locale), queryKey: ["offers", locale, filters] });
    const fields = createOfferFilters({ filters, updateFilter, tf });

    // if (isLoading) return null;

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

            <ResourceFilters title={tf("title")}
                resetLabel={tf("reset")}
                hasFilters={hasFilters}
                onReset={resetFilters}
                fields={fields}
            />

            <div className="space-y-3">
                {data?.length ? (
                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
                        {data.map((offer) => (
                            <Card key={offer.id} className="gap-2 py-4">
                                <CardContent className="space-y-2">
                                    <h3 className="font-semibold">
                                        {locale === "ar"
                                            ? offer.arName
                                            : offer.enName}
                                    </h3>

                                    <p className="text-sm text-muted-foreground">
                                        {offer.percentage}%{" "}
                                        {tf("discount")}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title={tf("emptyTitle")}
                        description={tf("emptyDescription")}
                    />
                )}
            </div>
        </section>
    );
};

export default OfferPage;
