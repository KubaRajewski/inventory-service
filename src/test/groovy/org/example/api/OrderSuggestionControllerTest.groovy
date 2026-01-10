//package org.example.api
//
//import io.micronaut.http.HttpHeaders
//import io.micronaut.http.HttpRequest
//import io.micronaut.http.client.HttpClient
//import io.micronaut.http.client.annotation.Client
//import io.micronaut.test.annotation.MockBean
//import io.micronaut.test.extensions.spock.annotation.MicronautTest
//import jakarta.inject.Inject
//import org.example.domain.dto.OrderSuggestionRow
//import org.example.domain.service.OrderSuggestionService
//import spock.lang.Specification
//
//@MicronautTest
//class OrderSuggestionControllerTest extends Specification {
//
//    @Inject @Client("/") HttpClient client
//    @Inject OrderSuggestionService orderSuggestionService
//
//    @MockBean(OrderSuggestionService)
//    OrderSuggestionService orderSuggestionService() {
//        Mock(OrderSuggestionService)
//    }
//
//    def "GET /api/order-suggestions returns suggestions list"() {
//        given:
//        orderSuggestionService.suggest(Optional.empty()) >> [
//                new OrderSuggestionRow(1L, "SKU1", "Milk", 10, 3L, 2L, 5L, 5L)
//        ]
//
//        when:
//        def req = HttpRequest.GET("/api/order-suggestions").basicAuth("admin", "admin")
//        def body = client.toBlocking().retrieve(req, OrderSuggestionRow[])
//
//        then:
//        body.size() == 1
//        body[0].suggestedQty() == 5L
//    }
//
//    def "GET /api/order-suggestions/export returns CSV bytes with attachment header"() {
//        given:
//        orderSuggestionService.exportLowToCsv(Optional.empty()) >> "sku,name\nSKU1,Milk\n".bytes
//
//        when:
//        def req = HttpRequest.GET("/api/order-suggestions/export").basicAuth("admin", "admin")
//        def resp = client.toBlocking().exchange(req, byte[])
//
//        then:
//        resp.status.code == 200
//        new String(resp.body()) == "sku,name\nSKU1,Milk\n"
//        resp.headers.get(HttpHeaders.CONTENT_DISPOSITION).contains("attachment")
//    }
//}
