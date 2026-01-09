package org.example.domain.service;

import io.micronaut.transaction.annotation.Transactional;
import jakarta.inject.Singleton;
import org.example.domain.Location;
import org.example.domain.exception.DuplicateSkuException;
import org.example.domain.exception.NotFoundException;
import org.example.persistence.entity.ProductEntity;
import org.example.persistence.entity.StockEntity;
import org.example.persistence.entity.StockId;
import org.example.persistence.repo.ProductRepository;
import org.example.persistence.repo.StockRepository;

import java.time.Instant;
import java.util.Objects;
import java.util.Optional;

@Singleton
public class ProductService {

    private final ProductRepository productRepository;
    private final StockRepository stockRepository;

    public ProductService(ProductRepository productRepository,
                          StockRepository stockRepository) {
        this.productRepository = productRepository;
        this.stockRepository = stockRepository;
    }

    @Transactional
    public ProductEntity create(String sku, String name, String unit, Integer minTotal) {
        requireNonBlank(sku, "sku");
        requireNonBlank(name, "name");
        requireNonBlank(unit, "unit");

        String normalizedSku = sku.trim();
        productRepository.findBySku(normalizedSku).ifPresent(p -> {
            throw new DuplicateSkuException(normalizedSku);
        });

        ProductEntity saved = productRepository.save(new ProductEntity(
                null,
                normalizedSku,
                name.trim(),
                unit.trim(),
                minTotal,
                true,
                null,
                null
        ));

        stockRepository.save(new StockEntity(new StockId(saved.id(), Location.BACKROOM),0, Instant.now()));
        stockRepository.save(new StockEntity(new StockId(saved.id(), Location.SHOPFLOOR), 0, Instant.now()));

        return saved;
    }

    @Transactional
    public ProductEntity update(Long id,
                                Optional<String> sku,
                                Optional<String> name,
                                Optional<String> unit,
                                Optional<Integer> minTotal,
                                Optional<Boolean> active) {

        ProductEntity existing = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found: id=" + id));

        String newSku = sku.map(String::trim).filter(s -> !s.isBlank()).orElse(existing.sku());
        if (!Objects.equals(existing.sku(), newSku)) {
            productRepository.findBySku(newSku).ifPresent(p -> {
                throw new DuplicateSkuException(newSku);
            });
        }

        ProductEntity updated = new ProductEntity(
                existing.id(),
                newSku,
                name.map(String::trim).filter(s -> !s.isBlank()).orElse(existing.name()),
                unit.map(String::trim).filter(s -> !s.isBlank()).orElse(existing.unit()),
                minTotal.orElse(existing.minTotal()),
                active.orElse(existing.active()),
                existing.createdAt(),
                existing.updatedAt()
        );

        return productRepository.update(updated);
    }

    @Transactional
    public ProductEntity deactivate(Long id) {
        ProductEntity existing = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found: id=" + id));

        if (!Boolean.TRUE.equals(existing.active())) {
            return existing;
        }
        ProductEntity updated = new ProductEntity(
                existing.id(),
                existing.sku(),
                existing.name(),
                existing.unit(),
                existing.minTotal(),
                false,
                existing.createdAt(),
                existing.updatedAt()
        );
        return productRepository.update(updated);
    }

    private static void requireNonBlank(String value, String field) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("Field '" + field + "' is required");
        }
    }
}
