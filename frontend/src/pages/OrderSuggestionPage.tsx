import { useEffect, useMemo, useState } from "react";
import PageTitle from "@/components/PageTitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Download, Loader2, Search } from "lucide-react";
import { apiGet, apiUrl } from "@/lib/api";

type OrderSuggestionRow = {
    productId: number;
    sku: string;
    name: string;
    minTotal: number;
    backroomQty: number;
    shopfloorQty: number;
    totalQty: number;
    suggestedQty: number;
};

function fmtInt(n: number | null | undefined) {
    const x = typeof n === "number" ? n : 0;
    return new Intl.NumberFormat("pl-PL").format(x);
}

function isLow(row: OrderSuggestionRow): boolean {
    const min = row.minTotal ?? 0;
    const total = row.totalQty ?? 0;
    return total < min;
}

export default function OrderSuggestionsPage() {
    const { toast } = useToast();

    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [rows, setRows] = useState<OrderSuggestionRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [lastError, setLastError] = useState<string | null>(null);

    useEffect(() => {
        const t = window.setTimeout(() => setDebouncedQuery(query.trim()), 300);
        return () => window.clearTimeout(t);
    }, [query]);

    async function load() {
        setLoading(true);
        setLastError(null);
        try {
            const q = debouncedQuery ? `?query=${encodeURIComponent(debouncedQuery)}` : "";
            const data = await apiGet<OrderSuggestionRow[]>(`/api/order-suggestions${q}`);
            setRows(Array.isArray(data) ? data : []);
        } catch (e: any) {
            const msg = e?.message ?? "Nie udało się (sprawdź backend).";
            setLastError(msg);
            toast({
                title: "Błąd pobierania danych",
                description: msg,
                variant: "destructive",
            });
            setRows([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedQuery]);

    const stats = useMemo(() => {
        const total = rows.length;
        const low = rows.filter(isLow).length;
        const suggestedSum = rows.reduce((acc, r) => acc + (r.suggestedQty ?? 0), 0);
        return { total, low, suggestedSum };
    }, [rows]);

    function handleExport() {
        const q = debouncedQuery ? `?query=${encodeURIComponent(debouncedQuery)}` : "";
        const url = apiUrl(`/api/order-suggestions/export${q}`);
        window.open(url, "_blank", "noopener,noreferrer");
    }

    return (
        <div className="space-y-6">
            <PageTitle
                title="Sugestie zamówień"
                subtitle="Wyliczenia na podstawie min. stanu oraz aktualnych ilości (zaplecze/sala). Eksport CSV obejmuje tylko low-stock."
            />

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pozycje</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-semibold">{fmtInt(stats.total)}</CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Low-stock</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-semibold">{fmtInt(stats.low)}</CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Suma sugerowanych</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-semibold">{fmtInt(stats.suggestedSum)}</CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="space-y-3">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-1">
                            <CardTitle>Lista sugestii</CardTitle>
                            <div className="text-sm text-muted-foreground">
                                Szukaj po SKU lub nazwie. Eksport CSV to tylko pozycje z sugerowaną ilością &gt; 0.
                            </div>
                        </div>

                        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
                            <div className="relative w-full md:w-[340px]">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Szukaj po SKU lub nazwie..."
                                    className="pl-9"
                                />
                            </div>

                            <Button onClick={handleExport} variant="secondary" className="gap-2">
                                <Download className="h-4 w-4" />
                                Eksport CSV (low-stock)
                            </Button>
                        </div>
                    </div>
                    <Separator />
                </CardHeader>

                <CardContent>
                    {loading ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Ładowanie...
                        </div>
                    ) : lastError ? (
                        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm">
                            <div className="font-medium">Nie udało się pobrać danych</div>
                            <div className="mt-1 text-muted-foreground">{lastError}</div>
                            <div className="mt-3">
                                <Button onClick={() => void load()} size="sm">
                                    Spróbuj ponownie
                                </Button>
                            </div>
                        </div>
                    ) : rows.length === 0 ? (
                        <div className="rounded-md border p-6 text-sm text-muted-foreground">
                            Brak danych. Dodaj produkty i wykonaj ruchy, aby zobaczyć sugestie.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>SKU</TableHead>
                                        <TableHead>Nazwa</TableHead>
                                        <TableHead className="text-right">Zaplecze</TableHead>
                                        <TableHead className="text-right">Sala</TableHead>
                                        <TableHead className="text-right">Suma</TableHead>
                                        <TableHead className="text-right">Min</TableHead>
                                        <TableHead className="text-right">Sugerowane</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {rows.map((r) => {
                                        const low = isLow(r);
                                        const suggested = r.suggestedQty ?? 0;

                                        return (
                                            <TableRow key={`${r.productId}-${r.sku}`}>
                                                <TableCell className="font-medium">{r.sku}</TableCell>
                                                <TableCell>{r.name}</TableCell>
                                                <TableCell className="text-right">{fmtInt(r.backroomQty)}</TableCell>
                                                <TableCell className="text-right">{fmtInt(r.shopfloorQty)}</TableCell>
                                                <TableCell className="text-right">{fmtInt(r.totalQty)}</TableCell>
                                                <TableCell className="text-right">{fmtInt(r.minTotal)}</TableCell>
                                                <TableCell className="text-right">
                          <span className={suggested > 0 ? "font-semibold" : "text-muted-foreground"}>
                            {fmtInt(suggested)}
                          </span>
                                                </TableCell>
                                                <TableCell>
                                                    {low ? (
                                                        <Badge variant="destructive">Low</Badge>
                                                    ) : (
                                                        <Badge variant="outline">OK</Badge>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
