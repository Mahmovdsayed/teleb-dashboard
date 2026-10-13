'use client';

import { Offer } from "@/types/Offer.types";
import { Card, CardContent, CardFooter, CardHeader } from "./card";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "./button";
import {
    Pencil,
    CalendarDays,
    Percent,
    Megaphone,
    Clock,
    Palette,
} from "lucide-react";
import { formatDate } from "@/functions/format-date";
import { useRouter } from "next/navigation";
import DeleteButton from "./DeleteButton";
import { deleteOffer } from "@/services/offer";
import StatusBadge from "./StatusBadge";

interface IProps {
    offer: Offer;
    refetch: () => void;
}

const OfferCard = ({ offer, refetch }: IProps) => {
    const { push } = useRouter();
    const locale = useLocale();
    const t = useTranslations("dashboard.resources");
    const tf = useTranslations("dashboard.resources.offers");

    const isEnglish = locale === "en";

    const name = isEnglish ? offer.enName : offer.arName;
    const description = isEnglish ? offer.enDescription : offer.arDescription;
    const bannerText = isEnglish ? offer.enBannerText : offer.arBannerText;
    const backgroundColor = offer.bannerBackgroundColor || "#000000";
    const textColor = offer.bannerTextColor || "#ffffff";
    const statusLabel = offer.isActive ? tf("filters.active") : tf("filters.inactive");


    return (
        <Card className="gap-0 overflow-hidden shadow-none transition-colors hover:bg-muted/20">
            <CardHeader className="pb-3">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Percent className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2 className="truncate text-sm font-semibold">{name}</h2>
                        <p className="mt-1 text-xs text-muted-foreground">{t("id")}: {offer.id}</p>
                    </div>
                    <span className="shrink-0 rounded-md bg-primary/10 px-2.5 py-1 text-sm font-bold text-primary">
                        {Number(offer.percentage)}%
                    </span>
                </div>

                {description && (
                    <p className="mt-3 line-clamp-3 md:text-sm leading-relaxed text-muted-foreground">{description}</p>
                )}
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge active={!!offer.isActive}>{statusLabel}</StatusBadge>
                    <StatusBadge active={!!offer.showBanner}>
                        <span className="inline-flex items-center gap-1.5">
                            <Megaphone className="size-3" />
                            {offer.showBanner ? tf("fields.showBanner.label") : tf("filters.hidden")}
                        </span>
                    </StatusBadge>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <Palette className="size-3.5" />
                        {tf("fields.bannerBackgroundColor.label")}
                    </div>

                    <div className="overflow-hidden rounded-lg border" style={{ backgroundColor, color: textColor }}>
                        <div className="flex items-center justify-between gap-3 p-4">
                            <div className="min-w-0 flex-1">
                                {bannerText ? (
                                    <p className="line-clamp-2 md:text-sm font-semibold">{bannerText}</p>
                                ) : (
                                    <p className="md:text-sm opacity-70">
                                        {isEnglish ? "No banner text" : "لا يوجد نص للبانر"}
                                    </p>
                                )}
                                <p className="mt-1 text-xs opacity-80">{name}</p>
                            </div>

                            <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-lg border border-current/20">
                                <span className="md:text-sm font-bold">{Number(offer.percentage)}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                            <span className="size-3 rounded-sm border" style={{ backgroundColor }} />
                            {backgroundColor}
                        </span>

                        <span className="inline-flex items-center gap-1.5">
                            <span className="size-3 rounded-sm border" style={{ backgroundColor: textColor }} />
                            {textColor}
                        </span>
                    </div>
                </div>

                <div className="space-y-2 border-t pt-3">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <CalendarDays className="size-3.5" />
                        {isEnglish ? "Validity period" : "فترة صلاحية العرض"}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="min-w-0 rounded-md bg-muted/50 p-2.5">
                            <p className="text-xs text-muted-foreground">{isEnglish ? "Starts" : "يبدأ"}</p>
                            <p className="mt-1 text-sm font-medium">{formatDate(offer.startDate, locale)}</p>
                        </div>

                        <div className="min-w-0 rounded-md bg-muted/50 p-2.5">
                            <p className="text-xs text-muted-foreground">{isEnglish ? "Ends" : "ينتهي"}</p>
                            <p className="mt-1 text-sm font-medium">{formatDate(offer.endDate, locale)}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-2 border-t pt-3">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <Clock className="size-3.5" />
                        {isEnglish ? "Record information" : "معلومات السجل"}
                    </div>

                    <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-start justify-between gap-3">
                            <span>{t("createdAt")}</span>
                            <span className="text-end">{formatDate(offer.createdAt, locale)}</span>
                        </div>

                        <div className="flex items-start justify-between gap-3">
                            <span>{isEnglish ? "Last updated" : "آخر تحديث"}</span>
                            <span className="text-end">{formatDate(offer.updatedAt, locale)}</span>
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="mt-4 grid grid-cols-2 gap-2">
                <Button
                    onClick={() => push(`/${locale}/offer/${offer.id}/edit`)}
                    variant="default"
                    className="flex-1"
                >
                    <Pencil className="size-3.5" />
                    {t("edit")}
                </Button>

                <DeleteButton
                    refetch={refetch}
                    title={t("delete")}
                    serviceFunc={() => deleteOffer(String(offer.id), locale)}
                    warningMessage={
                        isEnglish
                            ? "Are you sure you want to delete this offer? This action cannot be undone."
                            : "هل أنت متأكد أنك تريد حذف هذا العرض؟ لا يمكن التراجع عن هذا الإجراء."
                    }
                    isIcon={false}
                />
            </CardFooter>
        </Card>
    );
};

export default OfferCard;