"use client";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";

interface SwitchFieldProps {
    label: string;
    hint: string;
    description: string;
    checked: boolean;
    onCheckedChange: (value: boolean) => void;
}

const SwitchField = ({ label, hint, description, checked, onCheckedChange }: SwitchFieldProps) => (
    <Field orientation="horizontal">
        <div className="flex flex-1 flex-col gap-1">
            <FieldLabel className="text-sm font-medium">{label}</FieldLabel>
            <FieldDescription>{hint}</FieldDescription>
            <FieldDescription>{description}</FieldDescription>
        </div>
        <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </Field>
);

export default SwitchField;
