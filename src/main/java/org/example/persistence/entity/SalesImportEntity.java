package org.example.persistence.entity;

import io.micronaut.data.annotation.DateCreated;
import io.micronaut.data.annotation.GeneratedValue;
import io.micronaut.data.annotation.Id;
import io.micronaut.data.annotation.MappedEntity;

import java.time.Instant;

@MappedEntity("sales_import")
public record SalesImportEntity(
        @Id
        @GeneratedValue
        Long id,

        String sha256,
        String originalFilename,
        String status,
        Integer totalLines,
        Integer processedLines,

        @DateCreated Instant createdAt
) {}
