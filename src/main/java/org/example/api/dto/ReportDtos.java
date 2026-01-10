package org.example.api.dto;

import io.micronaut.core.annotation.Introspected;
import io.micronaut.serde.annotation.Serdeable;

public final class ReportDtos {

    private ReportDtos() {}

    @Serdeable
    @Introspected
    public record TopSalesRow(
            Long productId,
            String sku,
            String name,
            long quantitySold
    ) {}
}
