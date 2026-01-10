import axios, { AxiosError } from "axios";

export const api = axios.create({
    baseURL: "/api",
});

// ========== TYPES ==========
export type Product = {
    id: number;
    sku: string;
    name: string;
    unit: string;
    minTotal: number;
    active: boolean;
};

export type CreateProductRequest = {
    sku: string;
    name: string;
    unit: string;
    minTotal: number;
};

export type UpdateProductRequest = Partial<CreateProductRequest> & {
    active?: boolean;
};

export type StockView = {
    productId: number;
    sku: string;
    name: string;
    unit: string;
    minTotal: number;
    backroomQty: number;
    shopfloorQty: number;
    totalQty: number;
    low: boolean;
};

export type Location = "BACKROOM" | "SHOPFLOOR";
export type MovementType = "RECEIPT" | "ISSUE" | "TRANSFER" | "SALE_IMPORT";

export type Movement = {
    id: number;
    productId: number;
    type: MovementType;
    quantity: number;
    fromLocation?: Location | null;
    toLocation?: Location | null;
    occurredAt: string;
    note?: string | null;
};

export type SalesImportResult = {
    status: string;
    rowsRead: number;
    rowsValid: number;
    rowsUnknownSku: number;
    movementsCreated: number;
    totalQuantityRequested: number;
    totalQuantityApplied: number;
    sha256: string;
};

// ========== HELPERS ==========
export function errorMessage(e: unknown): string {
    if (axios.isAxiosError(e)) {
        const ae = e as AxiosError<any>;
        const msg =
            ae.response?.data?.message ||
            ae.response?.data?.error ||
            ae.message ||
            "Request failed";
        return typeof msg === "string" ? msg : "Request failed";
    }
    if (e instanceof Error) return e.message;
    return "Unknown error";
}

async function tryGet<T>(paths: string[], config?: any): Promise<T> {
    let last: any = null;
    for (const p of paths) {
        try {
            const res = await api.get<T>(p, config);
            return res.data;
        } catch (e: any) {
            last = e;
            if (axios.isAxiosError(e) && e.response?.status === 404) continue;
            throw e;
        }
    }
    throw last ?? new Error("No endpoint matched");
}

async function tryPost<T>(paths: string[], body: any, config?: any): Promise<T> {
    let last: any = null;
    for (const p of paths) {
        try {
            const res = await api.post<T>(p, body, config);
            return res.data;
        } catch (e: any) {
            last = e;
            if (axios.isAxiosError(e) && e.response?.status === 404) continue;
            throw e;
        }
    }
    throw last ?? new Error("No endpoint matched");
}

export function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

// ========== REAL (WORKING) ENDPOINTS ==========
export const ProductsApi = {
    list: (q?: string) =>
        tryGet<Product[]>(["/products"], { params: q ? { query: q } : undefined }),
    create: (req: CreateProductRequest) =>
        api.post<Product>("/products", req).then((r) => r.data),
    update: (id: number, req: UpdateProductRequest) =>
        api.patch<Product>(`/products/${id}`, req).then((r) => r.data),
};

export const StocksApi = {
    list: (q?: string) =>
        tryGet<StockView[]>(["/stocks"], { params: q ? { query: q } : undefined }),
    low: (q?: string) =>
        tryGet<StockView[]>(["/stocks/low"], { params: q ? { query: q } : undefined }),
};

export const MovementsApi = {
    list: (productId?: number) =>
        tryGet<Movement[]>(["/movements", "/movement"], {
            params: productId ? { productId } : undefined,
        }),

    receipt: (body: { productId: number; qty: number; toLocation?: Location; note?: string }) =>
        tryPost<void>(["/movements/receipt", "/movement/receipt"], body),

    issue: (body: { productId: number; qty: number; fromLocation?: Location; note?: string }) =>
        tryPost<void>(["/movements/issue", "/movement/issue"], body),

    transfer: (body: { productId: number; qty: number; from: Location; to: Location; note?: string }) =>
        tryPost<void>(["/movements/transfer", "/movement/transfer"], body),
};

export const SalesImportApi = {
    uploadCsv: async (file: File) => {
        const form = new FormData();
        form.append("file", file);

        return await tryPost<SalesImportResult>(
            ["/sales-imports", "/sales-import", "/sales-imports/upload", "/sales-import/upload"],
            form,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
    },
};

// ========== “WOW” FEATURES (PLACEHOLDERS) ==========
export const AnalyticsApi = {
    kpis: async () => {
        // fake KPI for demo look; no backend dependency
        return {
            abcA: 12,
            abcB: 23,
            abcC: 51,
            rotationTop: ["Milk 1L", "Rice 1kg", "Pasta 500g"],
            staleTop: ["Olive oil 1L", "Tea 100 bags"],
        };
    },
};

export const OrderSuggestionsApi = {
    list: () => tryGet<any[]>(["/order-suggestions", "/order-suggestion", "/orders/suggestions"]),
    exportCsv: async () => {
        const res = await api.get("/order-suggestions/export", {
            responseType: "blob",
            validateStatus: () => true,
        });
        if (res.status === 404) {
            const res2 = await api.get("/order-suggestion/export", { responseType: "blob" });
            return res2.data as Blob;
        }
        if (res.status >= 200 && res.status < 300) return res.data as Blob;
        throw new Error("Export failed");
    },
};
