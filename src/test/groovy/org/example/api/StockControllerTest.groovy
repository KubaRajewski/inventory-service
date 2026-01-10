//package org.example.api
//
//import io.micronaut.http.HttpRequest
//import io.micronaut.http.client.HttpClient
//import io.micronaut.http.client.annotation.Client
//import io.micronaut.test.annotation.MockBean
//import io.micronaut.test.extensions.spock.annotation.MicronautTest
//import jakarta.inject.Inject
//import org.example.domain.dto.StockView
//import org.example.domain.service.StockService
//import spock.lang.Specification
//
//@MicronautTest
//class StockControllerTest extends Specification {
//
//    @Inject @Client("/") HttpClient client
//    @Inject StockService stockService
//
//    @MockBean(StockService)
//    StockService stockService() {
//        Mock(StockService)
//    }
//
//    def "GET /api/stocks returns stock view list"() {
//        given:
//        stockService.getStocksView(Optional.empty()) >> [
//                new StockView(1L, "SKU1", "Milk", "pcs", 10, 3L, 2L, 5L, true),
//                new StockView(2L, "SKU2", "Bread", "pcs", 5, 10L, 0L, 10L, false)
//        ]
//
//        when:
//        def req = HttpRequest.GET("/api/stocks").basicAuth("admin", "admin")
//        def body = client.toBlocking().retrieve(req, StockView[])
//
//        then:
//        body.size() == 2
//        body[0].sku() == "SKU1"
//    }
//
//    def "GET /api/stocks/low returns only low stock items"() {
//        given:
//        stockService.getStocksView(Optional.empty()) >> [
//                new StockView(1L, "SKU1", "Milk", "pcs", 10, 3L, 2L, 5L, true),
//                new StockView(2L, "SKU2", "Bread", "pcs", 5, 10L, 0L, 10L, false)
//        ]
//
//        when:
//        def req = HttpRequest.GET("/api/stocks/low").basicAuth("admin", "admin")
//        def body = client.toBlocking().retrieve(req, StockView[])
//
//        then:
//        body.size() == 1
//        body[0].sku() == "SKU1"
//        body[0].low() == true
//    }
//}
