'use client';

import { FieldError, useController } from 'react-hook-form'
import AlertWrapper from '@/components/ui/AlertWrapper'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface IProps {
    name: string
    label: string
    description?: string
    delay: number
    control: any
    error?: FieldError
    defaultValue?: string
    className?: string
    isMotionDisabled?: boolean
    options: { value: string; label: string; icon?: React.ReactNode }[]
    placeholder?: string
}


const FormSelect = ({
    name,
    label,
    description,
    control,
    error,
    defaultValue,
    className,
    options,
    placeholder,
}: IProps) => {
    const {
        field: { value, onChange, onBlur, ref },
    } = useController({ name, control, defaultValue })

    return (
        <Field>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
            <Select
                key={value}
                value={value ?? ""}
                onValueChange={onChange}
            >
                <SelectTrigger
                    id={name}
                    ref={ref}
                    onBlur={onBlur}
                    className={cn("w-full h-9 md:h-10 px-4 py-1 text-xs md:text-sm font-normal bg-input/50 hover:bg-input/70 border-transparent transition-colors", className)}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className='rounded-xl'>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                                {option.icon}
                                <span>{option.label}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>

            </Select>
            {description && (
                <FieldDescription>{description}</FieldDescription>
            )}
            {error && <AlertWrapper errText={String(error.message)} />}
        </Field>
    )
}

export default FormSelect