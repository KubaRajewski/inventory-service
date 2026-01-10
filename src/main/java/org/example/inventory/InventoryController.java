package org.example.inventory;

import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.*;
import jakarta.inject.Inject;
import pl.example.inventory.application.InventoryService;
import pl.example.inventory.api.dto.PerformInventoryRequest;
import pl.example.inventory.api.dto.InventoryResultView;

@Controller("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    @Inject
    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @Post
    public HttpResponse<InventoryResultView> performInventory(
            @Body PerformInventoryRequest request
    ) {
        InventoryResultView result = inventoryService.performInventory(request);
        return HttpResponse.ok(result);
    }
}