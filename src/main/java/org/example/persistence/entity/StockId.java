package org.example.persistence.entity;

import io.micronaut.core.annotation.Introspected;
import org.example.domain.Location;

import java.io.Serializable;

@Introspected
public record StockId(
        Long productId,
        Location location
) implements Serializable {}
