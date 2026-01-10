package org.example.domain.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record OrderSuggestionRow(
        Long productId,
        String sku,
        String name,
        Integer minTotal,
        long backroomQty,
        long shopfloorQty,
        long totalQty,
        long suggestedQty
) {
}

