'use client';

import SectionInfo from "@/components/layout/dashboard/SectionInfo";
import BannerCard from "@/components/ui/BannerCard";
import EmptyState from "@/components/ui/EmptyState";
import { useAppQuery } from "@/hooks/useAppQuery";
import { getBanners } from "@/services/banner";
import { Banner } from "@/types/Banner.types";
import { useTranslations } from "next-intl";

const BannerPage = () => {
    const t = useTranslations("dashboard.resources")
    const { data, isLoading, refetch } = useAppQuery<Banner[]>({ queryFn: getBanners, queryKey: ['banners'] })
    if (isLoading) return;

    return <>
        <section>
            <SectionInfo
                title={t("banners.title")}
                desc={t("banners.listDescription")}
                href={"/banner/add"}
                buttonTitle={t("createTitle", {
                    resource: t("banners.singular"),
                })}
            />
            {data?.length ? (
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                    {data.map((banner: Banner) => (
                        <BannerCard key={banner.id} banner={banner} refetch={refetch} />
                    ))}
                </div>
            ) : (
                <EmptyState
                    title={t("banners.emptyTitle")}
                    description={t("banners.emptyDescription")}
                />
            )}
        </section>
    </>;
};

export default BannerPage;