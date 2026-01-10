package org.example.persistence.entity;

import io.micronaut.data.annotation.DateCreated;
import io.micronaut.data.annotation.GeneratedValue;
import io.micronaut.data.annotation.Id;
import io.micronaut.data.annotation.MappedEntity;
import io.micronaut.data.annotation.MappedProperty;
import io.micronaut.data.model.DataType;
import org.example.domain.Location;
import org.example.domain.MovementType;

import java.time.Instant;

@MappedEntity("movement")
public record MovementEntity(
        @Id
        @GeneratedValue
        Long id,

        @MappedProperty("product_id")
        Long productId,

        @MappedProperty(type = DataType.STRING)
        MovementType type,

        Integer quantity,

        @MappedProperty(value = "from_location", type = DataType.STRING)
        Location fromLocation,

        @MappedProperty(value = "to_location", type = DataType.STRING)
        Location toLocation,

        @DateCreated
        @MappedProperty("occurred_at")
        Instant occurredAt,

        String note,

        @MappedProperty("sales_import_id")
        Long salesImportId
) {}
