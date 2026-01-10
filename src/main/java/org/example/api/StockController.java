package org.example.api;

import io.micronaut.http.annotation.*;
import org.example.domain.dto.StockView;
import org.example.domain.service.StockService;

import java.util.List;
import java.util.Optional;

@Controller("/api/stocks")
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @Get
    public List<StockView> list(@QueryValue Optional<String> query) {
        return stockService.getStocksView(query);
    }

    @Get("/low")
    public List<StockView> low(@QueryValue Optional<String> query) {
        return stockService.getStocksView(query).stream()
                .filter(StockView::low)
                .toList();
    }
}
