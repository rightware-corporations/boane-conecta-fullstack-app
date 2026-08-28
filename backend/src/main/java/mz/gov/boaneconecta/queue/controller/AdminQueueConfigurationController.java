package mz.gov.boaneconecta.queue.controller;

import jakarta.validation.Valid;
import mz.gov.boaneconecta.core.response.ApiResponse;
import mz.gov.boaneconecta.queue.dto.*;
import mz.gov.boaneconecta.queue.service.QueueAdministrationService;
import mz.gov.boaneconecta.requests.draft.service.VersionHeaderParser;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/v1/admin/queues")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
public class AdminQueueConfigurationController {
    private final QueueAdministrationService service;private final VersionHeaderParser versions;
    public AdminQueueConfigurationController(QueueAdministrationService service,VersionHeaderParser versions){this.service=service;this.versions=versions;}
    @GetMapping public ApiResponse<List<QueueAdminResponse>> list(){return ApiResponse.success("Queues retrieved",service.list());}
    @GetMapping("/{id}") public ApiResponse<QueueAdminResponse> get(@PathVariable UUID id){return ApiResponse.success("Queue retrieved",service.get(id));}
    @PostMapping public ApiResponse<QueueAdminResponse> create(@Valid @RequestBody CreateQueueRequest request){return ApiResponse.success("Queue created",service.create(request));}
    @PutMapping("/{id}") public ApiResponse<QueueAdminResponse> update(@PathVariable UUID id,@RequestHeader("If-Match") String match,@Valid @RequestBody UpdateQueueRequest request){return ApiResponse.success("Queue updated",service.update(id,versions.parse(match),request));}
    @PostMapping("/{id}/status") public ApiResponse<QueueAdminResponse> status(@PathVariable UUID id,@RequestHeader("If-Match") String match,@Valid @RequestBody QueueStatusRequest request){return ApiResponse.success("Queue status updated",service.changeStatus(id,versions.parse(match),request.status()));}
    @PostMapping("/{id}/desks") public ApiResponse<QueueAdminResponse> createDesk(@PathVariable UUID id,@Valid @RequestBody CreateQueueDeskRequest request){return ApiResponse.success("Queue desk created",service.createDesk(id,request));}
    @PutMapping("/{id}/desks/{deskId}") public ApiResponse<QueueAdminResponse> updateDesk(@PathVariable UUID id,@PathVariable UUID deskId,@RequestHeader("If-Match") String match,@Valid @RequestBody UpdateQueueDeskRequest request){return ApiResponse.success("Queue desk updated",service.updateDesk(id,deskId,versions.parse(match),request));}
}
