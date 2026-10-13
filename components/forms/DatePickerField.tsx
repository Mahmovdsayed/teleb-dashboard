"use client";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import AlertWrapper from "@/components/ui/AlertWrapper";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { FieldError } from "react-hook-form";

interface DatePickerFieldProps {
    label: string;
    placeholder: string;
    description: string;
    value: string | undefined;
    onChange: (iso: string) => void;
    disabledDate?: (date: Date) => boolean;
    error?: FieldError;
}

const DatePickerField = ({
    label,
    placeholder,
    description,
    value,
    onChange,
    disabledDate,
    error,
}: DatePickerFieldProps) => {
    const selected = value ? new Date(value) : undefined;

    return (
        <Field>
            <FieldLabel>{label}</FieldLabel>
            <Popover>
                <PopoverTrigger className="flex w-full items-center gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-all outline-none hover:bg-accent/20 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50">
                    <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
                    <span className={value ? "text-foreground" : "text-muted-foreground"}>
                        {value ? format(new Date(value), "PPP") : placeholder}
                    </span>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={selected}
                        onSelect={(date) => onChange(date?.toISOString() ?? "")}
                        disabled={disabledDate}
                        autoFocus
                    />
                </PopoverContent>
            </Popover>
            <FieldDescription>{description}</FieldDescription>
            {error && <AlertWrapper errText={String(error.message)} />}
        </Field>
    );
};

export default DatePickerField;
