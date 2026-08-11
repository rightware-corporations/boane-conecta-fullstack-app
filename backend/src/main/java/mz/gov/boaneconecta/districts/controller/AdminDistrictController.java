package mz.gov.boaneconecta.districts.controller;

import jakarta.validation.Valid;
import mz.gov.boaneconecta.core.response.ApiResponse;
import mz.gov.boaneconecta.districts.dto.DistrictRequest;
import mz.gov.boaneconecta.districts.dto.DistrictResponse;
import mz.gov.boaneconecta.districts.service.DistrictService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/districts")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
public class AdminDistrictController {
    private final DistrictService districtService;

    public AdminDistrictController(DistrictService districtService) {
        this.districtService = districtService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DistrictResponse>>> list() {
        return ResponseEntity.ok(ApiResponse.success(
                "Districts retrieved", districtService.listAdmin()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DistrictResponse>> create(
            @Valid @RequestBody DistrictRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("District created", districtService.create(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DistrictResponse>> update(
            @PathVariable UUID id,
            @Valid @RequestBody DistrictRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                "District updated", districtService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        districtService.deactivate(id);
        return ResponseEntity.ok(ApiResponse.success("District deactivated", null));
    }
}
