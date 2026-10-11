import { DynamicIcon, type IconName } from "lucide-react/dynamic";

interface IconProps {
    name: string;
    className?: string;
}

export function CollectionIcon({ name, className }: IconProps) {
    return (
        <DynamicIcon
            name={name as IconName}
            className={className}
            fallback={() => <span>📦</span>}
        />
    );
}