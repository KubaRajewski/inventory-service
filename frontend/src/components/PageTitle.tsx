export default function PageTitle({
                                      title,
                                      subtitle,
                                      right,
                                  }: {
    title: string;
    subtitle?: string;
    right?: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
                <div className="text-2xl font-semibold tracking-tight">{title}</div>
                {subtitle ? <div className="text-sm text-muted-foreground">{subtitle}</div> : null}
            </div>
            {right ? <div className="flex items-center gap-2">{right}</div> : null}
        </div>
    );
}
