"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

type Orientation = "horizontal" | "vertical" | "responsive"
type StepState = "completed" | "active" | "inactive"

type StepperContextValue = {
    value: number
    setValue: (value: number) => void
    orientation: Orientation
    linear: boolean
}

const StepperContext = React.createContext<StepperContextValue | null>(null)

function useStepper() {
    const context = React.useContext(StepperContext)
    if (!context) {
        throw new Error("Stepper components must be used within <Stepper />")
    }
    return context
}

type StepperItemContextValue = { step: number; state: StepState; disabled: boolean }

const StepperItemContext = React.createContext<StepperItemContextValue | null>(
    null
)

function useStepperItem() {
    const context = React.useContext(StepperItemContext)
    if (!context) {
        throw new Error("Stepper parts must be used within <StepperItem />")
    }
    return context
}

const rootClasses: Record<Orientation, string> = {
    horizontal: "flex-row",
    vertical: "flex-col",
    responsive: "flex-col md:flex-row",
}

const itemClasses: Record<Orientation, string> = {
    horizontal: "flex-1 last:flex-none",
    vertical: "pb-8 last:pb-0",
    responsive: "pb-8 last:pb-0 md:flex-1 md:pb-0 md:last:flex-none",
}

const triggerClasses: Record<Orientation, string> = {
    horizontal: "flex-col items-start gap-3 pe-4",
    vertical: "items-center gap-3",
    responsive: "items-center gap-3 md:flex-col md:items-start md:pe-4",
}

const separatorClasses: Record<Orientation, string> = {
    horizontal: "absolute top-[1.125rem] start-[3.25rem] end-3 h-px",
    vertical: "absolute top-11 bottom-2 start-[1.125rem] w-px -translate-x-1/2 rtl:translate-x-1/2",
    responsive:
        "absolute top-11 bottom-2 start-[1.125rem] w-px -translate-x-1/2 rtl:translate-x-1/2 md:top-[1.125rem] md:end-3 md:bottom-auto md:start-[3.25rem] md:h-px md:w-auto md:translate-x-0 md:rtl:translate-x-0",
}

type StepperProps = Omit<React.ComponentProps<"ol">, "defaultValue"> & {
    value?: number
    defaultValue?: number
    onValueChange?: (value: number) => void
    orientation?: Orientation
    linear?: boolean
}

function Stepper({
    value: valueProp,
    defaultValue = 1,
    onValueChange,
    orientation = "responsive",
    linear = false,
    className,
    ...props
}: StepperProps) {
    const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
    const isControlled = valueProp !== undefined
    const value = isControlled ? valueProp : uncontrolled

    const setValue = React.useCallback(
        (next: number) => {
            if (!isControlled) setUncontrolled(next)
            onValueChange?.(next)
        },
        [isControlled, onValueChange]
    )

    return (
        <StepperContext.Provider value={{ value, setValue, orientation, linear }}>
            <ol
                data-slot="stepper"
                data-orientation={orientation}
                className={cn("flex w-full", rootClasses[orientation], className)}
                {...props}
            />
        </StepperContext.Provider>
    )
}

type StepperItemProps = React.ComponentProps<"li"> & {
    step: number
    disabled?: boolean
    completed?: boolean
}

function StepperItem({
    step,
    disabled = false,
    completed,
    className,
    children,
    ...props
}: StepperItemProps) {
    const { value, orientation } = useStepper()

    const state: StepState =
        step === value
            ? "active"
            : completed || step < value
                ? "completed"
                : "inactive"

    return (
        <StepperItemContext.Provider value={{ step, state, disabled }}>
            <li
                data-slot="stepper-item"
                data-state={state}
                className={cn(
                    "group/item relative flex",
                    itemClasses[orientation],
                    className
                )}
                {...props}
            >
                {children}
            </li>
        </StepperItemContext.Provider>
    )
}

function StepperTrigger({
    className,
    onClick,
    disabled,
    ...props
}: React.ComponentProps<"button">) {
    const { setValue, linear, orientation } = useStepper()
    const item = useStepperItem()

    const isDisabled =
        disabled || item.disabled || (linear && item.state === "inactive")

    return (
        <button
            type="button"
            data-slot="stepper-trigger"
            data-state={item.state}
            aria-current={item.state === "active" ? "step" : undefined}
            disabled={isDisabled}
            onClick={(event) => {
                onClick?.(event)
                if (!event.defaultPrevented) setValue(item.step)
            }}
            className={cn(
                "flex min-w-0 rounded-md text-start outline-none transition-[color,box-shadow]",
                triggerClasses[orientation],
                "focus-visible:ring-[3px] focus-visible:ring-ring/50",
                "disabled:pointer-events-none disabled:opacity-50",
                className
            )}
            {...props}
        />
    )
}

function StepperIndicator({
    className,
    children,
    ...props
}: React.ComponentProps<"span">) {
    const { state } = useStepperItem()

    return (
        <span
            data-slot="stepper-indicator"
            data-state={state}
            className={cn(
                "relative flex size-9 shrink-0 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-xs transition-[color,background-color,border-color,box-shadow]",
                "[&_svg]:size-4 [&_svg]:shrink-0",
                "data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:ring-[3px] data-[state=active]:ring-primary/20",
                "data-[state=completed]:border-primary data-[state=completed]:bg-primary data-[state=completed]:text-primary-foreground",
                className
            )}
            {...props}
        >
            {children}
            {state === "completed" && (
                <span
                    aria-hidden
                    className="absolute -end-1 -bottom-1 flex size-4 items-center justify-center rounded-full bg-background text-primary ring-1 ring-primary"
                >
                    <Check className="size-2.5!" strokeWidth={3.5} />
                </span>
            )}
        </span>
    )
}

function StepperText({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="stepper-text"
            className={cn("flex min-w-0 flex-col gap-1", className)}
            {...props}
        />
    )
}

function StepperTitle({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="stepper-title"
            className={cn(
                "text-xs leading-none font-medium transition-colors",
                "group-data-[state=inactive]/item:text-muted-foreground",
                className
            )}
            {...props}
        />
    )
}

function StepperDescription({
    className,
    ...props
}: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="stepper-description"
            className={cn("text-xs text-muted-foreground", className)}
            {...props}
        />
    )
}

function StepperSeparator({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const { orientation } = useStepper()
    const { state } = useStepperItem()

    return (
        <div
            aria-hidden
            data-slot="stepper-separator"
            data-state={state}
            className={cn(
                "bg-border transition-colors group-last/item:hidden",
                "data-[state=completed]:bg-primary",
                separatorClasses[orientation],
                className
            )}
            {...props}
        />
    )
}

export {
    Stepper,
    StepperItem,
    StepperTrigger,
    StepperIndicator,
    StepperText,
    StepperTitle,
    StepperDescription,
    StepperSeparator,
}