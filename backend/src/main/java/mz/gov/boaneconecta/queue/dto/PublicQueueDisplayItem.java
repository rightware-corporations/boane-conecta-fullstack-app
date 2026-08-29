package mz.gov.boaneconecta.queue.dto;
import mz.gov.boaneconecta.queue.entity.QueueTicketStatus;
import java.time.Instant;
public record PublicQueueDisplayItem(String ticketCode,String deskDisplayName,QueueTicketStatus callState,Instant calledAt) {}
