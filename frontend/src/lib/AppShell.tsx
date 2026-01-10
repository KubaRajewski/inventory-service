import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { Package, Boxes, ArrowLeftRight, Upload, BarChart3, LayoutDashboard } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import React from "react";

const nav = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/products", label: "Produkty", icon: Package },
    { to: "/stocks", label: "Stany", icon: Boxes },
    { to: "/movements", label: "Ruchy", icon: ArrowLeftRight },
    { to: "/sales-import", label: "Import sprzedaży", icon: Upload },
    { to: "/reports", label: "Raporty", icon: BarChart3 },
];

export default function AppShell({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-full bg-muted/40">
            <div className="mx-auto flex min-h-screen max-w-6xl">
                <aside className="hidden w-64 flex-col border-r bg-background p-4 md:flex">
                    <div className="mb-4">
                        <div className="text-lg font-semibold leading-tight">Inventory</div>
                        <div className="text-xs text-muted-foreground">Panel demonstracyjny</div>
                    </div>
                    <Separator className="mb-4" />
                    <nav className="flex flex-col gap-1">
                        {nav.map((n) => {
                            const Icon = n.icon;
                            return (
                                <NavLink
                                    key={n.to}
                                    to={n.to}
                                    className={({ isActive }) =>
                                        [
                                            "flex items-center gap-2 rounded-md px-3 py-2 text-sm",
                                            isActive ? "bg-muted font-medium" : "hover:bg-muted/60",
                                        ].join(" ")
                                    }
                                >
                                    <Icon className="h-4 w-4" />
                                    {n.label}
                                </NavLink>
                            );
                        })}
                    </nav>

                    <div className="mt-auto pt-4 text-xs text-muted-foreground">
                        Backend: localhost:8080
                    </div>
                </aside>

                <main className="flex-1 p-4 md:p-8">{children}</main>
            </div>
        </div>
    );
}
