package org.example.persistence.entity;

import io.micronaut.data.annotation.DateCreated;
import io.micronaut.data.annotation.GeneratedValue;
import io.micronaut.data.annotation.Id;
import io.micronaut.data.annotation.MappedEntity;
import io.micronaut.data.annotation.MappedProperty;
import io.micronaut.data.model.DataType;
import org.example.domain.SalesImportStatus;

import java.time.Instant;

@MappedEntity("sales_import")
public record SalesImportEntity(
        @Id
        @GeneratedValue
        Long id,

        String sha256,

        @MappedProperty("original_filename")
        String originalFilename,

        @MappedProperty(type = DataType.STRING)
        SalesImportStatus status,

        @MappedProperty("total_lines")
        Integer totalLines,

        @MappedProperty("processed_lines")
        Integer processedLines,

        @DateCreated
        @MappedProperty("created_at")
        Instant createdAt
) {}
