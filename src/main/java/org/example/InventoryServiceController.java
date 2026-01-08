package org.example;

import io.micronaut.http.annotation.*;

@Controller("/inventory-service")
public class InventoryServiceController {

    @Get(uri = "/", produces = "text/plain")
    public String index() {
        return "Example Response";
    }
}