"use client";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";

interface IProps {
    errText: string;
    variant?: "default" | "destructive" | null | undefined;
}
const AlertWrapper = ({ errText, variant = "destructive" }: IProps) => {
    return (
        <>
            <Alert
                variant={variant}
            >
                <AlertTitle className="text-destructive flex items-center gap-2">
                    <ShieldAlert className="size-4" /> {errText}
                </AlertTitle>
            </Alert>
        </>
    );
};

export default AlertWrapper;
