package org.example.domain.service;

import io.micronaut.transaction.annotation.Transactional;
import jakarta.inject.Singleton;
import org.example.domain.Location;
import org.example.domain.MovementType;
import org.example.domain.SalesImportStatus;
import org.example.domain.dto.SalesImportResult;
import org.example.domain.exception.NotFoundException;
import org.example.persistence.entity.MovementEntity;
import org.example.persistence.entity.ProductEntity;
import org.example.persistence.entity.SalesImportEntity;
import org.example.persistence.repo.MovementRepository;
import org.example.persistence.repo.ProductRepository;
import org.example.persistence.repo.SalesImportRepository;
import org.example.persistence.repo.StockRepository;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.*;

@Singleton
public class SalesImportService {

    private final ProductRepository productRepository;
    private final StockRepository stockRepository;
    private final MovementRepository movementRepository;
    private final SalesImportRepository salesImportRepository;

    public SalesImportService(ProductRepository productRepository,
                              StockRepository stockRepository,
                              MovementRepository movementRepository,
                              SalesImportRepository salesImportRepository) {
        this.productRepository = productRepository;
        this.stockRepository = stockRepository;
        this.movementRepository = movementRepository;
        this.salesImportRepository = salesImportRepository;
    }

    @Transactional
    public SalesImportResult importCsv(byte[] fileBytes, String originalFilename) {
        if (fileBytes == null || fileBytes.length == 0) {
            throw new IllegalArgumentException("CSV file is empty");
        }

        String sha = sha256Hex(fileBytes);
        Optional<SalesImportEntity> existing = salesImportRepository.findBySha256(sha);
        if (existing.isPresent()) {
            SalesImportEntity e = existing.get();
            return new SalesImportResult(
                    SalesImportStatus.SKIPPED_DUPLICATE,
                    e.rowsRead(),
                    e.rowsValid(),
                    e.rowsUnknownSku(),
                    e.movementsCreated(),
                    e.totalQuantityRequested(),
                    e.totalQuantityApplied(),
                    e.sha256()
            );
        }

        ParsedCsv parsed = parseCsv(new String(fileBytes, StandardCharsets.UTF_8));

        int rowsRead = parsed.rowsRead;
        int rowsValid = parsed.rowsValid;
        long totalQtyRequested = parsed.totalQuantityRequested;

        int unknownSkuCount = 0;
        int movementsCreated = 0;
        long totalQtyApplied = 0;

        try {
            for (Map.Entry<String, Long> entry : parsed.qtyBySku.entrySet()) {
                String sku = entry.getKey();
                long qty = entry.getValue();

                ProductEntity product = productRepository.findBySku(sku)
                        .orElse(null);

                if (product == null) {
                    unknownSkuCount++;
                    continue;
                }

                long remaining = qty;

                long takenFromShopfloor = takeWithRetry(product.id(), Location.SHOPFLOOR, remaining);
                if (takenFromShopfloor > 0) {
                    remaining -= takenFromShopfloor;
                    totalQtyApplied += takenFromShopfloor;
                    movementsCreated++;
                    movementRepository.save(new MovementEntity(
                            null,
                            product.id(),
                            MovementType.SALE_IMPORT,
                            takenFromShopfloor,
                            Location.SHOPFLOOR,
                            null,
                            Instant.now(),
                            "sale import: " + safeFilename(originalFilename)
                    ));
                }

                if (remaining > 0) {
                    long takenFromBackroom = takeWithRetry(product.id(), Location.BACKROOM, remaining);
                    if (takenFromBackroom > 0) {
                        remaining -= takenFromBackroom;
                        totalQtyApplied += takenFromBackroom;
                        movementsCreated++;
                        movementRepository.save(new MovementEntity(
                                null,
                                product.id(),
                                MovementType.SALE_IMPORT,
                                takenFromBackroom,
                                Location.BACKROOM,
                                null,
                                Instant.now(),
                                "sale import: " + safeFilename(originalFilename)
                        ));
                    }
                }
            }

            SalesImportEntity saved = salesImportRepository.save(new SalesImportEntity(
                    null,
                    sha,
                    SalesImportStatus.SUCCESS,
                    rowsRead,
                    rowsValid,
                    unknownSkuCount,
                    movementsCreated,
                    totalQtyRequested,
                    totalQtyApplied,
                    Instant.now()
            ));

            return new SalesImportResult(
                    saved.status(),
                    saved.rowsRead(),
                    saved.rowsValid(),
                    saved.rowsUnknownSku(),
                    saved.movementsCreated(),
                    saved.totalQuantityRequested(),
                    saved.totalQuantityApplied(),
                    saved.sha256()
            );

        } catch (RuntimeException ex) {
            salesImportRepository.save(new SalesImportEntity(
                    null,
                    sha,
                    SalesImportStatus.FAILED,
                    rowsRead,
                    rowsValid,
                    unknownSkuCount,
                    movementsCreated,
                    totalQtyRequested,
                    totalQtyApplied,
                    Instant.now()
            ));
            throw ex;
        }
    }

    private long takeWithRetry(Long productId, Location location, long qty) {
        if (qty <= 0) return 0;

        for (int i = 0; i < 3; i++) {
            Long current = Long.valueOf(stockRepository.findByIdProductIdAndIdLocation(productId, location)
                    .map(s -> s.quantity())
                    .orElse(0));

            if (current <= 0) {
                return 0;
            }

            long toTake = Math.min(current, qty);
            long changed = stockRepository.decreaseQuantityIfEnough(productId, location, toTake);
            if (changed > 0) {
                return toTake;
            }
        }

        Long current = Long.valueOf(stockRepository.findByIdProductIdAndIdLocation(productId, location)
                .map(s -> s.quantity())
                .orElse(0));

        if (current <= 0) {
            return 0;
        }

        long toTake = Math.min(current, qty);
        long changed = stockRepository.decreaseQuantityIfEnough(productId, location, toTake);
        return changed > 0 ? toTake : 0;
    }

    private static ParsedCsv parseCsv(String text) {
        String[] lines = text.split("\\R");
        Map<String, Long> qtyBySku = new LinkedHashMap<>();

        int rowsRead = 0;
        int rowsValid = 0;
        long totalQtyRequested = 0;

        for (String rawLine : lines) {
            String line = rawLine == null ? "" : rawLine.trim();
            if (line.isBlank()) continue;

            rowsRead++;

            String[] parts = line.split("[,;]");
            if (parts.length < 2) {
                continue;
            }

            String sku = parts[0].trim();
            String qtyStr = parts[1].trim();

            if (sku.equalsIgnoreCase("sku") || qtyStr.equalsIgnoreCase("quantity")) {
                continue;
            }

            if (sku.isBlank()) {
                continue;
            }

            long qty;
            try {
                qty = Long.parseLong(qtyStr);
            } catch (NumberFormatException ex) {
                continue;
            }

            if (qty <= 0) {
                continue;
            }

            rowsValid++;
            totalQtyRequested += qty;
            qtyBySku.merge(sku, qty, Long::sum);
        }

        return new ParsedCsv(qtyBySku, rowsRead, rowsValid, totalQtyRequested);
    }

    private static String sha256Hex(byte[] bytes) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(bytes);
            StringBuilder sb = new StringBuilder(digest.length * 2);
            for (byte b : digest) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception ex) {
            throw new RuntimeException("Unable to calculate sha256", ex);
        }
    }

    private static String safeFilename(String name) {
        if (name == null || name.isBlank()) return "unknown.csv";
        return name.replaceAll("[\\r\\n\\t]", " ").trim();
    }

    private record ParsedCsv(
            Map<String, Long> qtyBySku,
            int rowsRead,
            int rowsValid,
            long totalQuantityRequested
    ) {
    }
}
