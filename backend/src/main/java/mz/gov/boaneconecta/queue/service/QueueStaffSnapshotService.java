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
import mz.gov.boaneconecta.users.entity.User;
import mz.gov.boaneconecta.users.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;

@Service
public class QueueStaffSnapshotService {
    private static final Set<QueueTicketStatus> ACTIVE = EnumSet.of(QueueTicketStatus.CALLED, QueueTicketStatus.SERVING);
    private final MunicipalQueueRepository queues;
    private final QueueDeskRepository desks;
    private final QueueTicketRepository tickets;
    private final ServiceSessionRepository sessions;
    private final Clock clock;
    private final QueueStaffScopeRepository staffScopes;
    private final UserRepository users;

    public QueueStaffSnapshotService(MunicipalQueueRepository queues, QueueDeskRepository desks,
            QueueTicketRepository tickets, ServiceSessionRepository sessions, Clock clock,
            QueueStaffScopeRepository staffScopes, UserRepository users) {
        this.queues = queues; this.desks = desks; this.tickets = tickets; this.sessions = sessions; this.clock = clock;
        this.staffScopes = staffScopes; this.users = users;
    }

    @Transactional(readOnly = true)
    public List<QueueStaffSnapshotResponse> list(UUID actorId) {
        User actor = user(actorId);
        Set<UUID> allowed = staffScopes.findByStaffUserOrderByCreatedAtAsc(actor).stream().map(scope -> scope.getQueue().getId()).collect(java.util.stream.Collectors.toSet());
        return queues.findAll(Sort.by(Sort.Direction.ASC, "name")).stream().filter(queue -> allowed.contains(queue.getId())).map(this::snapshot).toList();
    }

    @Transactional(readOnly = true)
    public QueueStaffSnapshotResponse get(UUID actorId, UUID queueId) {
        User actor = user(actorId);
        MunicipalQueue queue = queues.findById(queueId)
                .orElseThrow(() -> new ResourceNotFoundException("QUEUE_NOT_FOUND"));
        if (!staffScopes.existsByQueueAndStaffUser(queue, actor)) throw new AccessDeniedException("QUEUE_SCOPE_FORBIDDEN");
        return snapshot(queue);
    }

    private QueueStaffSnapshotResponse snapshot(MunicipalQueue queue) {
        UUID queueId = queue.getId();
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

    private User user(UUID id) { return users.findById(id).orElseThrow(() -> new ResourceNotFoundException("USER_NOT_FOUND")); }

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
