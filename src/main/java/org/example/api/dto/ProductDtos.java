package org.example.api.dto;

import io.micronaut.core.annotation.Introspected;
import io.micronaut.serde.annotation.Serdeable;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Optional;

public final class ProductDtos {

    private ProductDtos() {}

    @Serdeable
    @Introspected
    public record CreateProductRequest(
            @NotBlank String sku,
            @NotBlank String name,
            @NotBlank String unit,
            @NotNull @Min(0) Integer minTotal
    ) {}

    @Serdeable
    @Introspected
    public record UpdateProductRequest(
            Optional<String> sku,
            Optional<String> name,
            Optional<String> unit,
            Optional<@Min(0) Integer> minTotal,
            Optional<Boolean> active
    ) {}

    @Serdeable
    @Introspected
    public record ProductResponse(
            Long id,
            String sku,
            String name,
            String unit,
            Integer minTotal,
            Boolean active
    ) {}
}
