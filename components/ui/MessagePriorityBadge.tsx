'use client';

import { MessagePriority } from "@/types/Message.types";
import { useTranslations } from "next-intl";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
    priority: MessagePriority | string;
    locale: string;
    showExplanation?: boolean;
}

const MessagePriorityBadge = ({ priority, locale, showExplanation = true }: Props) => {
    const t = useTranslations("dashboard.resources.messages");

    const normalizedPriority = (priority?.toLowerCase() || "medium") as MessagePriority;

    const config: Record<MessagePriority, {
        label: string;
        desc: string;
        badgeClass: string;
    }> = {
        high: {
            label: t("priorities.high"),
            desc: t("priorities.highDesc"),
            badgeClass: "bg-destructive/10 text-destructive",
        },
        medium: {
            label: t("priorities.medium"),
            desc: t("priorities.mediumDesc"),
            badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        },
        low: {
            label: t("priorities.low"),
            desc: t("priorities.lowDesc"),
            badgeClass: "bg-muted text-muted-foreground",
        },
    };

    const current = config[normalizedPriority] || config.medium;

    const badgeElement = (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${current.badgeClass}`}>
            {current.label}
        </span>
    );

    if (!showExplanation) {
        return badgeElement;
    }

    return (
        <TooltipProvider delay={100}>
            <Tooltip>
                <TooltipTrigger render={badgeElement} />
                <TooltipContent side="top" className="max-w-xs p-2.5 text-xs">
                    <p className="leading-relaxed">{current.desc}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default MessagePriorityBadge;
