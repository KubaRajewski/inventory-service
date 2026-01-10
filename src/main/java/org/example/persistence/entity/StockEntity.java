package org.example.persistence.entity;

import io.micronaut.data.annotation.DateUpdated;
import io.micronaut.data.annotation.Id;
import io.micronaut.data.annotation.MappedEntity;
import io.micronaut.data.annotation.MappedProperty;
import io.micronaut.data.model.DataType;
import org.example.domain.Location;

import java.time.Instant;

@MappedEntity("stock")
public record StockEntity(
        @Id
        @MappedProperty("product_id")
        Long productId,

        @Id
        @MappedProperty(value = "location", type = DataType.STRING)
        Location location,

        Integer quantity,

        @DateUpdated
        Instant updatedAt
) {}
