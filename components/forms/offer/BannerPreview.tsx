interface BannerPreviewProps {
    bgColor: string;
    textColor: string;
    text: string;
    label: string;
    empty: string;
}

const BannerPreview = ({ bgColor, textColor, text, label, empty }: BannerPreviewProps) => {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground">{label}</span>
            <div className="flex min-h-[44px] w-full items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all"
                style={{ backgroundColor: bgColor, color: textColor }}
            >
                {text || empty}
            </div>
        </div>
    );
};

export default BannerPreview;
