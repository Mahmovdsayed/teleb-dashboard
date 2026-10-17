'use client';

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCheck, Loader2, Mail, Phone, User, CalendarDays, Tag } from "lucide-react";
import { Message } from "@/types/Message.types";
import { formatDate } from "@/functions/format-date";
import { useFormHandler } from "@/hooks/useFormHandler";
import z from "zod";
import { getMessageById, markMessageAsViewed } from "@/services/message";
import MessagePriorityBadge from "./MessagePriorityBadge";

interface MessageViewDialogProps {
    message: Message;
    open: boolean;
    onClose: () => void;
    refetch: () => void;
}

const MessageViewDialog = ({ message, open, onClose, refetch }: MessageViewDialogProps) => {
    const locale = useLocale();
    const t = useTranslations("dashboard.resources.messages");
    const tg = useTranslations("dashboard.resources");
    const [confirmStep, setConfirmStep] = useState(false);
    const [content, setContent] = useState<string>(message.message || "");
    const [fetchingContent, setFetchingContent] = useState<boolean>(!message.message);

    useEffect(() => {
        if (!open) {
            setConfirmStep(false);
            return;
        }

        if (message.message) {
            setContent(message.message);
            setFetchingContent(false);
            return;
        }

        setFetchingContent(true);
        getMessageById(message.id, locale)
            .then((res) => {
                setContent(res?.message || "");
            })
            .catch(() => {
                setContent("");
            })
            .finally(() => {
                setFetchingContent(false);
            });
    }, [open, message.id, message.message, locale]);

    const { onSubmit, loading } = useFormHandler({
        schema: z.object({}),
        service: () => markMessageAsViewed(message.id, locale),
        onSuccess: () => {
            refetch();
            onClose();
            setConfirmStep(false);
        },
        onError: () => {
            setConfirmStep(false);
        },
    });

    const handleClose = () => {
        onClose();
        setConfirmStep(false);
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose(); }}>
            <DialogContent className="sm:max-w-2xl md:max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Mail className="size-4 shrink-0" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <DialogTitle className="text-sm font-semibold leading-snug">{message.subject}</DialogTitle>
                            <DialogDescription className="mt-1 text-xs text-muted-foreground">
                                {t("viewDialog.subtitle")}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        <div className="flex items-center gap-2.5 rounded-lg bg-muted/40 p-2.5">
                            <User className="size-3.5 shrink-0 text-muted-foreground" />
                            <div className="min-w-0">
                                <p className="text-xs text-muted-foreground">{t("fields.fullName")}</p>
                                <p className="mt-0.5 truncate text-xs sm:text-sm font-medium">{message.fullName}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5 rounded-lg bg-muted/40 p-2.5">
                            <Mail className="size-3.5 shrink-0 text-muted-foreground" />
                            <div className="min-w-0">
                                <p className="text-xs text-muted-foreground">{t("fields.email")}</p>
                                <p className="mt-0.5 truncate text-xs sm:text-sm font-medium">{message.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5 rounded-lg bg-muted/40 p-2.5">
                            <Phone className="size-3.5 shrink-0 text-muted-foreground" />
                            <div className="min-w-0">
                                <p className="text-xs text-muted-foreground">{t("fields.phone")}</p>
                                <p className="mt-0.5 truncate text-xs sm:text-sm font-medium">{message.phone}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5 rounded-lg bg-muted/40 p-2.5">
                            <CalendarDays className="size-3.5 shrink-0 text-muted-foreground" />
                            <div className="min-w-0">
                                <p className="text-xs text-muted-foreground">{tg("createdAt")}</p>
                                <p className="mt-0.5 text-xs sm:text-sm font-medium">{formatDate(message.createdAt, locale)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 rounded-lg bg-muted/40 p-2.5">
                        <Tag className="size-3.5 shrink-0 text-muted-foreground" />
                        <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                            <p className="text-xs text-muted-foreground">{t("fields.priority")}</p>
                            <MessagePriorityBadge priority={message.priority} locale={locale} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">{t("fields.message")}</p>
                        <div className="min-h-28 rounded-lg border bg-muted/20 p-3.5">
                            {fetchingContent ? (
                                <div className="flex items-center justify-center py-6 text-muted-foreground">
                                    <Loader2 className="size-4 animate-spin" />
                                </div>
                            ) : (
                                <p className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed text-foreground">
                                    {content || t("fields.noContent")}
                                </p>
                            )}
                        </div>
                    </div>

                    {!message.isViewed && (
                        <div className={`rounded-lg border p-3 text-xs leading-relaxed ${confirmStep ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400" : "border-muted bg-muted/30 text-muted-foreground"}`}>
                            <div className="flex items-start gap-2">
                                <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                                <span>
                                    {confirmStep
                                        ? t("viewDialog.confirmWarning")
                                        : t("viewDialog.markAsReadHint")}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-2">
                    <Button variant="outline" onClick={handleClose} className="flex-1 sm:flex-none text-xs sm:text-sm">
                        {tg("cancel")}
                    </Button>

                    {!message.isViewed && (
                        confirmStep ? (
                            <Button
                                variant="default"
                                onClick={onSubmit}
                                disabled={loading}
                                className="flex-1 sm:flex-none text-xs sm:text-sm"
                            >
                                {loading ? (
                                    <Loader2 className="size-3.5 animate-spin" />
                                ) : (
                                    <>
                                        <CheckCheck className="size-3.5" />
                                        {t("viewDialog.confirmMarkAsRead")}
                                    </>
                                )}
                            </Button>
                        ) : (
                            <Button
                                variant="default"
                                onClick={() => setConfirmStep(true)}
                                className="flex-1 gap-1.5 sm:flex-none text-xs sm:text-sm"
                            >
                                <CheckCheck className="size-3.5" />
                                {t("viewDialog.markAsRead")}
                            </Button>
                        )
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default MessageViewDialog;
