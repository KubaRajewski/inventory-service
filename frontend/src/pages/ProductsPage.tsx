import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PageTitle from "@/components/PageTitle";
import { CreateProductRequest, ProductsApi, Product, UpdateProductRequest, errorMessage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { MoreHorizontal, Plus } from "lucide-react";

function normalizeMinTotal(v: string): number {
    const n = Number(v);
    if (!Number.isFinite(n) || n < 0) return 0;
    return Math.floor(n);
}

export default function ProductsPage() {
    const { toast } = useToast();
    const qc = useQueryClient();

    const [query, setQuery] = useState("");
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    const [form, setForm] = useState<CreateProductRequest>({
        sku: "",
        name: "",
        unit: "pcs",
        minTotal: 0,
    });

    const [editId, setEditId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<UpdateProductRequest>({});

    const products = useQuery({
        queryKey: ["products", query],
        queryFn: () => ProductsApi.list(query.trim() ? query.trim() : undefined),
    });

    const createMutation = useMutation({
        mutationFn: (req: CreateProductRequest) => ProductsApi.create(req),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ["products"] });
            toast({ title: "Zapisano", description: "Produkt został utworzony." });
            setCreateOpen(false);
            setForm({ sku: "", name: "", unit: "pcs", minTotal: 0 });
        },
        onError: (e) => toast({ title: "Błąd", description: errorMessage(e), variant: "destructive" }),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, req }: { id: number; req: UpdateProductRequest }) => ProductsApi.update(id, req),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ["products"] });
            toast({ title: "Zapisano", description: "Produkt został zaktualizowany." });
            setEditOpen(false);
            setEditId(null);
            setEditForm({});
        },
        onError: (e) => toast({ title: "Błąd", description: errorMessage(e), variant: "destructive" }),
    });

    const rows = useMemo<Product[]>(() => products.data ?? [], [products.data]);

    function openEdit(p: Product) {
        setEditId(p.id);
        setEditForm({
            sku: p.sku,
            name: p.name,
            unit: p.unit,
            minTotal: p.minTotal,
            active: p.active,
        });
        setEditOpen(true);
    }

    function toggleActive(p: Product) {
        updateMutation.mutate({ id: p.id, req: { active: !p.active } });
    }

    return (
        <div className="space-y-6">
            <PageTitle
                title="Produkty"
                subtitle="Kartoteka towarowa: dodawanie, wyszukiwanie, aktywność."
                right={
                    <Button onClick={() => setCreateOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Dodaj produkt
                    </Button>
                }
            />

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
                            {products.isLoading ? "Ładowanie…" : `Wyników: ${rows.length}`}
                        </div>
                    </div>

                    <div className="mt-4 overflow-x-auto rounded-md border bg-background">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>SKU</TableHead>
                                    <TableHead>Nazwa</TableHead>
                                    <TableHead>JM</TableHead>
                                    <TableHead className="text-right">Min</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-[60px]" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium">{p.sku}</TableCell>
                                        <TableCell>{p.name}</TableCell>
                                        <TableCell className="text-muted-foreground">{p.unit}</TableCell>
                                        <TableCell className="text-right">{p.minTotal ?? 0}</TableCell>
                                        <TableCell>
                                            <Badge variant={p.active ? "secondary" : "outline"}>
                                                {p.active ? "ACTIVE" : "INACTIVE"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="icon" variant="ghost">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openEdit(p)}>Edytuj</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => toggleActive(p)}>
                                                        {p.active ? "Dezaktywuj" : "Aktywuj"}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {!products.isLoading && rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                                            Brak danych.
                                        </TableCell>
                                    </TableRow>
                                ) : null}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* CREATE */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Dodaj produkt</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-3">
                        <div className="grid gap-2">
                            <div className="text-sm font-medium">SKU</div>
                            <Input
                                value={form.sku}
                                onChange={(e) => setForm((s) => ({ ...s, sku: e.target.value }))}
                                placeholder="np. SKU-001"
                            />
                        </div>

                        <div className="grid gap-2">
                            <div className="text-sm font-medium">Nazwa</div>
                            <Input
                                value={form.name}
                                onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                                placeholder="np. Milk 1L"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="grid gap-2">
                                <div className="text-sm font-medium">Jednostka</div>
                                <Input
                                    value={form.unit}
                                    onChange={(e) => setForm((s) => ({ ...s, unit: e.target.value }))}
                                    placeholder="pcs"
                                />
                            </div>

                            <div className="grid gap-2">
                                <div className="text-sm font-medium">Min total</div>
                                <Input
                                    inputMode="numeric"
                                    value={String(form.minTotal)}
                                    onChange={(e) => setForm((s) => ({ ...s, minTotal: normalizeMinTotal(e.target.value) }))}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="secondary"
                            onClick={() => setCreateOpen(false)}
                            disabled={createMutation.isPending}
                        >
                            Anuluj
                        </Button>
                        <Button
                            onClick={() => createMutation.mutate(form)}
                            disabled={createMutation.isPending || !form.sku.trim() || !form.name.trim() || !form.unit.trim()}
                        >
                            {createMutation.isPending ? "Zapisywanie…" : "Zapisz"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* EDIT */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edytuj produkt</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-3">
                        <div className="grid gap-2">
                            <div className="text-sm font-medium">SKU</div>
                            <Input
                                value={String(editForm.sku ?? "")}
                                onChange={(e) => setEditForm((s) => ({ ...s, sku: e.target.value }))}
                            />
                        </div>

                        <div className="grid gap-2">
                            <div className="text-sm font-medium">Nazwa</div>
                            <Input
                                value={String(editForm.name ?? "")}
                                onChange={(e) => setEditForm((s) => ({ ...s, name: e.target.value }))}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="grid gap-2">
                                <div className="text-sm font-medium">Jednostka</div>
                                <Input
                                    value={String(editForm.unit ?? "")}
                                    onChange={(e) => setEditForm((s) => ({ ...s, unit: e.target.value }))}
                                />
                            </div>

                            <div className="grid gap-2">
                                <div className="text-sm font-medium">Min total</div>
                                <Input
                                    inputMode="numeric"
                                    value={String(editForm.minTotal ?? 0)}
                                    onChange={(e) => setEditForm((s) => ({ ...s, minTotal: normalizeMinTotal(e.target.value) }))}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setEditOpen(false)} disabled={updateMutation.isPending}>
                            Anuluj
                        </Button>
                        <Button
                            onClick={() => {
                                if (editId == null) return;
                                updateMutation.mutate({ id: editId, req: editForm });
                            }}
                            disabled={updateMutation.isPending || editId == null}
                        >
                            {updateMutation.isPending ? "Zapisywanie…" : "Zapisz"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
