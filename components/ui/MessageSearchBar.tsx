'use client';

import { useEffect, useState } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MessageSearchBarProps {
    value?: string;
    onChange: (value: string) => void;
    placeholder: string;
    isSearching?: boolean;
}

const MessageSearchBar = ({ value, onChange, placeholder, isSearching }: MessageSearchBarProps) => {
    const [localValue, setLocalValue] = useState(value ?? "");

    useEffect(() => {
        setLocalValue(value ?? "");
    }, [value]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (localValue !== (value ?? "")) {
                onChange(localValue);
            }
        }, 350);

        return () => clearTimeout(handler);
    }, [localValue, onChange, value]);

    return (
        <div className="relative w-full">
            <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                placeholder={placeholder}
                className="ps-10 pe-9 h-11 w-full rounded-xl bg-sidebar border border-border text-xs md:text-sm shadow-none focus-visible:ring-1"
            />
            <div className="absolute end-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {isSearching && (
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                )}
                {localValue && (
                    <button
                        type="button"
                        onClick={() => {
                            setLocalValue("");
                            onChange("");
                        }}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <X className="size-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default MessageSearchBar;
