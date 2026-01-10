//package org.example.api
//
//import io.micronaut.http.HttpRequest
//import io.micronaut.http.client.HttpClient
//import io.micronaut.http.client.annotation.Client
//import io.micronaut.test.annotation.MockBean
//import io.micronaut.test.extensions.spock.annotation.MicronautTest
//import jakarta.inject.Inject
//import org.example.api.dto.ReportDtos
//import org.example.domain.Location
//import org.example.domain.MovementType
//import org.example.persistence.entity.MovementEntity
//import org.example.persistence.entity.ProductEntity
//import org.example.persistence.repo.MovementRepository
//import org.example.persistence.repo.ProductRepository
//import spock.lang.Specification
//
//import java.time.Instant
//
//@MicronautTest
//class ReportsControllerTest extends Specification {
//
//    @Inject @Client("/") HttpClient client
//
//    @Inject MovementRepository movementRepository
//    @Inject ProductRepository productRepository
//
//    @MockBean(MovementRepository)
//    MovementRepository movementRepository() {
//        Mock(MovementRepository)
//    }
//
//    @MockBean(ProductRepository)
//    ProductRepository productRepository() {
//        Mock(ProductRepository)
//    }
//
//    def "GET /api/reports/top-sales returns aggregated rows"() {
//        given:
//        movementRepository.findAll() >> [
//                new MovementEntity(1L, 10L, MovementType.SALE_IMPORT, 5L, Location.SHOPFLOOR, null, Instant.now(), "sale"),
//                new MovementEntity(2L, 10L, MovementType.SALE_IMPORT, 3L, Location.BACKROOM, null, Instant.now(), "sale"),
//                new MovementEntity(3L, 11L, MovementType.RECEIPT,  7L, null, Location.BACKROOM, Instant.now(), "receipt")
//        ]
//        productRepository.findById(10L) >> Optional.of(new ProductEntity(10L, "SKU10", "Milk", "pcs", 10, true, null, null))
//
//        when:
//        def req = HttpRequest.GET("/api/reports/top-sales?limit=10").basicAuth("admin", "admin")
//        def body = client.toBlocking().retrieve(req, ReportDtos.TopSalesRow[])
//
//        then:
//        body.size() == 1
//        body[0].productId() == 10L
//        body[0].quantitySold() == 8L
//        body[0].sku() == "SKU10"
//    }
//}
