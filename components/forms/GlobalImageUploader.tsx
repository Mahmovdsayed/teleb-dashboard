"use client";

import React, { useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { RotateCcw } from "lucide-react";
import {
  FileUpload,
  type FileUploadItem,
} from "@/components/motion/file-upload";
import { MAX_IMAGE_SIZE, IMAGE_EXTENSIONS } from "@/constant/image-constants";
import { toast } from "@/components/ui/toast";
import AlertWrapper from "@/components/ui/AlertWrapper";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";

export interface UploadImageItem {
  id: string;
  name: string;
  size?: number;
  previewUrl: string;
  file?: File;
  url?: string;
  publicId?: string;
  order: number;
}

export interface GlobalImageUploaderProps {
  items: UploadImageItem[];
  onChange: (items: UploadImageItem[]) => void;
  onRemoveItem?: (item: UploadImageItem) => void;
  maxFiles?: number;
  maxFileSize?: number;
  allowedExtensions?: string[];
  label?: string;
  description?: string;
  error?: string;
  disabled?: boolean;
  isUploading?: boolean;
  className?: string;
}

export const GlobalImageUploader = ({
  items = [],
  onChange,
  onRemoveItem,
  maxFiles = 5,
  maxFileSize = MAX_IMAGE_SIZE,
  allowedExtensions = IMAGE_EXTENSIONS,
  label,
  description,
  error,
  disabled = false,
  isUploading = false,
  className,
}: GlobalImageUploaderProps) => {
  const locale = useLocale();
  const t = useTranslations("uploader");

  const handleFilesAdded = useCallback(
    (added: FileUploadItem[], rawFiles: File[]) => {
      const validNewItems: UploadImageItem[] = [];

      for (let i = 0; i < rawFiles.length; i++) {
        const file = rawFiles[i];
        const ext = file.name.split(".").pop()?.toLowerCase() || "";
        const isAllowedExt = allowedExtensions.includes(ext);
        const isImageMime = file.type.startsWith("image/");

        if (!isAllowedExt || !isImageMime) {
          toast.add({
            title: t("errors.unsupportedType", { name: file.name }),
            type: "error",
          });
          continue;
        }

        if (file.size > maxFileSize) {
          const maxSizeMB = Math.round(maxFileSize / (1024 * 1024));
          toast.add({
            title: t("errors.fileTooLarge", {
              name: file.name,
              maxSize: maxSizeMB,
            }),
            type: "error",
          });
          continue;
        }

        const previewUrl = URL.createObjectURL(file);
        validNewItems.push({
          id: `${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`,
          name: file.name,
          size: file.size,
          previewUrl,
          file,
          order: items.length + validNewItems.length,
        });
      }

      if (validNewItems.length > 0) {
        onChange([...items, ...validNewItems]);
      }
    },
    [allowedExtensions, items, maxFileSize, onChange, t]
  );

  const handleRemove = useCallback(
    (item: FileUploadItem) => {
      if (item.previewUrl && item.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(item.previewUrl);
      }
      const updated = items
        .filter((i) => i.id !== item.id)
        .map((entry, idx) => ({ ...entry, order: idx }));
      onChange(updated);
      onRemoveItem?.(item as UploadImageItem);
    },
    [items, onChange, onRemoveItem]
  );

  const handleReorder = useCallback(
    (reorderedItems: FileUploadItem[]) => {
      const mapped = reorderedItems.map((item, idx) => {
        const existing = items.find((i) => i.id === item.id);
        return {
          id: item.id,
          name: item.name,
          size: item.size,
          previewUrl: item.previewUrl || existing?.previewUrl || "",
          file: item.file || existing?.file,
          url: item.url || existing?.url,
          publicId: item.publicId || existing?.publicId,
          order: idx,
        };
      });
      onChange(mapped);
    },
    [items, onChange]
  );

  const handleReset = useCallback(() => {
    for (const item of items) {
      if (item.previewUrl && item.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(item.previewUrl);
      }
    }
    onChange([]);
  }, [items, onChange]);

  const maxSizeMB = Math.round(maxFileSize / (1024 * 1024));

  return (
    <Field className={cn("w-full space-y-3", className)}>
      <div>
        <FieldLabel>{label || t("title")}</FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
      </div>

      <div className="w-full rounded-xl border border-border bg-card p-4 shadow-xs transition-all">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-1">
          <div>
            <p className="text-xs font-semibold text-foreground">
              {t("title")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("filesReady", { ready: items.length, total: maxFiles })}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={handleReset}
                disabled={disabled || isUploading}
                className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground hover:bg-muted active:scale-95 disabled:opacity-40"
                title={t("reset")}
                aria-label={t("reset")}
              >
                <RotateCcw className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        <FileUpload
          value={items}
          onFilesAdded={handleFilesAdded}
          onRemove={handleRemove}
          onReorder={handleReorder}
          maxFiles={maxFiles}
          maxFileSize={maxFileSize}
          disabled={disabled || isUploading}
          isUploading={isUploading}
          title={t("dropzoneTitle")}
          description={t("dropzoneDesc", { maxSize: maxSizeMB })}
          cloudNotice={t("cloudNotice")}
          labels={{
            remove: t("remove"),
            moveUp: t("moveUp"),
            moveDown: t("moveDown"),
            orderPrefix: t("order"),
            uploading: t("uploading"),
            preview: t("preview"),
            close: t("close"),
          }}
        />
      </div>

      {error && <AlertWrapper errText={error} />}
    </Field>
  );
};

export default GlobalImageUploader;
