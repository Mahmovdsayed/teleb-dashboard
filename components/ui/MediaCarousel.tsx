'use client';

import * as React from "react";
import { useLocale } from "next-intl";
import { ImageOff } from "lucide-react";

import { cn } from "@/lib/utils";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "./carousel";

const ASPECTS = {
    square: "1 / 1",
    video: "16 / 9",
    banner: "19 / 6",
    portrait: "3 / 4",
} as const;

export type CarouselAspect = keyof typeof ASPECTS | number | (string & {});

export type CarouselMedia = {
    id?: string | number;
    url: string;
    alt?: string;
    type?: "image" | "video";
    poster?: string;
};

interface IProps {
    items: CarouselMedia[];
    aspect?: CarouselAspect;
    fit?: "cover" | "contain";
    dir?: "ltr" | "rtl";
    loop?: boolean;
    showCounter?: boolean;
    emptyLabel?: string;
    className?: string;
}

const resolveAspect = (aspect: CarouselAspect): string | number =>
    typeof aspect === "number"
        ? aspect
        : ASPECTS[aspect as keyof typeof ASPECTS] ?? aspect;

const MediaCarousel = ({
    items,
    aspect = "video",
    fit = "cover",
    dir,
    loop = true,
    showCounter = true,
    emptyLabel,
    className,
}: IProps) => {
    const locale = useLocale();
    const direction = dir ?? (locale === "ar" ? "rtl" : "ltr");
    const isRtl = direction === "rtl";

    const hasMany = items.length > 1;
    const ratio = resolveAspect(aspect);

    const rootRef = React.useRef<HTMLDivElement>(null);
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);

    React.useEffect(() => {
        if (!api) return;
        const onSelect = () => {
            setCurrent(api.selectedScrollSnap());
            rootRef.current
                ?.querySelectorAll("video")
                .forEach((video) => video.pause());
        };
        setCurrent(api.selectedScrollSnap());
        api.on("select", onSelect);
        api.on("reInit", onSelect);
        return () => {
            api.off("select", onSelect);
            api.off("reInit", onSelect);
        };
    }, [api]);

    return (
        <div
            ref={rootRef}
            className={cn(
                "relative w-full overflow-hidden rounded-xl border bg-muted",
                className
            )}
        >
            {items.length === 0 ? (
                <div
                    style={{ aspectRatio: ratio }}
                    className="flex w-full items-center justify-center text-muted-foreground"
                >
                    <ImageOff className="size-6" />
                    {emptyLabel && <span className="sr-only">{emptyLabel}</span>}
                </div>
            ) : (
                <Carousel
                    key={items.map((item) => item.id ?? item.url).join("|")}
                    dir={direction}
                    setApi={setApi}
                    opts={{
                        direction,
                        loop: loop && hasMany,
                        watchDrag: hasMany,
                    }}
                >
                    <CarouselContent className="ml-0">
                        {items.map((item, index) => (
                            <CarouselItem key={item.id ?? item.url} className="pl-0">
                                <div style={{ aspectRatio: ratio }} className="w-full">
                                    {item.type === "video" ? (
                                        <video
                                            src={item.url}
                                            poster={item.poster}
                                            controls
                                            muted
                                            playsInline
                                            preload="metadata"
                                            className={cn(
                                                "size-full bg-black",
                                                fit === "cover" ? "object-cover" : "object-contain"
                                            )}
                                        />
                                    ) : (
                                        <img
                                            src={item.url}
                                            alt={item.alt ?? ""}
                                            loading={index === 0 ? "eager" : "lazy"}
                                            draggable={false}
                                            className={cn(
                                                "size-full",
                                                fit === "cover" ? "object-cover" : "object-contain"
                                            )}
                                        />
                                    )}
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {hasMany && (
                        <>
                            <CarouselPrevious
                                className={cn(
                                    "size-7 bg-background/80 backdrop-blur hover:bg-background sm:size-8 rtl:[&_svg]:rotate-180",
                                    isRtl ? "right-2 left-auto" : "left-2 right-auto"
                                )}
                            />
                            <CarouselNext
                                className={cn(
                                    "size-7 bg-background/80 backdrop-blur hover:bg-background sm:size-8 rtl:[&_svg]:rotate-180",
                                    isRtl ? "left-2 right-auto" : "right-2 left-auto"
                                )}
                            />
                            {showCounter && (
                                <span
                                    dir="ltr"
                                    className="absolute bottom-2 inset-e-2 rounded-md bg-background/80 px-2 py-0.5 text-xs tabular-nums backdrop-blur"
                                >
                                    {current + 1} / {items.length}
                                </span>
                            )}
                        </>
                    )}
                </Carousel>
            )}
        </div>
    );
};

export default MediaCarousel;