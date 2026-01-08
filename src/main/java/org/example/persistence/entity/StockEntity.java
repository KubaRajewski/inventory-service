package org.example.persistence.entity;

import io.micronaut.data.annotation.DateUpdated;
import io.micronaut.data.annotation.EmbeddedId;
import io.micronaut.data.annotation.MappedEntity;

import java.time.Instant;

@MappedEntity("stock")
public record StockEntity(
        @EmbeddedId StockId id,
        Integer quantity,
        @DateUpdated Instant updatedAt
) {}
