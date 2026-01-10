package org.example.api;

import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.*;
import io.micronaut.validation.Validated;
import jakarta.validation.Valid;
import org.example.api.dto.ProductDtos.CreateProductRequest;
import org.example.api.dto.ProductDtos.ProductResponse;
import org.example.api.dto.ProductDtos.UpdateProductRequest;
import org.example.domain.service.ProductService;
import org.example.persistence.entity.ProductEntity;
import org.example.persistence.repo.ProductRepository;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@Validated
@Controller("/api/products")
public class ProductController {

    private final ProductService productService;
    private final ProductRepository productRepository;

    public ProductController(ProductService productService,
                             ProductRepository productRepository) {
        this.productService = productService;
        this.productRepository = productRepository;
    }

    @Post
    public HttpResponse<ProductResponse> create(@Body @Valid CreateProductRequest req) {
        ProductEntity created = productService.create(req.sku(), req.name(), req.unit(), req.minTotal());
        return HttpResponse.created(toResponse(created))
                .headers(h -> h.location(URI.create("/api/products/" + created.id())));
    }

    @Put("/{id}")
    public ProductResponse update(@PathVariable Long id, @Body @Valid UpdateProductRequest req) {
        ProductEntity updated = productService.update(
                id,
                req.sku(),
                req.name(),
                req.unit(),
                req.minTotal(),
                req.active()
        );
        return toResponse(updated);
    }

    @Post("/{id}/deactivate")
    public ProductResponse deactivate(@PathVariable Long id) {
        ProductEntity updated = productService.deactivate(id);
        return toResponse(updated);
    }

    @Get
    public List<ProductResponse> list(@QueryValue Optional<String> query) {
        List<ProductEntity> products = query
                .map(String::trim)
                .filter(q -> !q.isBlank())
                .map(productRepository::search)
                .orElseGet(productRepository::listActive);

        return products.stream().map(ProductController::toResponse).toList();
    }

    private static ProductResponse toResponse(ProductEntity e) {
        return new ProductResponse(
                e.id(),
                e.sku(),
                e.name(),
                e.unit(),
                e.minTotal(),
                e.active()
        );
    }
}
