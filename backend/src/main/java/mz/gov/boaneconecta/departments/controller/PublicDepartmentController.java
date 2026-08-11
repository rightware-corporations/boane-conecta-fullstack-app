package mz.gov.boaneconecta.departments.controller;

import mz.gov.boaneconecta.core.response.ApiResponse;
import mz.gov.boaneconecta.departments.dto.DepartmentResponse;
import mz.gov.boaneconecta.departments.service.DepartmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/public/departments")
public class PublicDepartmentController {
    private final DepartmentService departmentService;

    public PublicDepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DepartmentResponse>>> list() {
        return ResponseEntity.ok(ApiResponse.success(
                "Active departments retrieved", departmentService.listPublic()));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<DepartmentResponse>> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(
                "Department retrieved", departmentService.getPublicBySlug(slug)));
    }
}
