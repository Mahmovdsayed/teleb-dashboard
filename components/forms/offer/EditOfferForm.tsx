"use client";

import AddUpdateLayout from "@/components/layout/dashboard/AddUpdateLayout";
import { useFormHandler } from "@/hooks/useFormHandler";
import { updateOffer } from "@/services/offer";
import { Offer } from "@/types/Offer.types";
import { UpdateOfferFormValues, updateOfferSchema } from "@/validations/offer";
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
    StepperSeparator,
} from "@/components/ui/stepper";
import { useState } from "react";
import { stepConfig, stepFields, TOTAL_STEPS } from "@/config/offer-filters";
import FormField from "../FormField";
import FormTextarea from "../FormTextarea";
import { Button } from "@/components/ui/button";
import { Controller } from "react-hook-form";
import SubmitButton from "@/components/forms/SubmitButton";
import DatePickerField from "../DatePickerField";
import SwitchField from "../SwitchField";
import ColorHexField from "../ColorHexField";
import BannerPreview from "./BannerPreview";


interface IProps {
    offer: Offer;
    id: string;
}

const EditOfferForm = ({ offer, id }: IProps) => {
    const queryClient = useQueryClient();
    const { push } = useRouter();
    const locale = useLocale();
    const t = useTranslations("dashboard.resources.offers");
    const [step, setStep] = useState(1);

    const { register, onSubmit, loading, reset, control, trigger, watch, formState: { errors } } = useFormHandler<UpdateOfferFormValues>({
        schema: updateOfferSchema,
        defaultValues: {
            arName: offer.arName ?? "",
            enName: offer.enName ?? "",
            arDescription: offer.arDescription ?? "",
            enDescription: offer.enDescription ?? "",
            arBannerText: offer.arBannerText ?? "",
            enBannerText: offer.enBannerText ?? "",
            percentage: offer.percentage ? String(offer.percentage) : "",
            startDate: offer.startDate ? new Date(offer.startDate) : undefined,
            endDate: offer.endDate ? new Date(offer.endDate) : undefined,
            isActive: Boolean(offer.isActive),
            showBanner: Boolean(offer.showBanner),
            bannerBackgroundColor: offer.bannerBackgroundColor || "#000000",
            bannerTextColor: offer.bannerTextColor || "#ffffff",
        },
        service: (data: UpdateOfferFormValues) => updateOffer(data, locale, id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["offers"], exact: true, refetchType: "all" });
            reset();
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
            title={t("updateForm.title")}
            desc={t("updateForm.description")}
        >
            <div className="w-full max-w-2xl mx-auto px-2 sm:px-4">
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
                                    </StepperText>
                                </StepperTrigger>
                                <StepperSeparator />
                            </StepperItem>
                        );
                    })}
                </Stepper>
            </div>

            <form onSubmit={onSubmit} className="mt-8 w-full max-w-2xl mx-auto flex flex-col gap-5 px-2 sm:px-4">
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
                            defaultValue={offer.arName}
                        />
                        <FormField
                            type="text"
                            name="enName"
                            register={register}
                            label={f("enName.label")}
                            placeholder={f("enName.placeholder")}
                            description={f("enName.description")}
                            error={errors.enName}
                            defaultValue={offer.enName}
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
                            defaultValue={offer.arDescription}
                        />
                        <FormTextarea
                            name="enDescription"
                            register={register}
                            rows={4}
                            label={f("enDescription.label")}
                            placeholder={f("enDescription.placeholder")}
                            description={f("enDescription.description")}
                            error={errors.enDescription}
                            defaultValue={offer.enDescription}
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
                            defaultValue={offer.percentage}
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
                                    error={errors.startDate as import("react-hook-form").FieldError}
                                />
                            )}
                        />
                        <Controller
                            control={control} name="endDate"
                            render={({ field }) => {
                                const minDate = watch("startDate")
                                    ? new Date(watch("startDate") as unknown as string)
                                    : undefined;
                                return (
                                    <DatePickerField
                                        label={f("endDate.label")}
                                        placeholder={f("endDate.placeholder")}
                                        description={f("endDate.description")}
                                        value={field.value as unknown as string}
                                        onChange={field.onChange}
                                        disabledDate={(date) => (minDate ? date <= minDate : false)}
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
                            type="text"
                            name="arBannerText"
                            register={register}
                            label={f("arBannerText.label")}
                            placeholder={f("arBannerText.placeholder")}
                            description={f("arBannerText.description")}
                            error={errors.arBannerText}
                            defaultValue={offer.arBannerText}
                        />
                        <FormField
                            type="text"
                            name="enBannerText"
                            register={register}
                            label={f("enBannerText.label")}
                            placeholder={f("enBannerText.placeholder")}
                            description={f("enBannerText.description")}
                            error={errors.enBannerText}
                            defaultValue={offer.enBannerText}
                        />
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <ColorHexField
                                id="bannerBackgroundColor"
                                label={f("bannerBackgroundColor.label")}
                                placeholder={f("bannerBackgroundColor.placeholder")}
                                description={f("bannerBackgroundColor.description")}
                                swatch={watch("bannerBackgroundColor") ?? "#000000"}
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
                            bgColor={watch("bannerBackgroundColor") ?? "#000000"}
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
                            {loading ? t("actions.updating") : t("actions.update")}
                        </SubmitButton>
                    )}
                </div>
            </form>
        </AddUpdateLayout>
    );
};

export default EditOfferForm;
