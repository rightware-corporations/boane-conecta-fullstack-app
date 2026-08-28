package mz.gov.boaneconecta.queue.dto;
import mz.gov.boaneconecta.queue.entity.QueueTicketStatus;
import java.time.Instant;
import java.util.*;
public record CitizenQueueTicketResponse(UUID id,String ticketCode,QueueTicketStatus status,long peopleAhead,
        String deskDisplayName,String locationCode,Instant lastUpdatedAt,List<String> availableActions) {}
