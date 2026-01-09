package org.example.domain.service;

import jakarta.inject.Singleton;
import org.example.domain.Location;
import org.example.domain.dto.StockView;
import org.example.persistence.entity.ProductEntity;
import org.example.persistence.entity.StockEntity;
import org.example.persistence.repo.ProductRepository;
import org.example.persistence.repo.StockRepository;

import java.util.*;
import java.util.stream.Collectors;

@Singleton
public class StockService {

    private final ProductRepository productRepository;
    private final StockRepository stockRepository;

    public StockService(ProductRepository productRepository,
                        StockRepository stockRepository) {
        this.productRepository = productRepository;
        this.stockRepository = stockRepository;
    }

    public List<StockView> getStocksView(Optional<String> query) {
        List<ProductEntity> products = query
                .map(String::trim)
                .filter(q -> !q.isBlank())
                .map(productRepository::search)
                .orElseGet(productRepository::listActive);

        if (products.isEmpty()) {
            return List.of();
        }

        List<Long> productIds = products.stream().map(ProductEntity::id).toList();
        List<StockEntity> stocks = stockRepository.findByIdProductIdIn(productIds);

        Map<Long, Map<Location, Long>> qtyByProduct = new HashMap<>();
        for (StockEntity s : stocks) {
            qtyByProduct
                    .computeIfAbsent(s.id().productId(), k -> new EnumMap<>(Location.class))
                    .put(s.id().location(), Long.valueOf(s.quantity()));
        }

        return products.stream()
                .map(p -> {
                    long backroom = qtyByProduct.getOrDefault(p.id(), Map.of()).getOrDefault(Location.BACKROOM, 0L);
                    long shopfloor = qtyByProduct.getOrDefault(p.id(), Map.of()).getOrDefault(Location.SHOPFLOOR, 0L);
                    long total = backroom + shopfloor;
                    int min = p.minTotal() == null ? 0 : p.minTotal();
                    boolean low = total < min;

                    return new StockView(
                            p.id(),
                            p.sku(),
                            p.name(),
                            p.unit(),
                            p.minTotal(),
                            (int) backroom,
                            (int) shopfloor,
                            (int) total,
                            low
                    );
                })
                .collect(Collectors.toList());
    }
}
