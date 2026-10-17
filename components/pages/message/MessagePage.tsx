'use client';

import { useLocale, useTranslations } from "next-intl";
import SectionInfo from "@/components/layout/dashboard/SectionInfo";
import { useAppQuery, keepPreviousData } from "@/hooks/useAppQuery";
import { getMessages } from "@/services/message";
import { Message, MessageQueryInput, MessagesResult } from "@/types/Message.types";
import { useResourceFilters } from "@/hooks/useResourceFilters";
import ResourceFilters from "@/components/ui/ResourceFilters";
import { createMessageFilters, DEFAULT_FILTERS, FILTER_KEYS } from "@/config/message-filters";
import { usePageSync } from "@/hooks/usePageSync";
import { useMemo } from "react";
import EmptyState from "@/components/ui/EmptyState";
import MessageCard from "@/components/ui/MessageCard";
import MessageSkeleton, { MessageCardSkeleton } from "@/components/skeletons/MessageSkeleton";
import AppPagination from "@/components/ui/AppPagination";
import MessageSearchBar from "@/components/ui/MessageSearchBar";

const MessagePage = () => {
    const t = useTranslations("dashboard.resources");
    const tf = useTranslations("dashboard.resources.messages.filters");
    const locale = useLocale();

    const { currentPage, setCurrentPage } = usePageSync();
    const defaultFilters = useMemo(() => ({ ...DEFAULT_FILTERS, page: currentPage }), [currentPage]);

    const { filters, updateFilter, resetFilters, hasFilters } = useResourceFilters<MessageQueryInput>({
        defaultFilters,
        filterKeys: FILTER_KEYS,
        onPageReset: () => setCurrentPage(1),
    });

    const { data, isLoading, isFetching, refetch } = useAppQuery<MessagesResult>({
        queryFn: () => getMessages(filters, locale),
        queryKey: ["messages", locale, filters],
        placeholderData: keepPreviousData,
    });

    const fields = createMessageFilters({ filters, updateFilter, tf });

    if (isLoading && !data) return <MessageSkeleton />;

    const messages = data?.data ?? [];
    const total = data?.total ?? 0;

    return (
        <section className="space-y-6">
            <SectionInfo
                title={t("messages.title")}
                desc={t("messages.listDescription")}
            />

            <div className="space-y-4">
                <MessageSearchBar
                    value={filters.search ?? ""}
                    onChange={(search) => updateFilter("search", search || undefined)}
                    placeholder={tf("searchPlaceholder")}
                    isSearching={isFetching}
                />

                <ResourceFilters
                    title={tf("title")}
                    resetLabel={tf("reset")}
                    hasFilters={hasFilters}
                    onReset={resetFilters}
                    fields={fields}
                />
            </div>

            <div className="space-y-6">
                {isFetching ? (
                    <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                        {Array.from({ length: messages.length || 4 }).map((_, i) => (
                            <MessageCardSkeleton key={i} />
                        ))}
                    </div>
                ) : messages.length ? (
                    <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                        {messages.map((message: Message) => (
                            <MessageCard key={message.id} message={message} refetch={refetch} />
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

export default MessagePage;