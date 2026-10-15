'use client';

import SectionInfo from "@/components/layout/dashboard/SectionInfo";
import CollectionSkeleton from "@/components/skeletons/CollectionSkeleton";
import CollectionCard from "@/components/ui/CollectionCard";
import EmptyState from "@/components/ui/EmptyState";
import { useAppQuery } from "@/hooks/useAppQuery";
import { getCollections } from "@/services/collection";
import { Collection } from "@/types/Collection.types";
import { useTranslations } from "next-intl";

const CollectionPage = () => {
    const t = useTranslations("dashboard.resources")
    const { data, isLoading, refetch } = useAppQuery<Collection[]>({ queryFn: getCollections, queryKey: ['collections'] })
    if (isLoading) return <CollectionSkeleton />

    return <>
        <section>
            <SectionInfo
                title={t("collections.title")}
                desc={t("collections.listDescription")}
                href={"/collection/add"}
                buttonTitle={t("createTitle", {
                    resource: t("collections.singular"),
                })}
            />
            {data?.length ? (
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
                    {data.map((collection: Collection) => (
                        <CollectionCard
                            refetch={refetch}
                            collection={collection}
                            key={collection.id}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState
                    title={t("collections.emptyTitle")}
                    description={t("collections.emptyDescription")}
                />
            )}
        </section>
    </>;
};

export default CollectionPage;