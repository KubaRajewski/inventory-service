package org.example.api;

import io.micronaut.http.HttpHeaders;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.*;
import org.example.domain.dto.OrderSuggestionRow;
import org.example.domain.service.OrderSuggestionService;

import java.util.List;
import java.util.Optional;

@Controller("/api/order-suggestions")
public class OrderSuggestionController {

    private final OrderSuggestionService orderSuggestionService;

    public OrderSuggestionController(OrderSuggestionService orderSuggestionService) {
        this.orderSuggestionService = orderSuggestionService;
    }

    @Get
    public List<OrderSuggestionRow> list(@QueryValue Optional<String> query) {
        return orderSuggestionService.suggest(query);
    }

    @Get("/export")
    public HttpResponse<byte[]> export(@QueryValue Optional<String> query) {
        byte[] csv = orderSuggestionService.exportLowToCsv(query);
        return HttpResponse.ok(csv)
                .contentType(new MediaType("text/csv"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"order_suggestions.csv\"");
    }
}
