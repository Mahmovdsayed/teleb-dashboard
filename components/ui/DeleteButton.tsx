'use client';

import { useFormHandler } from "@/hooks/useFormHandler";
import { useState } from "react";
import z from "zod";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl"

interface IProps {
    isIcon: boolean;
    title: string;
    serviceFunc: () => Promise<any>;
    refetch: () => void;
    warningMessage: string;
    className?: string;
}

const DeleteButton = ({ isIcon, title, serviceFunc, refetch, warningMessage, className }: IProps) => {
    const t = useTranslations("dashboard.resources")
    const [open, setOpen] = useState(false);

    const { onSubmit, loading } = useFormHandler({
        schema: z.object({}),
        service: () => serviceFunc(),
        onSuccess: () => {
            refetch();
            setOpen(false);
        },
        onError: () => {
            setOpen(false)
        },
    });

    return <>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={
                isIcon ?
                    <Button variant="destructive" size="icon-sm" className={`rounded-full ${className}`}><Trash2 /></Button>
                    :
                    <Button variant="destructive" className={`gap-2 w-full ${className}`}>
                        <Trash2 className="w-4 h-4" />
                        {title}
                    </Button>
            }>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {warningMessage}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose render={
                        <Button variant="outline">{t("cancel")}</Button>
                    }>
                    </DialogClose>
                    <Button variant="destructive" onClick={onSubmit} disabled={loading}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("delete")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    </>;
};

export default DeleteButton;