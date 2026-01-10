import PageTitle from "@/components/PageTitle";
import ComingSoonCard from "@/components/ComingSoonCard";
import { useQuery } from "@tanstack/react-query";
import { ProductsApi, StocksApi, AnalyticsApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ReportsPage() {
    const products = useQuery({ queryKey: ["products"], queryFn: () => ProductsApi.list() });
    const stocks = useQuery({ queryKey: ["stocks"], queryFn: () => StocksApi.list() });
    const analytics = useQuery({ queryKey: ["analytics-kpis"], queryFn: () => AnalyticsApi.kpis() });

    const lowCount = (stocks.data ?? []).filter((s) => s.low).length;

    return (
        <div className="space-y-6">
            <PageTitle title="Raporty" subtitle="UI pod rozbudowany system (część raportów to placeholdery)." />

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Produkty</CardTitle>
                    </CardHeader>
                    <CardContent className="text-3xl font-semibold">{products.isLoading ? "…" : products.data?.length ?? 0}</CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Low-stock</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-2 text-3xl font-semibold">
                        {stocks.isLoading ? "…" : lowCount}
                        <Badge variant={lowCount > 0 ? "destructive" : "secondary"}>{lowCount > 0 ? "Do zamówienia" : "OK"}</Badge>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">ABC</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                        <div>A: {analytics.data?.abcA ?? 0}</div>
                        <div>B: {analytics.data?.abcB ?? 0}</div>
                        <div>C: {analytics.data?.abcC ?? 0}</div>
                        <div className="mt-2 text-xs text-muted-foreground">Wyliczane w UI (demo).</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                <ComingSoonCard
                    title="Rotacja / Zaleganie"
                    description="Top produkty, trend tygodniowy, wskaźniki rotacji (UI przygotowane)."
                />
                <ComingSoonCard
                    title="Raport ABC / XYZ"
                    description="Klasyfikacja według wartości/rotacji + eksport (UI przygotowane)."
                />
                <ComingSoonCard
                    title="Sugestie zamówień"
                    description="Generowanie propozycji do dostawcy + CSV (do spięcia opcjonalnie)."
                />
            </div>
        </div>
    );
}
