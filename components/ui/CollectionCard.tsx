'use client';

import { Collection } from "@/types/Collection.types";
import { Card, CardContent, CardFooter, CardHeader } from "./card";
import { useLocale, useTranslations } from "next-intl";
import { CollectionIcon } from "./Icon";
import { Button } from "./button";
import { Pencil, CalendarDays } from "lucide-react";
import { formatDate } from "@/functions/format-date";
import { useRouter } from "next/navigation";
import { useOptimisticDashboard } from "@/hooks/useOptimisticDashboard";
import DeleteButton from "./DeleteButton";
import { deleteCollection, getCollections } from "@/services/collection";

interface IProps {
    collection: Collection;
}

const CollectionCard = ({ collection }: IProps) => {
    const { push } = useRouter()
    const locale = useLocale();
    const t = useTranslations("dashboard.resources");
    const name = locale === "en" ? collection.enName : collection.arName;

    const { onDelete, onSuccess, onError } = useOptimisticDashboard({
        queryKey: ["collections"],
        arrayKey: "collections"
    });


    return (
        <Card className="gap-0 shadow-none transition-colors hover:bg-muted/20">
            <CardHeader className="pb-3">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <CollectionIcon
                            name={collection.icon}
                            className="size-5"
                        />
                    </div>

                    <div className="min-w-0 flex-1">
                        <h2 className="truncate text-sm font-semibold">
                            {name}
                        </h2>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {t("id")}: {collection.id}
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="flex items-center gap-2 border-t pt-3 text-xs text-muted-foreground">
                    <CalendarDays className="size-3.5 shrink-0" />
                    <span>{t("createdAt")}: {formatDate(collection.createdAt, locale)}</span>
                </div>

            </CardContent>
            <CardFooter className="mt-4 grid grid-cols-2 gap-2">
                <Button onClick={() => push(`/${locale}/collection/${collection.id}/edit`)} variant="default" className="flex-1">
                    <Pencil className="size-3.5" />
                    {t("edit")}
                </Button>

                <DeleteButton
                    title={t("delete")}
                    serviceFunc={() => deleteCollection(String(collection.id), locale)}
                    onMutate={() => onDelete(collection.id)}
                    onError={onError}
                    onSuccess={onSuccess}
                    warningMessage={
                        locale === "en"
                            ? "Are you sure you want to delete this collection? This action cannot be undone."
                            : "هل أنت متأكد أنك تريد حذف هذه المجموعة؟ لا يمكن التراجع عن هذا الإجراء."
                    }
                    isIcon={false}
                />
            </CardFooter>
        </Card>
    );
};

export default CollectionCard;