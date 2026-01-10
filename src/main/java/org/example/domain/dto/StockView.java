package org.example.domain.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record StockView(
        Long productId,
        String sku,
        String name,
        String unit,
        Integer minTotal,
        Integer backroomQty,
        Integer shopfloorQty,
        Integer totalQty,
        boolean low
) {}
