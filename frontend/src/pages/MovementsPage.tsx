import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PageTitle from "@/components/PageTitle";
import { Location, MovementsApi, ProductsApi, errorMessage, Movement, Product } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

const locations: Location[] = ["BACKROOM", "SHOPFLOOR"];

function toInt(v: string): number {
    const n = Number(v);
    if (!Number.isFinite(n) || n <= 0) return 0;
    return Math.floor(n);
}

export default function MovementsPage() {
    const { toast } = useToast();
    const qc = useQueryClient();

    const products = useQuery({
        queryKey: ["products"],
        queryFn: () => ProductsApi.list(),
    });

    const [productId, setProductId] = useState<number | null>(null);

    const movements = useQuery({
        queryKey: ["movements", productId],
        queryFn: () => MovementsApi.list(productId ?? undefined),
        enabled: productId != null,
    });

    const productOptions = useMemo<Product[]>(() => (products.data ?? []).filter((p) => p.active), [products.data]);

    const receipt = useMutation({
        mutationFn: (body: { productId: number; qty: number; toLocation?: Location; note?: string }) =>
            MovementsApi.receipt(body),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ["stocks"] });
            await qc.invalidateQueries({ queryKey: ["movements"] });
            toast({ title: "OK", description: "Przyjęcie zapisane." });
        },
        onError: (e) => toast({ title: "Błąd", description: errorMessage(e), variant: "destructive" }),
    });

    const issue = useMutation({
        mutationFn: (body: { productId: number; qty: number; fromLocation?: Location; note?: string }) =>
            MovementsApi.issue(body),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ["stocks"] });
            await qc.invalidateQueries({ queryKey: ["movements"] });
            toast({ title: "OK", description: "Wydanie zapisane." });
        },
        onError: (e) => toast({ title: "Błąd", description: errorMessage(e), variant: "destructive" }),
    });

    const transfer = useMutation({
        mutationFn: (body: { productId: number; qty: number; from: Location; to: Location; note?: string }) =>
            MovementsApi.transfer(body),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ["stocks"] });
            await qc.invalidateQueries({ queryKey: ["movements"] });
            toast({ title: "OK", description: "Przesunięcie zapisane." });
        },
        onError: (e) => toast({ title: "Błąd", description: errorMessage(e), variant: "destructive" }),
    });

    return (
        <div className="space-y-6">
            <PageTitle title="Ruchy" subtitle="Przyjęcia, wydania, przesunięcia oraz podgląd historii." />

            <Card>
                <CardContent className="p-4">
                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="grid gap-2">
                            <div className="text-sm font-medium">Produkt</div>
                            <Select value={productId?.toString() ?? ""} onValueChange={(v) => setProductId(Number(v))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Wybierz produkt…" />
                                </SelectTrigger>
                                <SelectContent>
                                    {productOptions.map((p) => (
                                        <SelectItem key={p.id} value={String(p.id)}>
                                            {p.sku} — {p.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="text-xs text-muted-foreground">Po wyborze produktu pokaże się historia ruchów.</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Operacje</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="receipt">
                            <TabsList>
                                <TabsTrigger value="receipt">Receipt</TabsTrigger>
                                <TabsTrigger value="issue">Issue</TabsTrigger>
                                <TabsTrigger value="transfer">Transfer</TabsTrigger>
                            </TabsList>

                            <TabsContent value="receipt" className="mt-4">
                                <MovementFormReceipt
                                    disabled={productId == null || receipt.isPending}
                                    onSubmit={(qty, loc, note) => productId != null && receipt.mutate({ productId, qty, toLocation: loc, note })}
                                />
                            </TabsContent>

                            <TabsContent value="issue" className="mt-4">
                                <MovementFormIssue
                                    disabled={productId == null || issue.isPending}
                                    onSubmit={(qty, loc, note) => productId != null && issue.mutate({ productId, qty, fromLocation: loc, note })}
                                />
                            </TabsContent>

                            <TabsContent value="transfer" className="mt-4">
                                <MovementFormTransfer
                                    disabled={productId == null || transfer.isPending}
                                    onSubmit={(qty, from, to, note) => productId != null && transfer.mutate({ productId, qty, from, to, note })}
                                />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Historia</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {productId == null ? (
                            <div className="text-sm text-muted-foreground">Wybierz produkt, aby zobaczyć historię.</div>
                        ) : (
                            <MovementsTable rows={movements.data ?? []} loading={movements.isLoading} />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function MovementFormReceipt({
                                 disabled,
                                 onSubmit,
                             }: {
    disabled: boolean;
    onSubmit: (qty: number, toLocation: Location, note: string) => void;
}) {
    const [qty, setQty] = useState(0);
    const [loc, setLoc] = useState<Location>("BACKROOM");
    const [note, setNote] = useState("");

    return (
        <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                    <div className="text-sm font-medium">Ilość</div>
                    <Input inputMode="numeric" value={String(qty)} onChange={(e) => setQty(toInt(e.target.value))} />
                </div>
                <div className="grid gap-2">
                    <div className="text-sm font-medium">Do</div>
                    <Select value={loc} onValueChange={(v) => setLoc(v as Location)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {locations.map((l) => (
                                <SelectItem key={l} value={l}>{l}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-2">
                <div className="text-sm font-medium">Notatka</div>
                <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="opcjonalnie" />
            </div>

            <Button disabled={disabled || qty <= 0} onClick={() => onSubmit(qty, loc, note)}>
                Zapisz receipt
            </Button>
        </div>
    );
}

function MovementFormIssue({
                               disabled,
                               onSubmit,
                           }: {
    disabled: boolean;
    onSubmit: (qty: number, fromLocation: Location, note: string) => void;
}) {
    const [qty, setQty] = useState(0);
    const [loc, setLoc] = useState<Location>("SHOPFLOOR");
    const [note, setNote] = useState("");

    return (
        <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                    <div className="text-sm font-medium">Ilość</div>
                    <Input inputMode="numeric" value={String(qty)} onChange={(e) => setQty(toInt(e.target.value))} />
                </div>
                <div className="grid gap-2">
                    <div className="text-sm font-medium">Z</div>
                    <Select value={loc} onValueChange={(v) => setLoc(v as Location)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {locations.map((l) => (
                                <SelectItem key={l} value={l}>{l}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-2">
                <div className="text-sm font-medium">Notatka</div>
                <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="opcjonalnie" />
            </div>

            <Button disabled={disabled || qty <= 0} onClick={() => onSubmit(qty, loc, note)}>
                Zapisz issue
            </Button>
        </div>
    );
}

function MovementFormTransfer({
                                  disabled,
                                  onSubmit,
                              }: {
    disabled: boolean;
    onSubmit: (qty: number, from: Location, to: Location, note: string) => void;
}) {
    const [qty, setQty] = useState(0);
    const [from, setFrom] = useState<Location>("BACKROOM");
    const [to, setTo] = useState<Location>("SHOPFLOOR");
    const [note, setNote] = useState("");

    return (
        <div className="grid gap-3">
            <div className="grid grid-cols-3 gap-3">
                <div className="grid gap-2">
                    <div className="text-sm font-medium">Ilość</div>
                    <Input inputMode="numeric" value={String(qty)} onChange={(e) => setQty(toInt(e.target.value))} />
                </div>

                <div className="grid gap-2">
                    <div className="text-sm font-medium">Z</div>
                    <Select value={from} onValueChange={(v) => setFrom(v as Location)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {locations.map((l) => (
                                <SelectItem key={l} value={l}>{l}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-2">
                    <div className="text-sm font-medium">Do</div>
                    <Select value={to} onValueChange={(v) => setTo(v as Location)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {locations.map((l) => (
                                <SelectItem key={l} value={l}>{l}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-2">
                <div className="text-sm font-medium">Notatka</div>
                <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="opcjonalnie" />
            </div>

            <Button disabled={disabled || qty <= 0 || from === to} onClick={() => onSubmit(qty, from, to, note)}>
                Zapisz transfer
            </Button>

            {from === to ? <div className="text-xs text-destructive">Lokacje muszą być różne.</div> : null}
        </div>
    );
}

function MovementsTable({ rows, loading }: { rows: Movement[]; loading: boolean }) {
    return (
        <div className="overflow-x-auto rounded-md border bg-background">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Typ</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Note</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((m) => (
                        <TableRow key={m.id}>
                            <TableCell className="font-medium">{m.type}</TableCell>
                            <TableCell className="text-right">{m.quantity}</TableCell>
                            <TableCell className="text-muted-foreground">{m.fromLocation ?? "-"}</TableCell>
                            <TableCell className="text-muted-foreground">{m.toLocation ?? "-"}</TableCell>
                            <TableCell className="text-muted-foreground">
                                {m.occurredAt ? new Date(m.occurredAt).toLocaleString() : "-"}
                            </TableCell>
                            <TableCell className="text-muted-foreground">{m.note ?? ""}</TableCell>
                        </TableRow>
                    ))}

                    {!loading && rows.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                                Brak danych.
                            </TableCell>
                        </TableRow>
                    ) : null}
                </TableBody>
            </Table>
        </div>
    );
}
