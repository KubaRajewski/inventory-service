package org.example.persistence.entity;

import io.micronaut.data.annotation.DateCreated;
import io.micronaut.data.annotation.GeneratedValue;
import io.micronaut.data.annotation.Id;
import io.micronaut.data.annotation.MappedEntity;
import org.example.domain.SalesImportStatus;

import java.time.Instant;

@MappedEntity("sales_import")
public record SalesImportEntity(
        @Id
        @GeneratedValue
        Long id,

        String sha256,
        SalesImportStatus status,

        Integer rowsRead,
        Integer rowsValid,
        Integer rowsUnknownSku,
        Integer movementsCreated,

        Long totalQuantityRequested,
        Long totalQuantityApplied,

        @DateCreated Instant createdAt
) {
}
