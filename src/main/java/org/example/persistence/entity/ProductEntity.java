package org.example.persistence.entity;

import io.micronaut.data.annotation.DateCreated;
import io.micronaut.data.annotation.DateUpdated;
import io.micronaut.data.annotation.GeneratedValue;
import io.micronaut.data.annotation.Id;
import io.micronaut.data.annotation.MappedEntity;

import java.time.Instant;

@MappedEntity("product")
public record ProductEntity(
        @Id
        @GeneratedValue
        Long id,

        String sku,
        String name,
        String unit,
        Integer minTotal,
        Boolean active,

        @DateCreated Instant createdAt,
        @DateUpdated Instant updatedAt
) {}
