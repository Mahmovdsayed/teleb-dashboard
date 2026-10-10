"use client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";
import React from "react";
import ModeToggle from "./ModeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslations } from "next-intl";

const DashboardHeader = () => {
    const pathname = usePathname();
    const t = useTranslations("dashboard")
    const segments = pathname.split("/").filter(Boolean);
    const translatedSegments: Record<string, string> = {
        products: t("navigation.products"),
        collection: t("navigation.collections"),
        banner: t("navigation.banners"),
        offer: t("navigation.offers"),
        message: t("navigation.messages"),
        add: t("resources.add"),
        edit: t("resources.edit"),
    }

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b mb-5 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ms-1" />
                <Separator orientation="vertical" className="me-2 h-4" />

                <Breadcrumb>
                    <BreadcrumbList className="flex-nowrap whitespace-nowrap overflow-hidden max-w-[150px] md:max-w-full">
                        <BreadcrumbItem>
                            <BreadcrumbLink
                                render={
                                    <Link href="/" className="flex items-center gap-1" />
                                }
                            >
                                <Home className="h-4 w-4" />
                                <span
                                    className={segments.length > 1 ? "hidden sm:inline" : "inline"}
                                >
                                    {t("navigation.dashboard")}
                                </span>
                            </BreadcrumbLink>
                        </BreadcrumbItem>

                        {segments
                            .slice(1)
                            .filter((segment) => !/^[0-9a-fA-F]{24}$/.test(segment))
                            .map((segment, index, filteredSegments) => {
                                const originalIndex = segments.indexOf(segment);
                                const href = `/${segments.slice(0, originalIndex + 1).join("/")}`;
                                const isLast = index === filteredSegments.length - 1;

                                if (!isLast) {
                                    return (
                                        <React.Fragment key={href}>
                                            <div className="hidden sm:flex items-center gap-2">
                                                <BreadcrumbSeparator />
                                                <BreadcrumbItem>
                                                    <BreadcrumbLink
                                                        render={
                                                            <Link
                                                                href={href}
                                                                className="capitalize"
                                                            />
                                                        }
                                                    >
                                                        {translatedSegments[segment] ?? segment}
                                                    </BreadcrumbLink>
                                                </BreadcrumbItem>
                                            </div>
                                        </React.Fragment>
                                    );
                                }

                                return (
                                    <React.Fragment key={href}>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage className="capitalize truncate max-w-[100px] sm:max-w-full">
                                                {translatedSegments[segment] ?? segment}
                                            </BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </React.Fragment>
                                );
                            })}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className="flex items-center gap-2 px-4">
                <ModeToggle />
                <LanguageSwitcher />
            </div>
        </header>
    );
};

export default DashboardHeader;
