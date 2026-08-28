package mz.gov.boaneconecta.queue.controller;

import jakarta.validation.Valid;
import mz.gov.boaneconecta.core.response.ApiResponse;
import mz.gov.boaneconecta.core.security.UserDetailsImpl;
import mz.gov.boaneconecta.queue.dto.*;
import mz.gov.boaneconecta.queue.service.QueueOperationsService;
import mz.gov.boaneconecta.queue.service.QueueStaffSnapshotService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE')")
public class AdminQueueOperationsController {
    private final QueueOperationsService service;
    private final QueueStaffSnapshotService snapshots;
    public AdminQueueOperationsController(QueueOperationsService service, QueueStaffSnapshotService snapshots) {
        this.service=service; this.snapshots=snapshots;
    }

    @GetMapping("/queues/snapshots")
    public ApiResponse<List<QueueStaffSnapshotResponse>> snapshots() {
        return ApiResponse.success("Queue operational snapshots retrieved", snapshots.list());
    }

    @GetMapping("/queues/{queueId}/snapshot")
    public ApiResponse<QueueStaffSnapshotResponse> snapshot(@PathVariable UUID queueId) {
        return ApiResponse.success("Queue operational snapshot retrieved", snapshots.get(queueId));
    }

    @PostMapping("/queues/{queueId}/desks/{deskId}/open")
    public ApiResponse<QueueOperationResponse> open(@AuthenticationPrincipal UserDetailsImpl actor,
            @PathVariable UUID queueId,@PathVariable UUID deskId){return ApiResponse.success("Queue desk opened",service.openDesk(actor.getId(),queueId,deskId));}
    @PostMapping("/queues/{queueId}/desks/{deskId}/close")
    public ApiResponse<QueueOperationResponse> close(@AuthenticationPrincipal UserDetailsImpl actor,
            @PathVariable UUID queueId,@PathVariable UUID deskId){return ApiResponse.success("Queue desk closed",service.closeDesk(actor.getId(),queueId,deskId));}
    @PostMapping("/queues/{queueId}/desks/{deskId}/call-next")
    public ApiResponse<QueueOperationResponse> callNext(@AuthenticationPrincipal UserDetailsImpl actor,
            @PathVariable UUID queueId,@PathVariable UUID deskId,@RequestHeader("Idempotency-Key") String key){return ApiResponse.success("Next queue ticket selected",service.callNext(actor.getId(),queueId,deskId,key));}
    @PostMapping("/queue-tickets/{ticketId}/recall")
    public ApiResponse<QueueOperationResponse> recall(@AuthenticationPrincipal UserDetailsImpl actor,@PathVariable UUID ticketId){return ApiResponse.success("Queue ticket recalled",service.recall(actor.getId(),ticketId));}
    @PostMapping("/queue-tickets/{ticketId}/start-service")
    public ApiResponse<QueueOperationResponse> start(@AuthenticationPrincipal UserDetailsImpl actor,@PathVariable UUID ticketId){return ApiResponse.success("Service started",service.startService(actor.getId(),ticketId));}
    @PostMapping("/service-sessions/{sessionId}/complete")
    public ApiResponse<QueueOperationResponse> complete(@AuthenticationPrincipal UserDetailsImpl actor,@PathVariable UUID sessionId,
            @Valid @RequestBody CompleteServiceSessionRequest request){return ApiResponse.success("Service completed",service.completeService(actor.getId(),sessionId,request.outcomeCode()));}
    @PostMapping("/queue-tickets/{ticketId}/no-show")
    public ApiResponse<QueueOperationResponse> noShow(@AuthenticationPrincipal UserDetailsImpl actor,@PathVariable UUID ticketId){return ApiResponse.success("Queue ticket marked no-show",service.noShow(actor.getId(),ticketId));}
    @PostMapping("/queue-tickets/{ticketId}/transfer")
    public ApiResponse<QueueOperationResponse> transfer(@AuthenticationPrincipal UserDetailsImpl actor,@PathVariable UUID ticketId,
            @Valid @RequestBody TransferQueueTicketRequest request){return ApiResponse.success("Queue ticket transferred",service.transfer(actor.getId(),ticketId,request.destinationQueueId(),request.reason()));}
}
