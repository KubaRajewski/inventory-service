import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PageTitle from "@/components/PageTitle";
import { StocksApi, StockView } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function StocksPage() {
    const [query, setQuery] = useState("");

    const stocks = useQuery({
        queryKey: ["stocks", query],
        queryFn: () => StocksApi.list(query.trim() ? query.trim() : undefined),
    });

    const rows = useMemo<StockView[]>(() => stocks.data ?? [], [stocks.data]);
    const lowRows = useMemo(() => rows.filter((r) => r.low), [rows]);

    return (
        <div className="space-y-6">
            <PageTitle title="Stany" subtitle="Widok zaplecze/sala/suma oraz low-stock." />

            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <Input
                            placeholder="Szukaj po SKU lub nazwie…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="md:max-w-sm"
                        />
                        <div className="text-sm text-muted-foreground">
                            {stocks.isLoading ? "Ładowanie…" : `Wszystkie: ${rows.length} | Low: ${lowRows.length}`}
                        </div>
                    </div>

                    <Tabs defaultValue="all" className="mt-4">
                        <TabsList>
                            <TabsTrigger value="all">Wszystkie</TabsTrigger>
                            <TabsTrigger value="low">Low-stock</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all" className="mt-4">
                            <StocksTable rows={rows} loading={stocks.isLoading} />
                        </TabsContent>

                        <TabsContent value="low" className="mt-4">
                            <StocksTable rows={lowRows} loading={stocks.isLoading} />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}

function StocksTable({ rows, loading }: { rows: StockView[]; loading: boolean }) {
    return (
        <div className="overflow-x-auto rounded-md border bg-background">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Nazwa</TableHead>
                        <TableHead className="text-right">Zaplecze</TableHead>
                        <TableHead className="text-right">Sala</TableHead>
                        <TableHead className="text-right">Suma</TableHead>
                        <TableHead className="text-right">Min</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((s) => (
                        <TableRow key={s.productId}>
                            <TableCell className="font-medium">{s.sku}</TableCell>
                            <TableCell>{s.name}</TableCell>
                            <TableCell className="text-right">{s.backroomQty}</TableCell>
                            <TableCell className="text-right">{s.shopfloorQty}</TableCell>
                            <TableCell className="text-right font-medium">{s.totalQty}</TableCell>
                            <TableCell className="text-right">{s.minTotal ?? 0}</TableCell>
                            <TableCell>
                                <Badge variant={s.low ? "destructive" : "secondary"}>{s.low ? "LOW" : "OK"}</Badge>
                            </TableCell>
                        </TableRow>
                    ))}

                    {!loading && rows.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                                Brak danych.
                            </TableCell>
                        </TableRow>
                    ) : null}
                </TableBody>
            </Table>
        </div>
    );
}
