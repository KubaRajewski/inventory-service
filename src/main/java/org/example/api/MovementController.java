package org.example.api;

import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.*;
import io.micronaut.validation.Validated;
import jakarta.validation.Valid;
import org.example.api.dto.MovementDtos.IssueRequest;
import org.example.api.dto.MovementDtos.ReceiptRequest;
import org.example.api.dto.MovementDtos.TransferRequest;
import org.example.domain.service.MovementService;

@Validated
@Controller("/api/movements")
public class MovementController {

    private final MovementService movementService;

    public MovementController(MovementService movementService) {
        this.movementService = movementService;
    }

    @Post("/receipt")
    public HttpResponse<?> receipt(@Body @Valid ReceiptRequest req) {
        movementService.receipt(req.productId(), req.quantity(), req.toLocation(), req.note());
        return HttpResponse.noContent();
    }

    @Post("/issue")
    public HttpResponse<?> issue(@Body @Valid IssueRequest req) {
        movementService.issue(req.productId(), req.quantity(), req.fromLocation(), req.note());
        return HttpResponse.noContent();
    }

    @Post("/transfer")
    public HttpResponse<?> transfer(@Body @Valid TransferRequest req) {
        movementService.transfer(req.productId(), req.quantity(), req.fromLocation(), req.toLocation(), req.note());
        return HttpResponse.noContent();
    }
}
