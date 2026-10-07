"use client";

import { Button } from "@/components/ui/button";

interface IProps {
    title?: string;
    className?: string;
    variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
    size?:
    | "default"
    | "icon"
    | "xs"
    | "sm"
    | "lg"
    | "icon-xs"
    | "icon-sm"
    | "icon-lg"
    | null
    | undefined;
    onClick?: () => void;
    type?: "button" | "submit" | "reset" | undefined;
    disabled?: boolean;
    children?: React.ReactNode;
}

const SubmitButton = ({
    title,
    className,
    variant = "default",
    size = "default",
    onClick,
    type = "button",
    disabled = false,
    children,
}: IProps) => {
    return (
        <>
            <Button
                disabled={disabled}
                className={`relative flex w-full items-center justify-center gap-2 font-medium ${className || ""}`}
                variant={variant}
                type={type}
                size={size}
                title={title}
            >
                {children}
            </Button>
        </>
    );
};

export default SubmitButton;
