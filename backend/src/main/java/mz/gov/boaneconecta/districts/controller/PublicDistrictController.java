package mz.gov.boaneconecta.districts.controller;

import mz.gov.boaneconecta.core.response.ApiResponse;
import mz.gov.boaneconecta.districts.dto.DistrictResponse;
import mz.gov.boaneconecta.districts.service.DistrictService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/public/districts")
public class PublicDistrictController {
    private final DistrictService districtService;

    public PublicDistrictController(DistrictService districtService) {
        this.districtService = districtService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DistrictResponse>>> list() {
        return ResponseEntity.ok(ApiResponse.success(
                "Active districts retrieved", districtService.listPublic()));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<DistrictResponse>> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(
                "District retrieved", districtService.getPublicBySlug(slug)));
    }
}
