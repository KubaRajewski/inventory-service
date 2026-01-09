package org.example.persistence.entity;

import io.micronaut.data.annotation.DateCreated;
import io.micronaut.data.annotation.GeneratedValue;
import io.micronaut.data.annotation.Id;
import io.micronaut.data.annotation.MappedEntity;
import org.example.domain.Location;
import org.example.domain.MovementType;

import java.time.Instant;

@MappedEntity("movement")
public record MovementEntity(
        @Id
        @GeneratedValue
        Long id,

        Long productId,
        MovementType type,
        Long quantity,

        Location fromLocation,
        Location toLocation,

        @DateCreated Instant occurredAt,
        String note
) {
}
