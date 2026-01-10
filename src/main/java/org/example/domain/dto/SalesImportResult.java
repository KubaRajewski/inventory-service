package org.example.domain.dto;

import io.micronaut.serde.annotation.Serdeable;
import org.example.domain.SalesImportStatus;

@Serdeable
public record SalesImportResult(
        SalesImportStatus status,
        int rowsRead,
        int rowsValid,
        int rowsUnknownSku,
        int movementsCreated,
        long totalQuantityRequested,
        long totalQuantityApplied,
        String sha256
) {
}

