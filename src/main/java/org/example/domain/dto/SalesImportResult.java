package org.example.domain.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record SalesImportResult(
        Long importId,
        String status,
        int totalLines,
        int processedLines,
        int missingSkus,
        int processedSkus,
        long totalQuantityRequested,
        long totalQuantityApplied,
        String fileSha256
) {}
