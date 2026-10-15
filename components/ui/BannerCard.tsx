'use client';

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { CalendarDays, Images, Pencil } from "lucide-react";

import { Banner } from "@/types/Banner.types";
import { formatDate } from "@/functions/format-date";
import { deleteBanner } from "@/services/banner";
import { Card, CardContent, CardFooter, CardHeader } from "./card";
import { Button } from "./button";
import DeleteButton from "./DeleteButton";
import MediaCarousel from "./MediaCarousel";
import { useMemo } from "react";

interface IProps {
    banner: Banner;
    refetch: () => void;
}

const BannerCard = ({ banner, refetch }: IProps) => {
    const { push } = useRouter();
    const locale = useLocale();
    const t = useTranslations("dashboard.resources");

    const items = useMemo(
        () =>
            [...banner.images]
                .sort((a, b) => a.order - b.order)
                .map((image, index) => ({
                    id: image.publicId,
                    url: image.url,
                    alt: `${banner.title} ${index + 1}`,
                })),
        [banner.images, banner.title]
    );

    return (
        <Card className="gap-0 shadow-none transition-colors hover:bg-muted/20">
            <CardHeader className="pb-3">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Images className="size-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <h2 className="truncate text-sm font-semibold" title={banner.title}>
                            {banner.title}
                        </h2>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {t("id")}: {banner.id}
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">
                <MediaCarousel items={items} aspect="video" emptyLabel={t("noImages")} />

                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t pt-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="size-3.5 shrink-0" />
                        <span>
                            {t("createdAt")}: {formatDate(banner.createdAt, locale)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Images className="size-3.5 shrink-0" />
                        <span>{t("imagesCount", { count: items.length })}</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="mt-4 grid grid-cols-2 gap-2">
                <Button
                    onClick={() => push(`/${locale}/banner/${banner.id}/edit`)}
                    variant="default"
                    className="flex-1"
                >
                    <Pencil className="size-3.5" />
                    {t("edit")}
                </Button>

                <DeleteButton
                    refetch={refetch}
                    title={t("delete")}
                    serviceFunc={() => deleteBanner(String(banner.id), locale, banner.images.map((img) => img.publicId))}
                    warningMessage={
                        locale === "en"
                            ? "Are you sure you want to delete this banner? This action cannot be undone."
                            : "هل أنت متأكد أنك تريد حذف هذا البانر؟ لا يمكن التراجع عن هذا الإجراء."
                    }
                    isIcon={false}
                />
            </CardFooter>
        </Card>
    );
};

export default BannerCard;