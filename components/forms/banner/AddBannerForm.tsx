'use client';

import { useRef, useState } from "react";
import AddUpdateLayout from "@/components/layout/dashboard/AddUpdateLayout";
import { bannerInitialValues } from "@/constant/initial-values";
import { ConfettiFireworks } from "@/functions/ConfettiFireworks";
import { useFormHandler } from "@/hooks/useFormHandler";
import { addBanner } from "@/services/banner";
import { uploadImageApi } from "@/services/upload";
import { CreateBannerInput, createBannerSchema } from "@/validations/banner";
import { useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import FormField from "../FormField";
import GlobalImageUploader, { type UploadImageItem } from "../GlobalImageUploader";

const AddBannerForm = () => {
    const queryClient = useQueryClient();
    const { push } = useRouter();
    const locale = useLocale();
    const t = useTranslations("dashboard.resources.banners");

    const [images, setImages] = useState<UploadImageItem[]>([]);
    const imagesRef = useRef<UploadImageItem[]>(images);
    imagesRef.current = images;

    const { register, onSubmit, loading, reset, formState: { errors } } = useFormHandler<CreateBannerInput>({
        schema: createBannerSchema,
        defaultValues: bannerInitialValues,
        service: async (data: CreateBannerInput) => {
            const currentImages = imagesRef.current;
            const uploadedImages = [];

            for (let i = 0; i < currentImages.length; i++) {
                const item = currentImages[i];
                if (item.file) {
                    const result = await uploadImageApi(item.file, {
                        folderName: "banners",
                        width: 1920,
                        height: 1000,
                    });
                    uploadedImages.push({
                        url: result.imageUrl,
                        publicId: result.publicId,
                        order: i,
                    });
                } else if (item.url && item.publicId) {
                    uploadedImages.push({
                        url: item.url,
                        publicId: item.publicId,
                        order: i,
                    });
                }
            }

            return await addBanner({ ...data, images: uploadedImages }, locale);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["banners"], exact: true, refetchType: "all" });
            reset(bannerInitialValues);
            setImages([]);
            ConfettiFireworks();
            push("/banner");
        },
    });

    return <>
        <AddUpdateLayout
            onSubmit={onSubmit}
            buttonSubmit={t("actions.submit")}
            buttonLoding={t("actions.loading")}
            backButtonTitle={t("actions.back")}
            loading={loading}
            href="/banner"
            title={t("form.title")}
            desc={t("form.description")}
        >
            <FormField
                type="text"
                name="title"
                register={register}
                label={t("fields.title.label")}
                placeholder={t("fields.title.placeholder")}
                description={t("fields.title.description")}
                error={errors.title}
            />

            <GlobalImageUploader
                items={images}
                onChange={setImages}
                maxFiles={5}
                label={t("fields.images.label")}
                description={t("fields.images.description")}
                disabled={loading}
                isUploading={loading}
            />
        </AddUpdateLayout>
    </>;
};

export default AddBannerForm;