package mz.gov.boaneconecta.notifications.controller;

import jakarta.validation.Valid;
import mz.gov.boaneconecta.core.response.ApiResponse;
import mz.gov.boaneconecta.notifications.dto.CreateNotificationRequest;
import mz.gov.boaneconecta.notifications.dto.NotificationResponse;
import mz.gov.boaneconecta.notifications.service.NotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/notifications")
public class AdminNotificationController {
    private final NotificationService service;

    public AdminNotificationController(NotificationService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<NotificationResponse>> create(@Valid @RequestBody CreateNotificationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Created", service.create(request)));
    }

    @GetMapping
    public ApiResponse<List<NotificationResponse>> list() {
        return ApiResponse.success("Retrieved", service.listAdmin());
    }
}
