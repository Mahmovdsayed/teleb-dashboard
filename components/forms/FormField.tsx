"use client";

import React, { useState } from "react";
import {
    type FieldError,
    type FieldValues,
    type Path,
    type UseFormRegister,
} from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import AlertWrapper from "../ui/AlertWrapper";

type FormInputType =
    | "text"
    | "email"
    | "password"
    | "date"
    | "number"
    | "file"
    | "url"
    | "search"
    | "tel"
    | "hidden"
    | "datetime-local"
    | "month"
    | "week"
    | "time"
    | "color"
    | "submit"
    | "reset"
    | "button"
    | "range";

interface FormFieldProps<T extends FieldValues> {
    name: Path<T>;
    label: string;
    type?: FormInputType;
    placeholder?: string;
    description?: string;
    autoComplete?: string;
    delay?: number;
    register: UseFormRegister<T>;
    error?: FieldError;
    defaultValue?: string | number | readonly string[];
    className?: string;
    isMotionDisabled?: boolean;
    icon?: React.ReactNode;
}

const FormField = <T extends FieldValues>({
    name,
    label,
    type = "text",
    placeholder,
    description,
    autoComplete,
    delay = 0,
    register,
    error,
    defaultValue,
    className,
    isMotionDisabled,
    icon,
}: FormFieldProps<T>) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    const endIcon = isPassword ? (
        <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={showPassword ? "Hide password" : "Show password"}
        >
            {showPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
        </button>
    ) : null;

    return (
        <Field>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>

            <Input
                {...register(name)}
                id={name}
                type={inputType}
                placeholder={placeholder}
                defaultValue={defaultValue}
                autoComplete={autoComplete}
                className={className}
            />

            {description && <FieldDescription>{description}</FieldDescription>}
            {error?.message && <AlertWrapper errText={error.message} />}
        </Field>
    );
};

export default FormField;
