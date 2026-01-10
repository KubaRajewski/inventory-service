import PageTitle from "@/components/PageTitle";
import ComingSoonCard from "@/components/ComingSoonCard";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <PageTitle title="Ustawienia" subtitle="Sekcja pod role, konfiguracje i alerty (UI-only)." />

            <div className="grid gap-4 lg:grid-cols-3">
                <ComingSoonCard
                    title="Role użytkowników"
                    description="Admin / Manager / Viewer, ograniczenia endpointów, audyt zmian."
                />
                <ComingSoonCard
                    title="Alerting"
                    description="Progi low-stock, kanały powiadomień, harmonogramy raportów."
                />
                <ComingSoonCard
                    title="Integracje"
                    description="POS CSV, webhooki, eksporty do ERP (miejsce pod rozbudowę)."
                />
            </div>
        </div>
    );
}
