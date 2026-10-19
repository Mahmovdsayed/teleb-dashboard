"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Controller, type FieldError } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  SaveCheck,
} from "lucide-react";

import AddUpdateLayout from "@/components/layout/dashboard/AddUpdateLayout";
import { productInitialValues } from "@/constant/initial-values";
import { ConfettiFireworks } from "@/functions/ConfettiFireworks";
import { useFormHandler } from "@/hooks/useFormHandler";
import { useAppQuery } from "@/hooks/useAppQuery";
import { getCollections } from "@/services/collection";
import { getOffers } from "@/services/offer";
import { addProductImages, createProduct } from "@/services/product";
import { uploadImageApi } from "@/services/upload";
import { Collection } from "@/types/Collection.types";
import { OffersResult } from "@/types/Offer.types";
import {
  CreateProductFormValues,
  createProductSchema,
  toObjectArray,
} from "@/validations/product";
import { stepConfig, stepFields, TOTAL_STEPS } from "@/config/product-filters";
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperText,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";
import { Button } from "@/components/ui/button";
import FormField from "../FormField";
import FormTextarea from "../FormTextarea";
import SwitchField from "../SwitchField";
import FormSelect from "../FormSelect";
import SubmitButton from "../SubmitButton";
import FormMultiInput from "../FormMultiInput";
import GlobalImageUploader, {
  type UploadImageItem,
} from "../GlobalImageUploader";

const AddProductForm = () => {
  const queryClient = useQueryClient();
  const { push } = useRouter();
  const locale = useLocale();
  const isEn = locale === "en";

  const t = useTranslations("dashboard.resources");
  const tp = useTranslations("dashboard.resources.products");
  const f = (key: string) => tp(`fields.${key}`);

  const [step, setStep] = useState(1);
  const [images, setImages] = useState<UploadImageItem[]>([]);

  const imagesRef = useRef<UploadImageItem[]>(images);
  imagesRef.current = images;

  const { data: collections = [] } = useAppQuery<Collection[]>({
    queryFn: getCollections,
    queryKey: ["collections"],
  });

  const { data: offersData } = useAppQuery<OffersResult>({
    queryFn: () => getOffers({ limit: 50, page: 1 }, locale),
    queryKey: ["offers", "for-products-add", locale],
  });

  const offers = offersData?.data ?? [];

  const collectionOptions = useMemo(() => {
    return collections.map((col) => ({
      value: String(col.id),
      label: isEn ? col.enName : col.arName,
    }));
  }, [collections, isEn]);

  const offerOptions = useMemo(() => {
    return [
      { value: "none", label: tp("noOffer") },
      ...offers.map((off) => ({
        value: String(off.id),
        label: `${isEn ? off.enName : off.arName} (${off.percentage}%)`,
      })),
    ];
  }, [offers, isEn, tp]);

  const {
    register,
    onSubmit,
    loading,
    reset,
    control,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useFormHandler<CreateProductFormValues>({
    schema: createProductSchema,
    defaultValues: productInitialValues as unknown as CreateProductFormValues,
    service: async (data: CreateProductFormValues) => {
      const currentImages = imagesRef.current;
      const uploadedImages = [];

      for (let i = 0; i < currentImages.length; i++) {
        const item = currentImages[i];
        if (item.file) {
          const result = await uploadImageApi(item.file, {
            folderName: "products",
          });
          uploadedImages.push({
            url: result.imageUrl,
            publicId: result.publicId,
            order: i,
            isMain: i === 0,
          });
        } else if (item.url && item.publicId) {
          uploadedImages.push({
            url: item.url,
            publicId: item.publicId,
            order: i,
            isMain: i === 0,
          });
        }
      }

      const tagsArray = Array.isArray(data.tags) ? data.tags : [];
      const metaKeywordsArray = Array.isArray(data.metaKeywords) ? data.metaKeywords : [];

      const payload = {
        collectionId: Number(data.collectionId),
        offerId:
          data.offerId && Number(data.offerId) > 0
            ? Number(data.offerId)
            : null,
        slug: data.slug.trim().toLowerCase(),
        status: data.status,
        isBestSeller: !!data.isBestSeller,
        isCustomizable: !!data.isCustomizable,
        warranty: Number(data.warranty || 0),
        weight: data.weight || null,
        translations: {
          ar: {
            name: data.arName,
            smallDescription: data.arSmallDescription || undefined,
            description: data.arDescription || undefined,
            materials: toObjectArray(data.arMaterials as string[]),
            features: toObjectArray(data.arFeatures as string[]),
            height: data.arHeight || null,
            width: data.arWidth || null,
            tags: tagsArray,
            metaTitle: data.metaTitleAr || undefined,
            metaDescription: data.metaDescriptionAr || undefined,
            metaKeywords: metaKeywordsArray,
          },
          en: {
            name: data.enName,
            smallDescription: data.enSmallDescription || undefined,
            description: data.enDescription || undefined,
            materials: toObjectArray(data.enMaterials as string[]),
            features: toObjectArray(data.enFeatures as string[]),
            height: data.enHeight || null,
            width: data.enWidth || null,
            tags: tagsArray,
            metaTitle: data.metaTitleEn || undefined,
            metaDescription: data.metaDescriptionEn || undefined,
            metaKeywords: metaKeywordsArray,
          },
        },
      };

      const newProduct = await createProduct(payload, locale);

      if (uploadedImages.length > 0 && newProduct?.id) {
        await addProductImages(newProduct.id, uploadedImages, locale);
      }

      return newProduct;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["products"],
          exact: false,
        }),
        queryClient.invalidateQueries({
          queryKey: ["analytics"],
        }),
      ]);
      reset();
      setImages([]);
      ConfettiFireworks();
      push("/products");
    },
  });

  const handleNext = async () => {
    const fields = stepFields[step];
    const valid = fields.length === 0 ? true : await trigger(fields);
    if (valid) setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <AddUpdateLayout
      stepperMode
      href="/products"
      backButtonTitle={t("actions.back")}
      title={tp("form.title")}
      desc={tp("form.description")}
    >
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <Stepper
          value={step}
          onValueChange={(next) => {
            if (next < step) setStep(next);
          }}
          orientation="responsive"
          linear
        >
          {stepConfig.map((item, index) => {
            const Icon = item.icon;
            return (
              <StepperItem key={item.id} step={index + 1}>
                <StepperTrigger>
                  <StepperIndicator>
                    <Icon className="size-4" />
                  </StepperIndicator>
                  <StepperText>
                    <StepperTitle>{tp(`steps.${item.id}.title`)}</StepperTitle>
                    <StepperDescription>
                      {tp(`steps.${item.id}.description`)}
                    </StepperDescription>
                  </StepperText>
                </StepperTrigger>
                {index < TOTAL_STEPS - 1 && <StepperSeparator />}
              </StepperItem>
            );
          })}
        </Stepper>

        <form onSubmit={onSubmit} className="space-y-6 text-start">
          {step === 1 && (
            <div className="space-y-5 rounded-xl border border-border/70 bg-card p-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <FormSelect
                  name="collectionId"
                  control={control}
                  label={f("collection.label")}
                  placeholder={f("collection.placeholder")}
                  description={f("collection.description")}
                  options={collectionOptions}
                  error={errors.collectionId as FieldError}
                  delay={0}
                />

                <Controller
                  control={control}
                  name="offerId"
                  render={({ field }) => (
                    <FormSelect
                      name="offerId"
                      control={control}
                      label={f("offer.label")}
                      placeholder={f("offer.placeholder")}
                      description={f("offer.description")}
                      defaultValue={field.value ? String(field.value) : "none"}
                      options={offerOptions}
                      error={errors.offerId as FieldError}
                      delay={0}
                    />
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <FormField
                  type="text"
                  name="slug"
                  register={register}
                  label={f("slug.label")}
                  placeholder={f("slug.placeholder")}
                  description={f("slug.description")}
                  error={errors.slug}
                />

                <FormField
                  type="number"
                  name="warranty"
                  register={register}
                  label={f("warranty.label")}
                  placeholder={f("warranty.placeholder")}
                  description={f("warranty.description")}
                  error={errors.warranty as FieldError}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <FormField
                  type="text"
                  name="weight"
                  register={register}
                  label={f("weight.label")}
                  placeholder={f("weight.placeholder")}
                  description={f("weight.description")}
                  error={errors.weight}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 border-t pt-5">
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <SwitchField
                      label={f("status.label")}
                      hint={f("status.hint")}
                      description={f("status.description")}
                      checked={field.value === "active"}
                      onCheckedChange={(checked) =>
                        field.onChange(checked ? "active" : "inactive")
                      }
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="isBestSeller"
                  render={({ field }) => (
                    <SwitchField
                      label={f("isBestSeller.label")}
                      hint={f("isBestSeller.hint")}
                      description={f("isBestSeller.description")}
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="isCustomizable"
                  render={({ field }) => (
                    <SwitchField
                      label={f("isCustomizable.label")}
                      hint={f("isCustomizable.hint")}
                      description={f("isCustomizable.description")}
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 rounded-xl border border-border/70 bg-card p-6" dir="rtl">
              <div className="pb-2 border-b">
                <h3 className="text-sm font-semibold">{tp("steps.arContent.title")}</h3>
              </div>

              <FormField
                type="text"
                name="arName"
                register={register}
                label={f("arName.label")}
                placeholder={f("arName.placeholder")}
                description={f("arName.description")}
                error={errors.arName}
              />

              <FormTextarea
                name="arSmallDescription"
                register={register}
                label={f("arSmallDescription.label")}
                placeholder={f("arSmallDescription.placeholder")}
                description={f("arSmallDescription.description")}
                rows={2}
                error={errors.arSmallDescription}
              />

              <FormTextarea
                name="arDescription"
                register={register}
                label={f("arDescription.label")}
                placeholder={f("arDescription.placeholder")}
                description={f("arDescription.description")}
                rows={4}
                error={errors.arDescription}
              />

              <div className="grid grid-cols-1 gap-5">
                <FormMultiInput
                  name="arMaterials"
                  control={control}
                  label={f("arMaterials.label")}
                  placeholder={f("arMaterials.placeholder")}
                  description={f("arMaterials.description")}
                  error={errors.arMaterials}
                  setValue={setValue}
                  watch={watch}
                />

                <FormMultiInput
                  name="arFeatures"
                  control={control}
                  label={f("arFeatures.label")}
                  placeholder={f("arFeatures.placeholder")}
                  description={f("arFeatures.description")}
                  error={errors.arFeatures}
                  setValue={setValue}
                  watch={watch}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <FormField
                  type="text"
                  name="arHeight"
                  register={register}
                  label={f("arHeight.label")}
                  placeholder={f("arHeight.placeholder")}
                  description={f("arHeight.description")}
                  error={errors.arHeight}
                />

                <FormField
                  type="text"
                  name="arWidth"
                  register={register}
                  label={f("arWidth.label")}
                  placeholder={f("arWidth.placeholder")}
                  description={f("arWidth.description")}
                  error={errors.arWidth}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 rounded-xl border border-border/70 bg-card p-6" dir="ltr">
              <div className="pb-2 border-b">
                <h3 className="text-sm font-semibold">{tp("steps.enContent.title")}</h3>
              </div>

              <FormField
                type="text"
                name="enName"
                register={register}
                label={f("enName.label")}
                placeholder={f("enName.placeholder")}
                description={f("enName.description")}
                error={errors.enName}
              />

              <FormTextarea
                name="enSmallDescription"
                register={register}
                label={f("enSmallDescription.label")}
                placeholder={f("enSmallDescription.placeholder")}
                description={f("enSmallDescription.description")}
                rows={2}
                error={errors.enSmallDescription}
              />

              <FormTextarea
                name="enDescription"
                register={register}
                label={f("enDescription.label")}
                placeholder={f("enDescription.placeholder")}
                description={f("enDescription.description")}
                rows={4}
                error={errors.enDescription}
              />

              <div className="grid grid-cols-1 gap-5">
                <FormMultiInput
                  name="enMaterials"
                  control={control}
                  label={f("enMaterials.label")}
                  placeholder={f("enMaterials.placeholder")}
                  description={f("enMaterials.description")}
                  error={errors.enMaterials}
                  setValue={setValue}
                  watch={watch}
                />

                <FormMultiInput
                  name="enFeatures"
                  control={control}
                  label={f("enFeatures.label")}
                  placeholder={f("enFeatures.placeholder")}
                  description={f("enFeatures.description")}
                  error={errors.enFeatures}
                  setValue={setValue}
                  watch={watch}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <FormField
                  type="text"
                  name="enHeight"
                  register={register}
                  label={f("enHeight.label")}
                  placeholder={f("enHeight.placeholder")}
                  description={f("enHeight.description")}
                  error={errors.enHeight}
                />

                <FormField
                  type="text"
                  name="enWidth"
                  register={register}
                  label={f("enWidth.label")}
                  placeholder={f("enWidth.placeholder")}
                  description={f("enWidth.description")}
                  error={errors.enWidth}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5 rounded-xl border border-border/70 bg-card p-6">
              <div className="pb-2 border-b">
                <h3 className="text-sm font-semibold">{tp("steps.tagsAndSeo.title")}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {tp("steps.tagsAndSeo.description")}
                </p>
              </div>

              <FormMultiInput
                name="tags"
                control={control}
                label={f("tags.label")}
                placeholder={f("tags.placeholder")}
                description={f("tags.description")}
                error={errors.tags}
                setValue={setValue}
                watch={watch}
              />

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <FormField
                  type="text"
                  name="metaTitleAr"
                  register={register}
                  label={f("metaTitleAr.label")}
                  placeholder={f("metaTitleAr.placeholder")}
                  description={f("metaTitleAr.description")}
                  error={errors.metaTitleAr}
                />

                <FormField
                  type="text"
                  name="metaTitleEn"
                  register={register}
                  label={f("metaTitleEn.label")}
                  placeholder={f("metaTitleEn.placeholder")}
                  description={f("metaTitleEn.description")}
                  error={errors.metaTitleEn}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <FormTextarea
                  name="metaDescriptionAr"
                  register={register}
                  label={f("metaDescriptionAr.label")}
                  placeholder={f("metaDescriptionAr.placeholder")}
                  description={f("metaDescriptionAr.description")}
                  rows={3}
                  error={errors.metaDescriptionAr}
                />

                <FormTextarea
                  name="metaDescriptionEn"
                  register={register}
                  label={f("metaDescriptionEn.label")}
                  placeholder={f("metaDescriptionEn.placeholder")}
                  description={f("metaDescriptionEn.description")}
                  rows={3}
                  error={errors.metaDescriptionEn}
                />
              </div>

              <FormMultiInput
                name="metaKeywords"
                control={control}
                label={f("metaKeywords.label")}
                placeholder={f("metaKeywords.placeholder")}
                description={f("metaKeywords.description")}
                error={errors.metaKeywords}
                setValue={setValue}
                watch={watch}
              />
            </div>
          )}

          {step === 5 && (
            <div className="space-y-5 rounded-xl border border-border/70 bg-card p-6">
              <GlobalImageUploader
                items={images}
                onChange={setImages}
                maxFiles={5}
                label={f("images.label")}
                description={f("images.description")}
                disabled={loading}
                isUploading={loading}
              />
            </div>
          )}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={step === 1 ? () => push(`/${locale}/products`) : handlePrev}
            >
              <ChevronLeft className="size-4 rtl:hidden" />
              <ChevronRight className="size-4 hidden rtl:block" />
              {step === 1 ? t("actions.back") : t("actions.previous")}
            </Button>

            {step < TOTAL_STEPS ? (
              <Button
                type="button"
                className="w-full sm:w-auto"
                onClick={handleNext}
              >
                {t("actions.next")}
                <ChevronRight className="size-4 rtl:hidden" />
                <ChevronLeft className="size-4 hidden rtl:block" />
              </Button>
            ) : (
              <SubmitButton
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto gap-2"
              >
                <SaveCheck className="size-4" />
                {loading ? t("actions.creating") : t("actions.create")}
              </SubmitButton>
            )}
          </div>
        </form>
      </div>
    </AddUpdateLayout>
  );
};

export default AddProductForm;
