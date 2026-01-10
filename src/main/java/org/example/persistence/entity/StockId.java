package org.example.persistence.entity;

import io.micronaut.core.annotation.Introspected;
import io.micronaut.data.annotation.Embeddable;
import io.micronaut.data.annotation.MappedProperty;
import io.micronaut.data.model.DataType;
import org.example.domain.Location;

import java.io.Serializable;

@Embeddable
@Introspected
public record StockId(
        @MappedProperty("product_id")
        Long productId,

        @MappedProperty(value = "location", type = DataType.STRING)
        Location location
) implements Serializable {}
