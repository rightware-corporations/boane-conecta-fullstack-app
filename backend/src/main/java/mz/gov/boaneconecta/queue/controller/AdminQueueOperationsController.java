package mz.gov.boaneconecta.queue.controller;

import jakarta.validation.Valid;
import mz.gov.boaneconecta.core.response.ApiResponse;
import mz.gov.boaneconecta.core.security.UserDetailsImpl;
import mz.gov.boaneconecta.queue.dto.*;
import mz.gov.boaneconecta.queue.service.QueueOperationsService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE')")
public class AdminQueueOperationsController {
    private final QueueOperationsService service;
    public AdminQueueOperationsController(QueueOperationsService service) { this.service=service; }

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
