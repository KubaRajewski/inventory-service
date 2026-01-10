import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PageTitle from "@/components/PageTitle";
import { SalesImportApi, SalesImportResult, errorMessage } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function SalesImportPage() {
    const { toast } = useToast();
    const qc = useQueryClient();

    const [file, setFile] = useState<File | null>(null);
    const [result, setResult] = useState<SalesImportResult | null>(null);

    const upload = useMutation({
        mutationFn: (f: File) => SalesImportApi.uploadCsv(f),
        onSuccess: async (r) => {
            setResult(r);
            await qc.invalidateQueries({ queryKey: ["stocks"] });
            await qc.invalidateQueries({ queryKey: ["movements"] });
            toast({ title: "OK", description: "Import zakończony." });
        },
        onError: (e) => toast({ title: "Błąd importu", description: errorMessage(e), variant: "destructive" }),
    });

    return (
        <div className="space-y-6">
            <PageTitle
                title="Import sprzedaży"
                subtitle="Wrzucasz CSV, system zdejmie ilości ze stanów i zapisze ruchy SALE_IMPORT."
            />

            <div className="grid gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Upload CSV</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Input type="file" accept=".csv,text/csv" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />

                        <div className="text-xs text-muted-foreground">
                            Format: SKU,quantity (separator , lub ;)
                        </div>

                        <Button disabled={!file || upload.isPending} onClick={() => file && upload.mutate(file)}>
                            {upload.isPending ? "Wysyłanie…" : "Uruchom import"}
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Szablony</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        <div>• demo_sales.csv</div>
                        <div>• vendor_export.csv</div>
                        <div className="mt-3 rounded-md border p-3 text-xs">
                            SKU-0001,2<br />
                            SKU-0002,5<br />
                            SKU-001,1
                        </div>
                    </CardContent>
                </Card>
            </div>

            {result ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Wynik</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2 text-sm">
                        <div className="flex items-center gap-2">
                            <div>Status:</div>
                            <Badge variant={result.status?.toUpperCase().includes("FAIL") ? "destructive" : "secondary"}>
                                {result.status}
                            </Badge>
                        </div>
                        <div>rowsRead: {result.rowsRead}</div>
                        <div>rowsValid: {result.rowsValid}</div>
                        <div>rowsUnknownSku: {result.rowsUnknownSku}</div>
                        <div>movementsCreated: {result.movementsCreated}</div>
                        <div>totalQuantityRequested: {result.totalQuantityRequested}</div>
                        <div>totalQuantityApplied: {result.totalQuantityApplied}</div>
                        <div className="text-xs text-muted-foreground">sha256: {result.sha256}</div>
                    </CardContent>
                </Card>
            ) : null}
        </div>
    );
}
