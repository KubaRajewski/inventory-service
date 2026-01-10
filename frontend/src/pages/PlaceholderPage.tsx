import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

export default function PlaceholderPage({ title }: { title: string }) {
    return (
        <div className="space-y-6">
            <div>
                <div className="text-2xl font-semibold">{title}</div>
                <div className="text-sm text-muted-foreground">Do zrobienia w kolejnym kroku.</div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Wersja demo</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    Ten ekran podłączymy do backendu jako następny.
                </CardContent>
            </Card>
        </div>
    );
}
