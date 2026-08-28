package mz.gov.boaneconecta.queue.service;

import mz.gov.boaneconecta.core.exception.ResourceNotFoundException;
import mz.gov.boaneconecta.queue.dto.QueueStaffSnapshotResponse;
import mz.gov.boaneconecta.queue.entity.*;
import mz.gov.boaneconecta.queue.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Sort;
import java.time.Clock;
import java.time.LocalDate;
import java.util.*;

@Service
public class QueueStaffSnapshotService {
    private static final Set<QueueTicketStatus> ACTIVE = EnumSet.of(QueueTicketStatus.CALLED, QueueTicketStatus.SERVING);
    private final MunicipalQueueRepository queues;
    private final QueueDeskRepository desks;
    private final QueueTicketRepository tickets;
    private final ServiceSessionRepository sessions;
    private final Clock clock;

    public QueueStaffSnapshotService(MunicipalQueueRepository queues, QueueDeskRepository desks,
            QueueTicketRepository tickets, ServiceSessionRepository sessions, Clock clock) {
        this.queues = queues; this.desks = desks; this.tickets = tickets; this.sessions = sessions; this.clock = clock;
    }

    @Transactional(readOnly = true)
    public List<QueueStaffSnapshotResponse> list() {
        return queues.findAll(Sort.by(Sort.Direction.ASC, "name")).stream().map(queue -> get(queue.getId())).toList();
    }

    @Transactional(readOnly = true)
    public QueueStaffSnapshotResponse get(UUID queueId) {
        MunicipalQueue queue = queues.findById(queueId)
                .orElseThrow(() -> new ResourceNotFoundException("QUEUE_NOT_FOUND"));
        Map<UUID, QueueTicket> activeByDesk = new HashMap<>();
        tickets.findByQueueIdAndStatusInOrderByCalledAtDesc(queueId, ACTIVE).forEach(ticket -> {
            if (ticket.getCalledDesk() != null) activeByDesk.putIfAbsent(ticket.getCalledDesk().getId(), ticket);
        });
        List<QueueStaffSnapshotResponse.Desk> deskItems = desks.findByQueueOrderByCode(queue).stream().map(desk -> {
            QueueTicket active = activeByDesk.get(desk.getId());
            UUID sessionId = sessions.findByDeskAndStatus(desk, ServiceSessionStatus.ACTIVE).map(ServiceSession::getId).orElse(null);
            return new QueueStaffSnapshotResponse.Desk(desk.getId(), desk.getCode(), desk.getDisplayName(), desk.getStatus(),
                    desk.getCurrentStaffUser() == null ? null : desk.getCurrentStaffUser().getId(), ticket(active), sessionId);
        }).toList();
        List<QueueStaffSnapshotResponse.Ticket> waiting = tickets
                .findWaitingSnapshot(queueId, LocalDate.now(clock)).stream().map(this::ticket).toList();
        return new QueueStaffSnapshotResponse(queue.getId(), queue.getName(), queue.getLocationCode(), queue.getStatus(),
                clock.instant(), deskItems, waiting);
    }

    private QueueStaffSnapshotResponse.Ticket ticket(QueueTicket ticket) {
        if (ticket == null) return null;
        List<String> actions = switch (ticket.getStatus()) {
            case CALLED -> List.of("RECALL", "START_SERVICE", "NO_SHOW", "TRANSFER");
            case SERVING -> List.of("COMPLETE");
            case WAITING -> List.of("TRANSFER");
            default -> List.of();
        };
        return new QueueStaffSnapshotResponse.Ticket(ticket.getId(), ticket.getTicketNumber(), ticket.getStatus(),
                ticket.getCreatedAt(), ticket.getCalledAt(), ticket.getServiceStartedAt(), actions);
    }
}
