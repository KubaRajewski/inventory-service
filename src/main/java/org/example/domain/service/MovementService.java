package org.example.domain.service;

import io.micronaut.transaction.annotation.Transactional;
import jakarta.inject.Singleton;
import org.example.domain.Location;
import org.example.domain.MovementType;
import org.example.domain.exception.InsufficientStockException;
import org.example.domain.exception.NotFoundException;
import org.example.persistence.entity.MovementEntity;
import org.example.persistence.entity.ProductEntity;
import org.example.persistence.repo.MovementRepository;
import org.example.persistence.repo.ProductRepository;
import org.example.persistence.repo.StockRepository;

import java.time.Instant;

@Singleton
public class MovementService {

    private final ProductRepository productRepository;
    private final StockRepository stockRepository;
    private final MovementRepository movementRepository;

    public MovementService(ProductRepository productRepository,
                           StockRepository stockRepository,
                           MovementRepository movementRepository) {
        this.productRepository = productRepository;
        this.stockRepository = stockRepository;
        this.movementRepository = movementRepository;
    }

    @Transactional
    public void receipt(Long productId, long qty, Location toLocation, String note) {
        requirePositive(qty);

        ProductEntity product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product not found: id=" + productId));

        Location target = toLocation == null ? Location.BACKROOM : toLocation;

        stockRepository.increaseQuantity(productId, Location.valueOf(target.toString()), qty);

        movementRepository.save(new MovementEntity(
                null,
                product.id(),
                MovementType.RECEIPT,
                qty,
                null,
                target,
                null,
                note
        ));

    }

    @Transactional
    public void issue(Long productId, long qty, Location fromLocation, String note) {
        requirePositive(qty);

        ProductEntity product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product not found: id=" + productId));

        Location source = fromLocation == null ? Location.SHOPFLOOR : fromLocation;

        long changed = stockRepository.decreaseQuantityIfEnough(product.id(), Location.valueOf(String.valueOf(source)), qty);
        if (changed == 0) {
            throw new InsufficientStockException("Not enough quantity to issue");
        }

        movementRepository.save(new MovementEntity(
                null,
                product.id(),
                MovementType.ISSUE,
                qty,
                source,
                null,
                null,
                note
        ));

    }

    @Transactional
    public void transfer(Long productId, long qty, Location from, Location to, String note) {
        requirePositive(qty);

        if (from == null || to == null) {
            throw new IllegalArgumentException("Both 'from' and 'to' locations are required");
        }
        if (from == to) {
            throw new IllegalArgumentException("'from' and 'to' must be different");
        }

        ProductEntity product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product not found: id=" + productId));

        long changed = stockRepository.decreaseQuantityIfEnough(product.id(), Location.valueOf(String.valueOf(from)), qty);
        if (changed == 0) {
            throw new InsufficientStockException("Not enough quantity to transfer");
        }

        stockRepository.increaseQuantity(product.id(), Location.valueOf(String.valueOf(to)), qty);

        movementRepository.save(new MovementEntity(
                null,
                product.id(),
                MovementType.TRANSFER,
                qty,
                from,
                to,
                null,
                note
        ));

    }

    private static void requirePositive(long qty) {
        if (qty <= 0) {
            throw new IllegalArgumentException("Quantity must be > 0");
        }
    }

    private static int safeToInt(long qty) {
        if (qty > Integer.MAX_VALUE) {
            throw new IllegalArgumentException("Quantity exceeds Integer.MAX_VALUE");
        }
        return (int) qty;
    }
}
