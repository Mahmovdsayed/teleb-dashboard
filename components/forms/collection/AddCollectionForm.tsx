'use client';

import { collectionInitialValues } from "@/constant/initial-values";
import { ConfettiFireworks } from "@/functions/ConfettiFireworks";
import { useFormHandler } from "@/hooks/useFormHandler";
import { addCollection } from "@/services/collection";
import { CreateCollectionInput, createCollectionSchema } from "@/validations/collection";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import FormField from "../FormField";
import { useQueryClient } from "@tanstack/react-query";
import AddUpdateLayout from "@/components/layout/dashboard/AddUpdateLayout";

const AddCollectionForm = () => {
    const queryClient = useQueryClient();
    const { push } = useRouter();
    const locale = useLocale();
    const t = useTranslations("dashboard.resources.collections");

    const { register, onSubmit, loading, reset, formState: { errors }} = useFormHandler<CreateCollectionInput>({
        schema: createCollectionSchema,
        defaultValues: collectionInitialValues,
        service: (data: CreateCollectionInput) => addCollection(data, locale),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["collections"],
                exact: true,
                refetchType: "all",
            });
            reset();
            ConfettiFireworks();
            push("/collection");
        },
    });

    return (
        <>
            <AddUpdateLayout onSubmit={onSubmit} buttonSubmit={t("actions.submit")} buttonLoding={t("actions.loading")} backButtonTitle={t("actions.back")} loading={loading} href="/collection" title={t("form.title")} desc={t("form.description")}>
                <FormField
                    type="text"
                    name="arName"
                    register={register}
                    label={t("fields.arName.label")}
                    placeholder={t("fields.arName.placeholder")}
                    description={t("fields.arName.description")}
                    error={errors.arName}
                />

                <FormField
                    type="text"
                    name="enName"
                    register={register}
                    label={t("fields.enName.label")}
                    placeholder={t("fields.enName.placeholder")}
                    description={t("fields.enName.description")}
                    error={errors.enName}
                />

                <FormField
                    type="text"
                    name="icon"
                    register={register}
                    label={t("fields.icon.label")}
                    placeholder={t("fields.icon.placeholder")}
                    description={t("fields.icon.description")}
                    error={errors.icon}
                />
            </AddUpdateLayout >
        </>
    );
};

export default AddCollectionForm;
