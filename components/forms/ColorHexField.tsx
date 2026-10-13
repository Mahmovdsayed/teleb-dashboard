import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";

interface ColorHexFieldProps {
    id: string;
    label: string;
    placeholder: string;
    description: string;
    swatch: string;
    fieldProps: React.InputHTMLAttributes<HTMLInputElement>;
}

const ColorHexField = ({ id, label, placeholder, description, swatch, fieldProps }: ColorHexFieldProps) => {
    return (
        <Field>
            <FieldLabel htmlFor={id} className="flex items-center gap-2">
                <span
                    className="inline-block size-3.5 shrink-0 rounded-full border border-border"
                    style={{ backgroundColor: swatch }}
                />
                {label}
            </FieldLabel>
            <input
                id={id}
                {...fieldProps}
                placeholder={placeholder}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 font-mono text-sm shadow-xs transition-all outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
            <FieldDescription>{description}</FieldDescription>
        </Field>
    );
};

export default ColorHexField;
