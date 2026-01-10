package org.example.api;

import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.*;
import io.micronaut.http.multipart.CompletedFileUpload;
import org.example.domain.dto.SalesImportResult;
import org.example.domain.service.SalesImportService;

import java.io.IOException;

@Controller("/api/sales-imports")
public class SalesImportController {

    private final SalesImportService salesImportService;

    public SalesImportController(SalesImportService salesImportService) {
        this.salesImportService = salesImportService;
    }

    @Post(consumes = MediaType.MULTIPART_FORM_DATA)
    public SalesImportResult upload(@Part("file") CompletedFileUpload file) throws IOException {
        byte[] bytes = file.getBytes();
        return salesImportService.importCsv(bytes, file.getFilename());
    }
}
