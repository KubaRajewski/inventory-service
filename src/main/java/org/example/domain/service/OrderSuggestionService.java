package org.example.domain.service;

import jakarta.inject.Singleton;
import org.example.domain.dto.OrderSuggestionRow;
import org.example.domain.dto.StockView;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;

@Singleton
public class OrderSuggestionService {

    private final StockService stockService;

    public OrderSuggestionService(StockService stockService) {
        this.stockService = stockService;
    }

    public List<OrderSuggestionRow> suggest(Optional<String> query) {
        List<StockView> views = stockService.getStocksView(query);

        return views.stream()
                .map(v -> {
                    int min = v.minTotal();
                    long suggested = Math.max(0, (long) min - v.totalQty());
                    return new OrderSuggestionRow(
                            v.productId(),
                            v.sku(),
                            v.name(),
                            v.minTotal(),
                            v.backroomQty(),
                            v.shopfloorQty(),
                            v.totalQty(),
                            suggested
                    );
                })
                .toList();
    }

    public byte[] exportLowToCsv(Optional<String> query) {
        List<StockView> views = stockService.getStocksView(query);

        StringBuilder sb = new StringBuilder();
        sb.append("sku,name,minTotal,backroomQty,shopfloorQty,totalQty,suggestedQty\n");

        for (StockView v : views) {
            if (!v.low()) continue;
            int min = v.minTotal();
            long suggested = Math.max(0, (long) min - v.totalQty());

            sb.append(escape(v.sku())).append(',')
                    .append(escape(v.name())).append(',')
                    .append(min).append(',')
                    .append(v.backroomQty()).append(',')
                    .append(v.shopfloorQty()).append(',')
                    .append(v.totalQty()).append(',')
                    .append(suggested)
                    .append('\n');
        }

        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    private static String escape(String s) {
        if (s == null) return "";
        String t = s.replace("\"", "\"\"");
        if (t.contains(",") || t.contains("\"") || t.contains("\n") || t.contains("\r")) {
            return "\"" + t + "\"";
        }
        return t;
    }
}
