package org.example.api.dto;

import io.micronaut.core.annotation.Introspected;

public final class ReportDtos {

    private ReportDtos() {}

    @Introspected
    public record TopSalesRow(
            Long productId,
            String sku,
            String name,
            long quantitySold
    ) {}
}
