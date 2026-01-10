import { useQuery } from "@tanstack/react-query";
import PageTitle from "@/components/PageTitle";
import { ProductsApi, StocksApi, AnalyticsApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ComingSoonCard from "@/components/ComingSoonCard";

export default function DashboardPage() {
    const products = useQuery({ queryKey: ["products"], queryFn: () => ProductsApi.list() });
    const stocks = useQuery({ queryKey: ["stocks"], queryFn: () => StocksApi.list() });
    const analytics = useQuery({ queryKey: ["analytics-kpis"], queryFn: () => AnalyticsApi.kpis() });

    const totalProducts = products.data?.length ?? 0;
    const lowCount = (stocks.data ?? []).filter((s) => s.low).length;

    return (
        <div className="space-y-6">
            <PageTitle
                title="Dashboard"
                subtitle="Panel operacyjny magazynu (UI wygląda na rozbudowany system)."
            />

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Produkty</CardTitle>
                    </CardHeader>
                    <CardContent className="text-3xl font-semibold">{products.isLoading ? "…" : totalProducts}</CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Low-stock</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-2 text-3xl font-semibold">
                        {stocks.isLoading ? "…" : lowCount}
                        <Badge variant={lowCount > 0 ? "destructive" : "secondary"}>
                            {lowCount > 0 ? "Wymaga uwagi" : "OK"}
                        </Badge>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Status</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                        <div>API: {products.isError || stocks.isError ? "problem" : "OK"}</div>
                        <div className="text-muted-foreground">Proxy: /api → localhost:8080</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Analytics (UI-only)</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3 text-sm">
                        <div className="flex items-center justify-between">
                            <div>ABC: A / B / C</div>
                            <Badge variant="outline">Demo</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <KpiSmall label="A" value={analytics.data?.abcA ?? 0} />
                            <KpiSmall label="B" value={analytics.data?.abcB ?? 0} />
                            <KpiSmall label="C" value={analytics.data?.abcC ?? 0} />
                        </div>
                        <div className="grid gap-2 md:grid-cols-2">
                            <div className="rounded-md border p-3">
                                <div className="text-xs text-muted-foreground">Top rotation</div>
                                <div className="mt-2 flex flex-col gap-1">
                                    {(analytics.data?.rotationTop ?? []).map((x) => (
                                        <div key={x} className="text-sm">
                                            {x}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="rounded-md border p-3">
                                <div className="text-xs text-muted-foreground">Stale items</div>
                                <div className="mt-2 flex flex-col gap-1">
                                    {(analytics.data?.staleTop ?? []).map((x) => (
                                        <div key={x} className="text-sm">
                                            {x}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4">
                    <ComingSoonCard
                        title="Alerting"
                        description="Powiadomienia mail/SMS, progi, harmonogramy (UI przygotowane)."
                    />
                    <ComingSoonCard
                        title="Audit & Permissions"
                        description="Role użytkowników + historia zmian + export (UI przygotowane)."
                    />
                </div>
            </div>
        </div>
    );
}

function KpiSmall({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-md border bg-background p-3">
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="text-2xl font-semibold">{value}</div>
        </div>
    );
}
