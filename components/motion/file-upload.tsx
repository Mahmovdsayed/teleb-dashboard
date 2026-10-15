"use client";

import React, {
  useCallback,
  useId,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  ArrowDown,
  ArrowUp,
  CloudUpload,
  FileImage,
  LoaderCircle,
  Upload,
  X,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SPRING_LAYOUT, SPRING_PRESS } from "@/lib/ease";
import { createPortal } from "react-dom";

export interface FileUploadItem {
  id: string;
  name: string;
  size?: number;
  type?: string;
  progress?: number;
  status?: "idle" | "uploading" | "success" | "error";
  error?: string;
  url?: string;
  publicId?: string;
  order?: number;
  previewUrl?: string;
  file?: File;
}

export interface FileUploadProps {
  value: FileUploadItem[];
  onValueChange?: (items: FileUploadItem[]) => void;
  onFilesAdded?: (added: FileUploadItem[], rawFiles: File[]) => void;
  onRemove?: (item: FileUploadItem) => void;
  onReorder?: (items: FileUploadItem[]) => void;
  maxFiles?: number;
  maxFileSize?: number;
  accept?: string;
  disabled?: boolean;
  title?: string;
  description?: string;
  cloudNotice?: string;
  isUploading?: boolean;
  labels?: {
    remove?: string;
    moveUp?: string;
    moveDown?: string;
    orderPrefix?: string;
    uploading?: string;
    preview?: string;
    close?: string;
  };
  className?: string;
}

function formatFileSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  const exp = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const val = bytes / 1024 ** exp;
  return `${val >= 10 || exp === 0 ? val.toFixed(0) : val.toFixed(1)} ${units[exp]}`;
}

export function FileUpload({
  value,
  onValueChange,
  onFilesAdded,
  onRemove,
  onReorder,
  maxFiles = 10,
  maxFileSize = 5 * 1024 * 1024,
  accept = "image/jpeg,image/png,image/webp",
  disabled = false,
  title,
  description,
  cloudNotice,
  isUploading = false,
  labels,
  className,
}: FileUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepthRef = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [previewItem, setPreviewItem] = useState<FileUploadItem | null>(null);
  const reduce = useReducedMotion() ?? false;

  const isMaxReached = value.length >= maxFiles;

  const handleFiles = useCallback(
    (files: File[]) => {
      if (disabled || isMaxReached || files.length === 0) return;

      const remainingSlots = Math.max(0, maxFiles - value.length);
      const allowedFiles = files.slice(0, remainingSlots);

      const newItems: FileUploadItem[] = allowedFiles.map((file, idx) => {
        const previewUrl = URL.createObjectURL(file);
        return {
          id: `${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
          name: file.name,
          size: file.size,
          type: file.type,
          previewUrl,
          file,
          order: value.length + idx,
        };
      });

      const updated = [...value, ...newItems];
      onValueChange?.(updated);
      onFilesAdded?.(newItems, allowedFiles);
    },
    [disabled, isMaxReached, maxFiles, onFilesAdded, onValueChange, value]
  );

  const moveItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= value.length) return;

    const next = [...value];
    const [moved] = next.splice(index, 1);
    next.splice(targetIndex, 0, moved);

    const reordered = next.map((item, idx) => ({ ...item, order: idx }));
    onValueChange?.(reordered);
    onReorder?.(reordered);
  };

  return (
    <LayoutGroup id={inputId}>
      <div className={cn("w-full space-y-4", className)}>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          multiple={maxFiles > 1}
          disabled={disabled || isMaxReached || isUploading}
          className="sr-only"
          onChange={(e) => {
            const files = Array.from(e.currentTarget.files ?? []);
            handleFiles(files);
            e.currentTarget.value = "";
          }}
        />

        {isUploading && cloudNotice && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 rounded-xl border border-sky-500/20 bg-sky-500/10 p-3.5 text-xs font-medium text-sky-700 dark:text-sky-300"
          >
            <CloudUpload className="h-5 w-5 shrink-0 animate-bounce text-sky-600 dark:text-sky-400" />
            <div className="flex-1">
              <p className="font-semibold">{cloudNotice}</p>
            </div>
            <LoaderCircle className="h-4 w-4 shrink-0 animate-spin text-sky-600 dark:text-sky-400" />
          </motion.div>
        )}

        <motion.div
          role="button"
          tabIndex={0}
          aria-disabled={disabled || isMaxReached || isUploading}
          data-dragging={dragging}
          onClick={() => {
            if (!disabled && !isMaxReached && !isUploading) {
              inputRef.current?.click();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragEnter={(e) => {
            if (disabled || isMaxReached || isUploading) return;
            e.preventDefault();
            dragDepthRef.current += 1;
            setDragging(true);
          }}
          onDragOver={(e) => {
            if (disabled || isMaxReached || isUploading) return;
            e.preventDefault();
            e.dataTransfer.dropEffect = "copy";
            setDragging(true);
          }}
          onDragLeave={(e) => {
            if (disabled || isMaxReached || isUploading) return;
            e.preventDefault();
            dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
            if (dragDepthRef.current === 0) setDragging(false);
          }}
          onDrop={(e) => {
            if (disabled || isMaxReached || isUploading) return;
            e.preventDefault();
            dragDepthRef.current = 0;
            setDragging(false);
            const files = Array.from(e.dataTransfer.files);
            handleFiles(files);
          }}
          whileTap={reduce || disabled || isMaxReached || isUploading ? undefined : { scale: 0.995 }}
          className={cn(
            "group relative isolate flex w-full min-h-48 flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed p-6 py-8 text-center transition-all duration-200 cursor-pointer outline-none",
            dragging
              ? "border-primary bg-primary/10 shadow-lg scale-[1.01]"
              : "border-border/80 bg-muted/40 hover:bg-muted/70 hover:border-border",
            (disabled || isMaxReached || isUploading) && "opacity-50 cursor-not-allowed hover:bg-muted/40 hover:border-border/80"
          )}
        >
          <motion.div
            animate={reduce ? undefined : { y: dragging ? -4 : 0, scale: dragging ? 1.1 : 1 }}
            transition={SPRING_PRESS}
            className="mb-3 grid size-12 place-items-center rounded-xl bg-background border border-border shadow-xs text-foreground transition-colors group-hover:border-primary/40 group-data-[dragging=true]:bg-primary group-data-[dragging=true]:text-primary-foreground"
          >
            <Upload className="size-5" />
          </motion.div>

          <p className="text-sm font-semibold text-foreground">
            {isMaxReached ? "Maximum files limit reached" : (title || "Drop images here or click to browse")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {description || "Supports JPG, PNG, WEBP"}
          </p>
        </motion.div>

        {value.length > 0 && (
          <div className="space-y-2.5">
            <AnimatePresence initial={false}>
              {value.map((item, index) => {
                const isFirst = index === 0;
                const isLast = index === value.length - 1;
                const displaySrc = item.previewUrl || item.url;

                return (
                  <motion.div
                    key={item.id}
                    layout={!reduce}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                    transition={SPRING_LAYOUT}
                    className="relative isolate flex items-center gap-3 overflow-hidden rounded-xl border border-border/80 bg-card p-2.5 shadow-2xs transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center gap-1">
                      <span className="grid size-6 place-items-center rounded-full bg-muted text-[11px] font-bold text-foreground">
                        {index + 1}
                      </span>
                    </div>

                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setPreviewItem(item)}
                      className="group/thumb relative size-12 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-border/60 bg-muted"
                      title={labels?.preview || "Click to preview"}
                    >
                      {displaySrc ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={displaySrc}
                            alt={item.name}
                            className="size-full object-cover transition-transform duration-200 group-hover/thumb:scale-105"
                          />
                          <div className="absolute inset-0 grid place-items-center bg-black/30 opacity-0 transition-opacity group-hover/thumb:opacity-100">
                            <Eye className="size-4 text-white" />
                          </div>
                        </>
                      ) : (
                        <div className="grid size-full place-items-center text-muted-foreground">
                          <FileImage className="size-5" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-foreground" title={item.name}>
                        {item.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                        {item.size ? <span>{formatFileSize(item.size)}</span> : null}
                        {isUploading && (
                          <span className="text-primary font-medium flex items-center gap-1">
                            <LoaderCircle className="size-3 animate-spin" />
                            {labels?.uploading || "Uploading to Cloudinary..."}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={isFirst || disabled || isUploading}
                        onClick={() => moveItem(index, "up")}
                        className="grid size-7 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
                        title={labels?.moveUp || "Move Up"}
                        aria-label="Move Up"
                      >
                        <ArrowUp className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={isLast || disabled || isUploading}
                        onClick={() => moveItem(index, "down")}
                        className="grid size-7 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
                        title={labels?.moveDown || "Move Down"}
                        aria-label="Move Down"
                      >
                        <ArrowDown className="size-3.5" />
                      </button>

                      {onRemove && (
                        <button
                          type="button"
                          disabled={disabled || isUploading}
                          onClick={() => onRemove(item)}
                          className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-40"
                          title={labels?.remove || "Remove"}
                          aria-label="Remove item"
                        >
                          <X className="size-3.5" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {previewItem && typeof document !== "undefined" && createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs"
            onClick={() => setPreviewItem(null)}
          >
            <div
              className="relative max-h-[90vh] max-w-2xl overflow-hidden rounded-2xl bg-card border border-border p-2 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="absolute right-4 top-4 z-10 grid size-8 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X className="size-4" />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewItem.previewUrl || previewItem.url}
                alt={previewItem.name}
                className="max-h-[80vh] w-auto rounded-xl object-contain mx-auto"
              />
              <p className="mt-2 text-center text-xs font-medium text-muted-foreground truncate px-4">
                {previewItem.name}
              </p>
            </div>
          </div>,
          document.body
        )}
      </div>
    </LayoutGroup>
  );
}
