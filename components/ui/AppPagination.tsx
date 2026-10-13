'use client';

import { useLocale } from "next-intl";
import { usePageSync } from "@/hooks/usePageSync";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "cn";

export interface AppPaginationProps {
    total: number;
    pageSize?: number;
    currentPage?: number;
    onPageChange?: (page: number) => void;
    className?: string;
    previousLabel?: string;
    nextLabel?: string;
}

function getPageNumbers(currentPage: number, totalPages: number): (number | "ellipsis")[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, "ellipsis", totalPages];
    if (currentPage >= totalPages - 3) return [1, "ellipsis", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
}

export default function AppPagination({
    total,
    pageSize = 10,
    currentPage: controlledPage,
    onPageChange,
    className,
    previousLabel,
    nextLabel,
}: AppPaginationProps) {
    const locale = useLocale();
    const { currentPage: syncPage, setCurrentPage: setSyncPage } = usePageSync();
    const activePage = controlledPage ?? syncPage;
    const totalPages = Math.ceil(total / pageSize);
    if (total <= pageSize || totalPages <= 1)  return null;

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages || page === activePage) return;
        if (onPageChange) {
            onPageChange(page);
        } else {
            setSyncPage(page);
        }
    };

    const isArabic = locale === "ar";
    const prevText = previousLabel ?? (isArabic ? "السابق" : "Previous");
    const nextText = nextLabel ?? (isArabic ? "التالي" : "Next");
    const pages = getPageNumbers(activePage, totalPages);

    return (
        <div className={cn("flex w-full items-center justify-center pt-4", className)}>
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            text={prevText}
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(activePage - 1);
                            }}
                            className={cn(activePage <= 1 && "pointer-events-none opacity-40 select-none")}
                            aria-disabled={activePage <= 1}
                            tabIndex={activePage <= 1 ? -1 : undefined}
                        />
                    </PaginationItem>

                    {pages.map((item, index) => {
                        if (item === "ellipsis") {
                            return (
                                <PaginationItem key={`ellipsis-${index}`}>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            );
                        }

                        const isCurrent = item === activePage;
                        return (
                            <PaginationItem key={item}>
                                <PaginationLink
                                    href="#"
                                    isActive={isCurrent}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handlePageChange(item);
                                    }}
                                >
                                    {item}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    })}

                    <PaginationItem>
                        <PaginationNext
                            text={nextText}
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(activePage + 1);
                            }}
                            className={cn(
                                activePage >= totalPages && "pointer-events-none opacity-40 select-none"
                            )}
                            aria-disabled={activePage >= totalPages}
                            tabIndex={activePage >= totalPages ? -1 : undefined}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
