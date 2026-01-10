package org.example.inventory;

import java.time.LocalDateTime;
import java.util.List;

public record InventoryLine(
        String sku,
        int systemQuantity,
        int countedQuantity
) { }

public record PerformInventoryRequest(
        List<InventoryLine> lines,
        String performedBy,
        LocalDateTime performedAt
) { }

public record InventoryResultView(
        int totalPositions,
        int positionsWithDifference,
        int totalPositiveDifference,
        int totalNegativeDifference
) { }