'use client';


import { useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import AddUpdateLayout from "@/components/layout/dashboard/AddUpdateLayout";
import FormField from "../FormField";
import { useFormHandler } from "@/hooks/useFormHandler";
import { updateCollection } from "@/services/collection";
import { Collection } from "@/types/Collection.types";
import {
    UpdateCollectionInput,
    updateCollectionSchema,
} from "@/validations/collection";

interface IProps {
    collection: Collection;
    id: string;
}

const EditCollectionForm = ({ collection, id }: IProps) => {
    const queryClient = useQueryClient();
    const { push } = useRouter();
    const locale = useLocale();
    const t = useTranslations("dashboard.resources.collections");

    const { register, onSubmit, loading, reset, formState: { errors } } = useFormHandler<UpdateCollectionInput>({
        schema: updateCollectionSchema,
        defaultValues: {
            arName: collection.arName,
            enName: collection.enName,
            icon: collection.icon,
        },
        service: (data) => updateCollection(data, locale, id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["collections"],
                exact: true,
                refetchType: "all",
            });

            reset();
            push("/collection");
        },
    });



    return (
        <AddUpdateLayout
            onSubmit={onSubmit}
            buttonSubmit={t("actions.submit")}
            buttonLoding={t("actions.loading")}
            backButtonTitle={t("actions.back")}
            loading={loading}
            href="/collection"
            title={t("updateForm.title")}
            desc={t("updateForm.description")}
        >
            <FormField
                type="text"
                name="arName"
                register={register}
                label={t("fields.arName.label")}
                placeholder={t("fields.arName.placeholder")}
                description={t("fields.arName.description")}
                defaultValue={collection?.arName}
                error={errors.arName}
            />

            <FormField
                type="text"
                name="enName"
                register={register}
                label={t("fields.enName.label")}
                placeholder={t("fields.enName.placeholder")}
                description={t("fields.enName.description")}
                defaultValue={collection?.enName}
                error={errors.enName}
            />

            <FormField
                type="text"
                name="icon"
                register={register}
                label={t("fields.icon.label")}
                placeholder={t("fields.icon.placeholder")}
                description={t("fields.icon.description")}
                defaultValue={collection?.icon}
                error={errors.icon}
            />
        </AddUpdateLayout>
    );
};

export default EditCollectionForm;
