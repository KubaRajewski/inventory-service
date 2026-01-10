package org.example.api.dto;

import io.micronaut.core.annotation.Introspected;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.example.domain.Location;

public final class MovementDtos {

    private MovementDtos() {}

    @Introspected
    public record ReceiptRequest(
            @NotNull Long productId,
            @Positive long quantity,
            Location toLocation,
            String note
    ) {}

    @Introspected
    public record IssueRequest(
            @NotNull Long productId,
            @Positive long quantity,
            Location fromLocation,
            String note
    ) {}

    @Introspected
    public record TransferRequest(
            @NotNull Long productId,
            @Positive long quantity,
            @NotNull Location fromLocation,
            @NotNull Location toLocation,
            String note
    ) {}
}
