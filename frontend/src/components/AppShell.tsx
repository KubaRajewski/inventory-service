import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    Boxes,
    ArrowLeftRight,
    Upload,
    BarChart3,
    Settings,
    Bell,
    Search,
    ShoppingCart,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const nav = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/products", label: "Produkty", icon: Package },
    { to: "/stocks", label: "Stany", icon: Boxes },
    { to: "/movements", label: "Ruchy", icon: ArrowLeftRight },
    { to: "/sales-import", label: "Import", icon: Upload },
    { to: "/order-suggestions", label: "Zamówienie", icon: ShoppingCart },
    { to: "/reports", label: "Raporty", icon: BarChart3 },
    { to: "/settings", label: "Ustawienia", icon: Settings },
];

export default function AppShell({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-muted/40">
            <div className="mx-auto flex min-h-screen max-w-6xl">
                <aside className="hidden w-72 flex-col border-r bg-background p-4 md:flex">
                    <div className="mb-4">
                        <div className="text-lg font-semibold leading-tight">Inventory Suite</div>
                        <div className="text-xs text-muted-foreground">Retail stock & movements</div>
                    </div>

                    <div className="relative mb-3">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-9" placeholder="Global search (UI only)..." disabled />
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
                                            "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition",
                                            isActive ? "bg-muted font-medium" : "hover:bg-muted/60",
                                        ].join(" ")
                                    }
                                    end={n.to === "/"}
                                >
                                    <Icon className="h-4 w-4" />
                                    {n.label}
                                </NavLink>
                            );
                        })}
                    </nav>

                    <div className="mt-auto pt-4">
                        <Separator className="mb-4" />
                        <div className="flex items-center justify-between">
                            <div className="text-xs text-muted-foreground">Backend: localhost:8080</div>
                            <div className="flex gap-2">
                                <Button size="icon" variant="ghost" aria-label="Notifications" disabled>
                                    <Bell className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </aside>

                <main className="flex-1 p-4 md:p-8">{children}</main>
            </div>
        </div>
    );
}
