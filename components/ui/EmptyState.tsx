import { Card, CardContent } from "@/components/ui/card";

interface IProps {
    title: string;
    description: string;
    className?: string;
}

const EmptyState = ({ title, description, className }: IProps) => {
    return <>
        <Card className={`border-dashed py-12 ${className ?? ""}`}>
            <CardContent className="text-center">
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    </>;
};

export default EmptyState;