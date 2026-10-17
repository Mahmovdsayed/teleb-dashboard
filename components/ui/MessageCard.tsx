'use client';

import { useState } from "react";
import { Message } from "@/types/Message.types";
import { Card, CardContent, CardFooter, CardHeader } from "./card";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "./button";
import { Eye, Mail, Phone, CalendarDays, User, MailOpen } from "lucide-react";
import { formatDate } from "@/functions/format-date";
import DeleteButton from "./DeleteButton";
import { deleteMessage } from "@/services/message";
import StatusBadge from "./StatusBadge";
import MessagePriorityBadge from "./MessagePriorityBadge";
import MessageViewDialog from "./MessageViewDialog";

interface Props {
    message: Message;
    refetch: () => void;
}

const MessageCard = ({ message, refetch }: Props) => {
    const [viewOpen, setViewOpen] = useState(false);
    const locale = useLocale();
    const t = useTranslations("dashboard.resources");
    const tm = useTranslations("dashboard.resources.messages");

    const isEnglish = locale === "en";

    return (
        <>
            <Card className="gap-0 overflow-hidden shadow-none transition-colors hover:bg-muted/20">
                <CardHeader className="pb-3">
                    <div className="flex min-w-0 items-start gap-3">
                        <div className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${message.isViewed ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"}`}>
                            {message.isViewed ? <MailOpen className="size-5" /> : <Mail className="size-5" />}
                        </div>

                        <div className="min-w-0 flex-1">
                            <h2 className="truncate text-sm font-semibold">{message.subject}</h2>
                            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                                <User className="size-3 shrink-0" />
                                <span className="truncate">{message.fullName}</span>
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-end gap-1.5 shrink-0">
                            <MessagePriorityBadge priority={message.priority} locale={locale} />
                            <StatusBadge active={!message.isViewed}>
                                {message.isViewed ? tm("status.read") : tm("status.unread")}
                            </StatusBadge>
                        </div>
                    </div>

                    {message.message && (
                        <p className="mt-3 line-clamp-2 text-xs md:text-sm leading-relaxed text-muted-foreground">
                            {message.message}
                        </p>
                    )}
                </CardHeader>

                <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5 min-w-0 rounded-md bg-muted/40 p-2">
                            <Mail className="size-3.5 shrink-0 text-muted-foreground" />
                            <span className="truncate">{message.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 min-w-0 rounded-md bg-muted/40 p-2">
                            <Phone className="size-3.5 shrink-0 text-muted-foreground" />
                            <span className="truncate">{message.phone}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <CalendarDays className="size-3.5 shrink-0" />
                            {t("createdAt")}
                        </span>
                        <span>{formatDate(message.createdAt, locale)}</span>
                    </div>
                </CardContent>

                <CardFooter className="mt-2 grid grid-cols-2 gap-2">
                    <Button
                        onClick={() => setViewOpen(true)}
                        variant="default"
                        className="flex-1"
                    >
                        <Eye className="size-3.5" />
                        {tm("view")}
                    </Button>

                    <DeleteButton
                        refetch={refetch}
                        title={t("delete")}
                        serviceFunc={() => deleteMessage(String(message.id), locale)}
                        warningMessage={
                            isEnglish
                                ? "Are you sure you want to delete this message? This action cannot be undone."
                                : "هل أنت متأكد من حذف هذه الرسالة؟ لا يمكن التراجع عن هذا الإجراء."
                        }
                        isIcon={false}
                    />
                </CardFooter>
            </Card>

            <MessageViewDialog
                message={message}
                open={viewOpen}
                onClose={() => setViewOpen(false)}
                refetch={refetch}
            />
        </>
    );
};

export default MessageCard;
