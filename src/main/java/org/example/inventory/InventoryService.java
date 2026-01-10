package org.example.inventory;

import jakarta.inject.Singleton;
import org.example.persistence.repo.StockRepository;

import java.util.Objects;

@Singleton
public class InventoryService {

    private final StockRepository stockRepository;

    public InventoryService(StockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    public InventoryResultView performInventory(PerformInventoryRequest request) {
        int totalPositions = 0;
        int positionsWithDifference = 0;
        int totalPositiveDifference = 0;
        int totalNegativeDifference = 0;

        for (InventoryLine line : request.lines()) {
            totalPositions++;

            Stock stock = stockRepository.findBySku(line.sku())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Unknown SKU in inventory: " + line.sku()
                    ));

            int difference = line.countedQuantity() - line.systemQuantity();

            if (difference != 0) {
                positionsWithDifference++;
                if (difference > 0) {
                    totalPositiveDifference += difference;
                } else {
                    totalNegativeDifference += Math.abs(difference);
                }

                stock.adjustQuantity(difference, "Inventory adjustment");
                stockRepository.save(stock);
            }
        }

        return new InventoryResultView(
                totalPositions,
                positionsWithDifference,
                totalPositiveDifference,
                totalNegativeDifference
        );
    }
}