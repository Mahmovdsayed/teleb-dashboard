'use client';

import { Control, FieldValues, Path } from "react-hook-form";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import AlertWrapper from "@/components/ui/AlertWrapper";
import { useState } from "react";
import { useLocale } from "next-intl";

interface FormMultiInputProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    description?: string;
    error?: any;
    setValue: (name: any, value: any, options?: any) => void;
    watch: (name: any) => any;
}

const FormMultiInput = <T extends FieldValues>({
    name,
    label,
    placeholder,
    description,
    error,
    setValue,
    watch
}: FormMultiInputProps<T>) => {
    const locale = useLocale();
    const isEn = locale === "en";

    const values = watch(name) || [];
    const ArrayValues = Array.isArray(values) ? values : [];

    const [inputValue, setInputValue] = useState("");

    const handleAdd = () => {
        if (inputValue.trim()) {
            setValue(name as any, [...ArrayValues, inputValue.trim()], { shouldValidate: true });
            setInputValue("");
        }
    };

    const handleRemove = (index: number) => {
        const newValues = ArrayValues.filter((_, i) => i !== index);
        setValue(name as any, newValues, { shouldValidate: true });
    };

    const handleEdit = (index: number, value: string) => {
        handleRemove(index);
        setInputValue(value);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAdd();
        }
    };

    return (
        <Field>
            <FieldLabel>{label}</FieldLabel>

            <div className="space-y-2">
                <div className="flex gap-2">
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className="h-8 text-sm"
                    />
                    <Button
                        type="button"
                        onClick={handleAdd}
                        size="icon"
                        variant="outline"
                        className="size-8 shrink-0"
                    >
                        <Plus className="w-3.5 h-3.5" />
                    </Button>
                </div>

                {ArrayValues.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {ArrayValues.map((value: string, index: number) => (
                            <span
                                key={`${value}-${index}`}
                                className="inline-flex items-center gap-1 border border-border bg-muted/60 text-foreground px-2 py-0.5 rounded-md text-xs font-medium transition-colors hover:bg-muted"
                            >
                                <span
                                    className="cursor-pointer hover:text-primary transition-colors leading-none"
                                    onClick={() => handleEdit(index, value)}
                                    title={isEn ? "Click to edit" : "انقر للتعديل"}
                                >
                                    {value}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleRemove(index)}
                                    className="text-muted-foreground hover:text-destructive transition-colors ml-0.5 leading-none"
                                    aria-label={isEn ? "Remove" : "حذف"}
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {description && <FieldDescription>{description}</FieldDescription>}
            {error && (
                <AlertWrapper
                    errText={
                        error.message ||
                        (Array.isArray(error) && error.find((e: any) => e?.message)?.message) ||
                        (isEn ? "Invalid input" : "قيمة غير صالحة")
                    }
                />
            )}
        </Field>
    );
};

export default FormMultiInput;
