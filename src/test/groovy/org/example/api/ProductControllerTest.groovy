//package org.example.api
//
//import io.micronaut.http.HttpRequest
//import io.micronaut.http.client.HttpClient
//import io.micronaut.http.client.annotation.Client
//import io.micronaut.test.annotation.MockBean
//import io.micronaut.test.extensions.spock.annotation.MicronautTest
//import jakarta.inject.Inject
//import org.example.api.dto.ProductDtos
//import org.example.domain.service.ProductService
//import org.example.persistence.entity.ProductEntity
//import spock.lang.Specification
//
//@MicronautTest
//class ProductControllerTest extends Specification {
//
//    @Inject @Client("/") HttpClient client
//    @Inject ProductService productService
//
//    @MockBean(ProductService)
//    ProductService productService() {
//        Mock(ProductService)
//    }
//
//    def "POST /api/products returns 201 and product body"() {
//        given:
//        def req = new ProductDtos.CreateProductRequest("SKU1", "Milk", "pcs", 10)
//        productService.create("SKU1", "Milk", "pcs", 10) >> new ProductEntity(1L, "SKU1", "Milk", "pcs", 10, true, null, null)
//
//        when:
//        def httpReq = HttpRequest.POST("/api/products", req).basicAuth("admin", "admin")
//        def resp = client.toBlocking().exchange(httpReq, ProductDtos.ProductResponse)
//
//        then:
//        resp.status.code == 201
//        resp.body().id() == 1L
//        resp.body().sku() == "SKU1"
//        resp.body().minTotal() == 10
//    }
//
//    def "PUT /api/products/{id} returns 200 and updated product body"() {
//        given:
//        def req = new ProductDtos.UpdateProductRequest(Optional.of("SKU2"), Optional.empty(), Optional.empty(), Optional.empty(), Optional.empty())
//        productService.update(1L, Optional.of("SKU2"), Optional.empty(), Optional.empty(), Optional.empty(), Optional.empty()) >>
//                new ProductEntity(1L, "SKU2", "Milk", "pcs", 10, true, null, null)
//
//        when:
//        def httpReq = HttpRequest.PUT("/api/products/1", req).basicAuth("admin", "admin")
//        def body = client.toBlocking().retrieve(httpReq, ProductDtos.ProductResponse)
//
//        then:
//        body.id() == 1L
//        body.sku() == "SKU2"
//    }
//
//    def "POST /api/products/{id}/deactivate returns 200 and inactive product"() {
//        given:
//        productService.deactivate(1L) >> new ProductEntity(1L, "SKU1", "Milk", "pcs", 10, false, null, null)
//
//        when:
//        def httpReq = HttpRequest.POST("/api/products/1/deactivate", "").basicAuth("admin", "admin")
//        def body = client.toBlocking().retrieve(httpReq, ProductDtos.ProductResponse)
//
//        then:
//        body.id() == 1L
//        body.active() == false
//    }
//}
