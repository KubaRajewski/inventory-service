package org.example.domain.dto;

import org.example.domain.SalesImportStatus;

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

