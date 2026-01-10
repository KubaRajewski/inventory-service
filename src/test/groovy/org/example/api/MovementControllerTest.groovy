//package org.example.api
//
//import io.micronaut.http.HttpRequest
//import io.micronaut.http.client.HttpClient
//import io.micronaut.http.client.annotation.Client
//import io.micronaut.test.annotation.MockBean
//import io.micronaut.test.extensions.spock.annotation.MicronautTest
//import jakarta.inject.Inject
//import org.example.api.dto.MovementDtos
//import org.example.domain.Location
//import org.example.domain.service.MovementService
//import spock.lang.Specification
//
//@MicronautTest
//class MovementControllerTest extends Specification {
//
//    @Inject @Client("/") HttpClient client
//    @Inject MovementService movementService
//
//    @MockBean(MovementService)
//    MovementService movementService() {
//        Mock(MovementService)
//    }
//
//    def "POST /api/movements/receipt returns 204"() {
//        given:
//        def reqBody = new MovementDtos.ReceiptRequest(1L, 5L, Location.BACKROOM, "delivery")
//        1 * movementService.receipt(1L, 5L, Location.BACKROOM, "delivery")
//
//        when:
//        def req = HttpRequest.POST("/api/movements/receipt", reqBody).basicAuth("admin", "admin")
//        def resp = client.toBlocking().exchange(req)
//
//        then:
//        resp.status.code == 204
//    }
//
//    def "POST /api/movements/issue returns 204"() {
//        given:
//        def reqBody = new MovementDtos.IssueRequest(1L, 2L, Location.SHOPFLOOR, "sold")
//        1 * movementService.issue(1L, 2L, Location.SHOPFLOOR, "sold")
//
//        when:
//        def req = HttpRequest.POST("/api/movements/issue", reqBody).basicAuth("admin", "admin")
//        def resp = client.toBlocking().exchange(req)
//
//        then:
//        resp.status.code == 204
//    }
//
//    def "POST /api/movements/transfer returns 204"() {
//        given:
//        def reqBody = new MovementDtos.TransferRequest(1L, 3L, Location.BACKROOM, Location.SHOPFLOOR, "restock")
//        1 * movementService.transfer(1L, 3L, Location.BACKROOM, Location.SHOPFLOOR, "restock")
//
//        when:
//        def req = HttpRequest.POST("/api/movements/transfer", reqBody).basicAuth("admin", "admin")
//        def resp = client.toBlocking().exchange(req)
//
//        then:
//        resp.status.code == 204
//    }
//}
