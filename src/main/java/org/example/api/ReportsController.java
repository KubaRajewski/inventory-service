package org.example.api;

import io.micronaut.http.annotation.*;
import org.example.api.dto.ReportDtos.TopSalesRow;
import org.example.domain.MovementType;
import org.example.persistence.entity.MovementEntity;
import org.example.persistence.entity.ProductEntity;
import org.example.persistence.repo.MovementRepository;
import org.example.persistence.repo.ProductRepository;

import java.util.*;

@Controller("/api/reports")
public class ReportsController {

    private final MovementRepository movementRepository;
    private final ProductRepository productRepository;

    public ReportsController(MovementRepository movementRepository,
                             ProductRepository productRepository) {
        this.movementRepository = movementRepository;
        this.productRepository = productRepository;
    }

    @Get("/top-sales")
    public List<TopSalesRow> topSales(@QueryValue Optional<Integer> limit) {
        int lim = limit.orElse(10);

        Iterable<MovementEntity> all = movementRepository.findAll();
        Map<Long, Long> soldByProduct = new HashMap<>();

        for (MovementEntity m : all) {
            if (m.type() != MovementType.SALE_IMPORT) continue;
            if (m.productId() == null || m.quantity() == null) continue;
            soldByProduct.merge(m.productId(), m.quantity(), Long::sum);
        }

        List<Map.Entry<Long, Long>> sorted = soldByProduct.entrySet().stream()
                .sorted((a, b) -> Long.compare(b.getValue(), a.getValue()))
                .limit(lim)
                .toList();

        List<TopSalesRow> result = new ArrayList<>();
        for (Map.Entry<Long, Long> e : sorted) {
            Long productId = e.getKey();
            long qty = e.getValue();

            ProductEntity p = productRepository.findById(productId).orElse(null);
            result.add(new TopSalesRow(
                    productId,
                    p != null ? p.sku() : null,
                    p != null ? p.name() : null,
                    qty
            ));
        }
        return result;
    }
}
