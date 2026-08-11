package mz.gov.boaneconecta.municipalservices.controller;

import mz.gov.boaneconecta.core.response.ApiResponse;
import mz.gov.boaneconecta.municipalservices.dto.MunicipalServiceResponse;
import mz.gov.boaneconecta.municipalservices.service.MunicipalServiceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/public/services")
public class PublicMunicipalServiceController {
    private final MunicipalServiceService municipalServiceService;

    public PublicMunicipalServiceController(MunicipalServiceService municipalServiceService) {
        this.municipalServiceService = municipalServiceService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MunicipalServiceResponse>>> list() {
        return ResponseEntity.ok(ApiResponse.success(
                "Published municipal services retrieved", municipalServiceService.listPublic()));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<MunicipalServiceResponse>> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(
                "Municipal service retrieved", municipalServiceService.getPublicBySlug(slug)));
    }
}
