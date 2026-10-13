interface IProps {
    active: boolean;
    children: React.ReactNode;
}
const StatusBadge = ({ active, children }: IProps) => {
    return <>
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${active ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
            {children}
        </span>
    </>;
};

export default StatusBadge;