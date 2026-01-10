//package org.example.api
//
//import io.micronaut.http.HttpRequest
//import io.micronaut.http.MediaType
//import io.micronaut.http.client.HttpClient
//import io.micronaut.http.client.annotation.Client
//import io.micronaut.http.client.multipart.MultipartBody
//import io.micronaut.test.annotation.MockBean
//import io.micronaut.test.extensions.spock.annotation.MicronautTest
//import jakarta.inject.Inject
//import org.example.domain.SalesImportStatus
//import org.example.domain.dto.SalesImportResult
//import org.example.domain.service.SalesImportService
//import spock.lang.Specification
//
//@MicronautTest
//class SalesImportControllerTest extends Specification {
//
//    @Inject @Client("/") HttpClient client
//    @Inject SalesImportService salesImportService
//
//    @MockBean(SalesImportService)
//    SalesImportService salesImportService() {
//        Mock(SalesImportService)
//    }
//
//    def "POST /api/sales-imports accepts multipart upload and returns result"() {
//        given:
//        byte[] csv = "sku,quantity\nSKU1,2\n".bytes
//        def expected = new SalesImportResult(SalesImportStatus.SUCCESS, 2, 1, 0, 1, 2L, 2L, "abc")
//        salesImportService.importCsv(_ as byte[], "sales.csv") >> expected
//
//        def body = MultipartBody.builder()
//                .addPart("file", "sales.csv", MediaType.TEXT_PLAIN_TYPE, csv)
//                .build()
//
//        when:
//        def req = HttpRequest.POST("/api/sales-imports", body)
//                .contentType(MediaType.MULTIPART_FORM_DATA_TYPE)
//                .basicAuth("admin", "admin")
//
//        def resp = client.toBlocking().exchange(req, SalesImportResult)
//
//        then:
//        resp.status.code == 200
//        resp.body().status() == SalesImportStatus.SUCCESS
//        resp.body().rowsRead() == 2
//    }
//}
