"use client";

import AddUpdateLayout from "@/components/layout/dashboard/AddUpdateLayout";
import { offerInitialValues } from "@/constant/initial-values";
import { ConfettiFireworks } from "@/functions/ConfettiFireworks";
import { useFormHandler } from "@/hooks/useFormHandler";
import { addOffer } from "@/services/offer";
import { CreateOfferFormValues, createOfferSchema } from "@/validations/offer";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, SaveCheck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
    Stepper,
    StepperItem,
    StepperTrigger,
    StepperIndicator,
    StepperText,
    StepperTitle,
    StepperDescription,
    StepperSeparator,
} from "@/components/ui/stepper";
import { useState } from "react";
import { stepConfig, stepFields, TOTAL_STEPS } from "@/config/offer-filters";
import FormField from "../FormField";
import FormTextarea from "../FormTextarea";
import { Button } from "@/components/ui/button";
import { Controller } from "react-hook-form";
import SubmitButton from "@/components/forms/SubmitButton";
import SwitchField from "../SwitchField";
import BannerPreview from "./BannerPreview";
import ColorHexField from "../ColorHexField";
import DatePickerField from "../DatePickerField";

const AddOfferForm = () => {
    const queryClient = useQueryClient();
    const { push } = useRouter();
    const locale = useLocale();
    const t = useTranslations("dashboard.resources.offers");
    const [step, setStep] = useState(1);

    const { register, onSubmit, loading, reset, control, trigger, watch, formState: { errors } } = useFormHandler<CreateOfferFormValues>({
        schema: createOfferSchema,
        defaultValues: offerInitialValues as unknown as CreateOfferFormValues,
        service: (data: CreateOfferFormValues) => addOffer(data, locale),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["offers"], exact: true, refetchType: "all" });
            reset();
            ConfettiFireworks();
            push("/offer");
        },
    });

    const handleNext = async () => {
        const fields = stepFields[step];
        const valid = fields.length === 0 ? true : await trigger(fields);
        if (valid) setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    };

    const handlePrev = () => setStep((s) => Math.max(s - 1, 1));
    const f = (key: string) => t(`fields.${key}`);

    return (
        <AddUpdateLayout
            stepperMode
            href="/offer"
            backButtonTitle={t("actions.back")}
            title={t("form.title")}
            desc={t("form.description")}
        >
            <div className="w-full max-w-4xl mx-auto">
                <Stepper
                    value={step}
                    onValueChange={(next) => { if (next < step) setStep(next); }}
                    orientation="responsive"
                    linear
                >
                    {stepConfig.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <StepperItem key={item.id} step={index + 1} className="min-w-0">
                                <StepperTrigger className="w-full">
                                    <StepperIndicator>
                                        <Icon aria-hidden="true" />
                                    </StepperIndicator>
                                    <StepperText>
                                        <StepperTitle>{t(`steps.${item.id}.title`)}</StepperTitle>
                                        <StepperDescription>{t(`steps.${item.id}.description`)}</StepperDescription>
                                    </StepperText>
                                </StepperTrigger>
                                <StepperSeparator />
                            </StepperItem>
                        );
                    })}
                </Stepper>
            </div>

            <form onSubmit={onSubmit} className="mt-8 w-full max-w-2xl mx-auto flex flex-col gap-5">
                {step === 1 && (
                    <div className="flex flex-col gap-5">
                        <FormField
                            type="text"
                            name="arName"
                            register={register}
                            label={f("arName.label")}
                            placeholder={f("arName.placeholder")}
                            description={f("arName.description")}
                            error={errors.arName}
                        />
                        <FormField
                            type="text"
                            name="enName"
                            register={register}
                            label={f("enName.label")}
                            placeholder={f("enName.placeholder")}
                            description={f("enName.description")}
                            error={errors.enName}
                        />
                    </div>
                )}

                {step === 2 && (
                    <div className="flex flex-col gap-5">
                        <FormTextarea
                            name="arDescription"
                            register={register}
                            rows={4}
                            label={f("arDescription.label")}
                            placeholder={f("arDescription.placeholder")}
                            description={f("arDescription.description")}
                            error={errors.arDescription}
                        />
                        <FormTextarea
                            name="enDescription"
                            register={register}
                            rows={4}
                            label={f("enDescription.label")}
                            placeholder={f("enDescription.placeholder")}
                            description={f("enDescription.description")}
                            error={errors.enDescription}
                        />
                    </div>
                )}

                {step === 3 && (
                    <div className="flex flex-col gap-5">
                        <FormField
                            type="number"
                            name="percentage"
                            register={register}
                            label={f("percentage.label")}
                            placeholder={f("percentage.placeholder")}
                            description={f("percentage.description")}
                            error={errors.percentage}
                        />
                        <Controller
                            control={control} name="startDate"
                            render={({ field }) => (
                                <DatePickerField
                                    label={f("startDate.label")}
                                    placeholder={f("startDate.placeholder")}
                                    description={f("startDate.description")}
                                    value={field.value as unknown as string}
                                    onChange={field.onChange}
                                    disabledDate={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                    error={errors.startDate as import("react-hook-form").FieldError}
                                />
                            )}
                        />
                        <Controller
                            control={control} name="endDate"
                            render={({ field }) => {
                                const minDate = watch("startDate")
                                    ? new Date(watch("startDate") as unknown as string)
                                    : new Date();
                                return (
                                    <DatePickerField
                                        label={f("endDate.label")}
                                        placeholder={f("endDate.placeholder")}
                                        description={f("endDate.description")}
                                        value={field.value as unknown as string}
                                        onChange={field.onChange}
                                        disabledDate={(date) => date <= minDate}
                                        error={errors.endDate as import("react-hook-form").FieldError}
                                    />
                                );
                            }}
                        />
                    </div>
                )}

                {step === 4 && (
                    <div className="flex flex-col gap-5">
                        <FormField
                            type="text" name="arBannerText"
                            register={register}
                            label={f("arBannerText.label")}
                            placeholder={f("arBannerText.placeholder")}
                            description={f("arBannerText.description")}
                            error={errors.arBannerText}
                        />
                        <FormField
                            type="text"
                            name="enBannerText"
                            register={register}
                            label={f("enBannerText.label")}
                            placeholder={f("enBannerText.placeholder")}
                            description={f("enBannerText.description")}
                            error={errors.enBannerText}
                        />
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <ColorHexField
                                id="bannerBackgroundColor"
                                label={f("bannerBackgroundColor.label")}
                                placeholder={f("bannerBackgroundColor.placeholder")}
                                description={f("bannerBackgroundColor.description")}
                                swatch={watch("bannerBackgroundColor") ?? "#2563eb"}
                                fieldProps={register("bannerBackgroundColor")}
                            />
                            <ColorHexField
                                id="bannerTextColor"
                                label={f("bannerTextColor.label")}
                                placeholder={f("bannerTextColor.placeholder")}
                                description={f("bannerTextColor.description")}
                                swatch={watch("bannerTextColor") ?? "#ffffff"}
                                fieldProps={register("bannerTextColor")}
                            />
                        </div>
                        <BannerPreview
                            bgColor={watch("bannerBackgroundColor") ?? "#2563eb"}
                            textColor={watch("bannerTextColor") ?? "#ffffff"}
                            text={locale === "ar"
                                ? (watch("arBannerText") || watch("enBannerText") || "")
                                : (watch("enBannerText") || watch("arBannerText") || "")}
                            label={t("bannerPreview.label")}
                            empty={t("bannerPreview.empty")}
                        />
                    </div>
                )}

                {step === 5 && (
                    <div className="flex flex-col gap-5">
                        <Controller
                            control={control} name="isActive"
                            render={({ field }) => (
                                <SwitchField
                                    label={f("isActive.label")}
                                    hint={f("isActive.hint")}
                                    description={f("isActive.description")}
                                    checked={!!field.value}
                                    onCheckedChange={field.onChange}
                                />
                            )}
                        />
                        <Controller
                            control={control} name="showBanner"
                            render={({ field }) => (
                                <SwitchField
                                    label={f("showBanner.label")}
                                    hint={f("showBanner.hint")}
                                    description={f("showBanner.description")}
                                    checked={!!field.value}
                                    onCheckedChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                )}

                <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                    <Button
                        type="button" variant="secondary" className="w-full sm:w-auto"
                        onClick={step === 1 ? () => push("/offer") : handlePrev}
                    >
                        <ChevronLeft className="size-4 rtl:hidden" />
                        <ChevronRight className="size-4 hidden rtl:block" />
                        {step === 1 ? t("actions.back") : t("actions.previous")}
                    </Button>

                    {step < TOTAL_STEPS ? (
                        <Button type="button" className="w-full sm:w-auto" onClick={handleNext}>
                            {t("actions.next")}
                            <ChevronRight className="size-4 rtl:hidden" />
                            <ChevronLeft className="size-4 hidden rtl:block" />
                        </Button>
                    ) : (
                        <SubmitButton type="submit" disabled={loading} className="w-full sm:w-auto">
                            <SaveCheck className="size-4" />
                            {loading ? t("actions.creating") : t("actions.create")}
                        </SubmitButton>
                    )}
                </div>
            </form>
        </AddUpdateLayout>
    );

}
export default AddOfferForm;