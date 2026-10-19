'use client';

import { useMemo } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { FolderKanban, Tag, Package, MessageSquare, ArrowUpRight } from "lucide-react";
import { AnalyticsData } from "@/types/Analytics.types";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardsSectionProps {
  analytics?: AnalyticsData;
  isLoading: boolean;
}

export default function StatCardsSection({ analytics, isLoading }: StatCardsSectionProps) {
  const tHome = useTranslations("dashboard.home");
  const tNav = useTranslations("dashboard.navigation");

  const statCards = useMemo(() => {
    return [
      {
        title: tHome("stats.collections"),
        value: analytics?.collections.total ?? 0,
        subtext: tNav("collections"),
        href: "/collection",
        icon: FolderKanban,
      },
      {
        title: tHome("stats.offers"),
        value: analytics?.offers.total ?? 0,
        subtext:
          analytics?.offers.currentlyActive === 1
            ? tHome("stats.currentlyActive", { count: 1 })
            : tHome("stats.currentlyActivePlural", { count: analytics?.offers.currentlyActive ?? 0 }),
        href: "/offer",
        icon: Tag,
      },
      {
        title: tHome("stats.products"),
        value: analytics?.products.total ?? 0,
        subtext: tHome("stats.activeCount", {
          active: analytics?.products.active ?? 0,
          total: analytics?.products.total ?? 0,
        }),
        href: "/products",
        icon: Package,
      },
      {
        title: tHome("stats.messages"),
        value: analytics?.messages.total ?? 0,
        subtext:
          analytics?.messages.unread && analytics.messages.unread > 0
            ? tHome("stats.unreadMessages", { count: analytics.messages.unread })
            : tHome("stats.highPriorityMessages", { count: analytics?.messages.highPriority ?? 0 }),
        href: "/message",
        icon: MessageSquare,
      },
    ];
  }, [analytics, tHome, tNav]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {statCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Link key={idx} href={card.href} className="group block focus-visible:outline-none">
            <Card className="transition-all duration-200 border-border/70 bg-card hover:border-border hover:bg-muted/30 hover:shadow-xs">
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground truncate">{card.title}</p>
                  {isLoading ? (
                    <Skeleton className="h-7 w-16 my-0.5" />
                  ) : (
                    <p className="text-xl md:text-2xl font-bold tracking-tight text-foreground">{card.value}</p>
                  )}
                  <p className="text-[11px] text-muted-foreground/80 truncate">{card.subtext}</p>
                </div>
                <div className="flex flex-col items-end justify-between self-stretch shrink-0 gap-3">
                  <div className="p-2 rounded-lg bg-muted text-foreground/80 transition-transform group-hover:scale-105 border border-border/50">
                    <Icon className="size-4" />
                  </div>
                  <ArrowUpRight className="size-3.5 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
