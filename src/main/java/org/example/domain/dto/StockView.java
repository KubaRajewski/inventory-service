package org.example.domain.dto;

import org.example.domain.Location;

public record StockView(
        Long productId,
        String sku,
        String name,
        String unit, int minTotal,
        int backroomQty,
        int shopfloorQty,
        int totalQty,
        boolean low
) {
    public int qty(Location location) {
        return location == Location.BACKROOM ? backroomQty : shopfloorQty;
    }
}
