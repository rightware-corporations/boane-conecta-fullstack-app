package mz.gov.boaneconecta.queue.controller;
import mz.gov.boaneconecta.core.response.ApiResponse;
import mz.gov.boaneconecta.core.security.UserDetailsImpl;
import mz.gov.boaneconecta.queue.dto.*;
import mz.gov.boaneconecta.queue.service.QueueProjectionService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController
public class QueueProjectionController {
    private final QueueProjectionService service; public QueueProjectionController(QueueProjectionService service){this.service=service;}
    @GetMapping("/api/v1/public/queues/{queueId}/display") public ApiResponse<List<PublicQueueDisplayItem>> display(@PathVariable UUID queueId){return ApiResponse.success("Queue display retrieved",service.display(queueId));}
    @GetMapping("/api/v1/citizen/queue-tickets/{ticketId}") public ApiResponse<CitizenQueueTicketResponse> citizen(@AuthenticationPrincipal UserDetailsImpl actor,@PathVariable UUID ticketId){return ApiResponse.success("Queue ticket retrieved",service.citizen(actor.getId(),ticketId));}
}
