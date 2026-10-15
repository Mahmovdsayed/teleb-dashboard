'use client';

import { useRef, useState } from "react";
import AddUpdateLayout from "@/components/layout/dashboard/AddUpdateLayout";
import { ConfettiFireworks } from "@/functions/ConfettiFireworks";
import { useFormHandler } from "@/hooks/useFormHandler";
import { updateBanner } from "@/services/banner";
import { deleteImageApi, uploadImageApi } from "@/services/upload";
import { Banner } from "@/types/Banner.types";
import { UpdateBannerInput, updateBannerSchema } from "@/validations/banner";
import { useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import FormField from "../FormField";
import GlobalImageUploader, { type UploadImageItem } from "../GlobalImageUploader";

interface IProps {
    banner: Banner;
    id: string;
}

const EditBannerForm = ({ banner, id }: IProps) => {
    const queryClient = useQueryClient();
    const { push } = useRouter();
    const locale = useLocale();
    const t = useTranslations("dashboard.resources.banners");

    const [images, setImages] = useState<UploadImageItem[]>(() => {
        return (banner.images || []).map((img, idx) => ({
            id: `banner-img-${img.publicId || idx}-${idx}`,
            name: `Image ${idx + 1}`,
            previewUrl: img.url,
            url: img.url,
            publicId: img.publicId,
            order: img.order ?? idx,
        }));
    });

    const imagesRef = useRef<UploadImageItem[]>(images);
    imagesRef.current = images;

    const removedPublicIdsRef = useRef<string[]>([]);

    const handleRemoveItem = (item: UploadImageItem) => {
        if (item.publicId) {
            removedPublicIdsRef.current.push(item.publicId);
        }
    };

    const { register, onSubmit, loading, formState: { errors } } = useFormHandler<UpdateBannerInput>({
        schema: updateBannerSchema,
        defaultValues: {
            title: banner.title || "",
            images: banner.images || [],
        },
        service: async (data: UpdateBannerInput) => {
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

            const response = await updateBanner({ ...data, images: uploadedImages }, locale, id);

            if (removedPublicIdsRef.current.length > 0) {
                await Promise.allSettled(
                    removedPublicIdsRef.current.map((publicId) => deleteImageApi(publicId))
                );
                removedPublicIdsRef.current = [];
            }

            return response;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["banners"], exact: true, refetchType: "all" });
            push("/banner");
        },
    });

    return <>
        <AddUpdateLayout
            onSubmit={onSubmit}
            buttonSubmit={t("actions.update")}
            buttonLoding={t("actions.updating")}
            backButtonTitle={t("actions.back")}
            loading={loading}
            href="/banner"
            title={t("updateForm.title")}
            desc={t("updateForm.description")}
        >
            <FormField
                type="text"
                name="title"
                register={register}
                label={t("fields.title.label")}
                placeholder={t("fields.title.placeholder")}
                description={t("fields.title.description")}
                defaultValue={banner.title}
                error={errors.title}
            />

            <GlobalImageUploader
                items={images}
                onChange={setImages}
                onRemoveItem={handleRemoveItem}
                maxFiles={5}
                label={t("fields.images.label")}
                description={t("fields.images.description")}
                disabled={loading}
                isUploading={loading}
            />
        </AddUpdateLayout>
    </>;
};

export default EditBannerForm;
