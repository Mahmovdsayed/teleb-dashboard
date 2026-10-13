'use client';

import { useState } from "react";
import { ChevronDown, RotateCcw, SlidersHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type FilterOption = {
    value: string;
    label: string;
};

export type ResourceFilterField = {
    key: string;
    label: string;
    value: string;
    selectedLabel: string;
    options: FilterOption[];
    onValueChange: (value: string | null) => void;
};

type ResourceFiltersProps = {
    title: string;
    resetLabel: string;
    hasFilters: boolean;
    onReset: () => void;
    fields: ResourceFilterField[];
};

export default function ResourceFilters({ title, resetLabel, hasFilters, onReset, fields }: ResourceFiltersProps) {
    const [filtersOpen, setFiltersOpen] = useState(false);

    return (
        <Card className="gap-0 overflow-hidden bg-sidebar py-0">
            <div className="flex items-center justify-between gap-3 p-4 sm:p-5">
                <button
                    type="button"
                    onClick={() => setFiltersOpen((prev) => !prev)}
                    aria-expanded={filtersOpen}
                    className="flex min-w-0 flex-1 items-center gap-2 text-start sm:pointer-events-none"
                >
                    <SlidersHorizontal className="size-4 shrink-0 text-muted-foreground" />
                    <span className="text-sm font-semibold">{title}</span>
                    <ChevronDown className={`size-4 text-muted-foreground transition-transform duration-200 sm:hidden ${filtersOpen ? "rotate-180" : ""}`} />
                </button>

                {hasFilters && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onReset}
                        className="h-8 shrink-0 gap-2 text-muted-foreground"
                    >
                        <RotateCcw className="size-3.5" />
                        <span className="hidden sm:inline">
                            {resetLabel}
                        </span>
                    </Button>
                )}
            </div>

            <div
                className={`grid transition-[grid-template-rows] duration-200 sm:grid-rows-[1fr] ${filtersOpen
                    ? "grid-rows-[1fr]"
                    : "grid-rows-[0fr] sm:grid-rows-[1fr]"
                    }`}
            >
                <div className="overflow-hidden">
                    <CardContent className="grid grid-cols-1 gap-4 border-t p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-4">
                        {fields.map((field) => (
                            <div key={field.key} className="space-y-2">
                                <Label>{field.label}</Label>
                                <Select value={field.value} onValueChange={field.onValueChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue>{field.selectedLabel}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {field.options.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        ))}
                    </CardContent>
                </div>
            </div>
        </Card>
    );
}
