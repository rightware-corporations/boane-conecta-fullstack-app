package mz.gov.boaneconecta.queue.service;

import mz.gov.boaneconecta.core.exception.*;
import mz.gov.boaneconecta.queue.dto.*;
import mz.gov.boaneconecta.queue.entity.*;
import mz.gov.boaneconecta.queue.repository.QueueTicketRepository;
import mz.gov.boaneconecta.users.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
public class QueueProjectionService {
    private final QueueTicketRepository tickets; private final UserRepository users;
    public QueueProjectionService(QueueTicketRepository tickets,UserRepository users){this.tickets=tickets;this.users=users;}
    @Transactional(readOnly=true)
    public List<PublicQueueDisplayItem> display(UUID queueId){return tickets.findByQueueIdAndStatusInOrderByCalledAtDesc(queueId,
            EnumSet.of(QueueTicketStatus.CALLED,QueueTicketStatus.SERVING)).stream().map(ticket->new PublicQueueDisplayItem(
                    ticket.getTicketNumber(),ticket.getCalledDesk()==null?null:ticket.getCalledDesk().getDisplayName(),ticket.getStatus(),ticket.getCalledAt())).toList();}
    @Transactional(readOnly=true)
    public CitizenQueueTicketResponse citizen(UUID citizenId,UUID ticketId){var citizen=users.findById(citizenId).orElseThrow(()->new ResourceNotFoundException("User not found"));
        QueueTicket ticket=tickets.findByIdAndCitizenUser(ticketId,citizen).orElseThrow(()->new ResourceNotFoundException("QUEUE_TICKET_NOT_FOUND"));
        long ahead=ticket.getStatus()==QueueTicketStatus.WAITING?tickets.countAhead(ticket.getQueue().getId(),ticket.getBusinessDate(),rank(ticket.getPriorityClass()),ticket.getSequenceNumber()):0;
        return new CitizenQueueTicketResponse(ticket.getId(),ticket.getTicketNumber(),ticket.getStatus(),ahead,
                ticket.getCalledDesk()==null?null:ticket.getCalledDesk().getDisplayName(),ticket.getQueue().getLocationCode(),ticket.getUpdatedAt(),List.of());}
    private int rank(QueuePriorityClass priority){return switch(priority){case SPECIAL_OPERATIONAL->0;case PRIORITY_ELIGIBLE->1;case NORMAL->2;};}
}
