package mz.gov.boaneconecta.queue.service;

import mz.gov.boaneconecta.core.exception.*;
import mz.gov.boaneconecta.queue.dto.QueueOperationResponse;
import mz.gov.boaneconecta.queue.entity.*;
import mz.gov.boaneconecta.queue.repository.*;
import mz.gov.boaneconecta.requests.submission.entity.*;
import mz.gov.boaneconecta.requests.submission.repository.IdempotencyRecordRepository;
import mz.gov.boaneconecta.users.entity.User;
import mz.gov.boaneconecta.users.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.time.*;
import java.util.*;

@Service
public class QueueOperationsService {
    private static final Set<QueueTicketStatus> DESK_ACTIVE = EnumSet.of(QueueTicketStatus.CALLED, QueueTicketStatus.SERVING);
    private final MunicipalQueueRepository queues; private final QueueDeskRepository desks;
    private final QueueTicketRepository tickets; private final ServiceSessionRepository sessions;
    private final QueueEventRepository events; private final QueueSequenceAllocator sequences;
    private final IdempotencyRecordRepository idempotency; private final UserRepository users; private final Clock clock;
    private final QueueStaffScopeRepository staffScopes;

    public QueueOperationsService(MunicipalQueueRepository queues, QueueDeskRepository desks,
            QueueTicketRepository tickets, ServiceSessionRepository sessions, QueueEventRepository events,
            QueueSequenceAllocator sequences, IdempotencyRecordRepository idempotency, UserRepository users, Clock clock,
            QueueStaffScopeRepository staffScopes) {
        this.queues=queues; this.desks=desks; this.tickets=tickets; this.sessions=sessions; this.events=events;
        this.sequences=sequences; this.idempotency=idempotency; this.users=users; this.clock=clock; this.staffScopes=staffScopes;
    }

    @Transactional
    public QueueOperationResponse openDesk(UUID actorId, UUID queueId, UUID deskId) {
        User actor=user(actorId); MunicipalQueue queue=queue(queueId); requireScope(queue,actor); QueueDesk desk=desk(queueId, deskId);
        if (queue.getStatus()!=QueueStatus.OPEN) throw new ResourceConflictException("QUEUE_NOT_OPEN");
        if (desk.getStatus()!=QueueDeskStatus.CLOSED && desk.getStatus()!=QueueDeskStatus.PAUSED)
            throw new ResourceConflictException("QUEUE_DESK_CANNOT_BE_OPENED");
        desk.setCurrentStaffUser(actor); desk.setStatus(QueueDeskStatus.OPEN); desks.saveAndFlush(desk);
        return response(null, desk, null, "DESK_OPENED", false);
    }

    @Transactional
    public QueueOperationResponse closeDesk(UUID actorId, UUID queueId, UUID deskId) {
        User actor=user(actorId); MunicipalQueue queue=queue(queueId); requireScope(queue,actor); QueueDesk desk=desk(queueId, deskId); requireDeskActor(desk, actor);
        if (tickets.existsByCalledDeskAndStatusIn(desk, DESK_ACTIVE) || sessions.existsByDeskAndStatus(desk, ServiceSessionStatus.ACTIVE))
            throw new ResourceConflictException("QUEUE_DESK_HAS_ACTIVE_WORK");
        desk.setStatus(QueueDeskStatus.CLOSED); desk.setCurrentStaffUser(null); desks.saveAndFlush(desk);
        return response(null, desk, null, "DESK_CLOSED", false);
    }

    @Transactional
    public QueueOperationResponse callNext(UUID actorId, UUID queueId, UUID deskId, String key) {
        validateKey(key); User actor=user(actorId); MunicipalQueue queue=queue(queueId); requireScope(queue,actor); String fingerprint=hash(queueId+":"+deskId);
        var previous=idempotency.findByCitizenUserAndOperationAndKeyHash(actor,"QUEUE_CALL_NEXT",hash(key.trim()));
        if(previous.isPresent()) return replayCall(previous.get(),fingerprint,deskId);
        QueueDesk desk=desk(queueId,deskId); requireDeskActor(desk,actor);
        if(queue.getStatus()!=QueueStatus.OPEN) throw new ResourceConflictException("QUEUE_NOT_OPEN");
        if(desk.getStatus()!=QueueDeskStatus.OPEN) throw new ResourceConflictException("QUEUE_DESK_NOT_OPEN");
        if(tickets.existsByCalledDeskAndStatusIn(desk,DESK_ACTIVE)) throw new ResourceConflictException("QUEUE_DESK_HAS_ACTIVE_TICKET");
        IdempotencyRecord claim=claim(actor,"QUEUE_CALL_NEXT",key,fingerprint);
        Optional<QueueTicket> next=tickets.findNextWaitingForUpdate(queueId,LocalDate.now(clock));
        if(next.isEmpty()){ claim.complete(null,"NO_TICKET",clock.instant()); idempotency.save(claim); return response(null,desk,null,"NO_TICKET",false); }
        QueueTicket ticket=next.get(); ticket.setStatus(QueueTicketStatus.CALLED); ticket.setCalledDesk(desk);
        ticket.setCalledAt(clock.instant()); tickets.saveAndFlush(ticket); event(ticket,"TICKET_CALLED",actor,null);
        claim.complete(ticket.getId(),ticket.getTicketNumber(),clock.instant()); idempotency.save(claim);
        return response(ticket,desk,null,"TICKET_CALLED",false);
    }

    @Transactional
    public QueueOperationResponse recall(UUID actorId, UUID ticketId) {
        User actor=user(actorId); QueueTicket ticket=ticket(ticketId); requireScope(ticket.getQueue(),actor);
        if(ticket.getStatus()!=QueueTicketStatus.CALLED || ticket.getCalledDesk()==null) throw new ResourceConflictException("QUEUE_TICKET_CANNOT_BE_RECALLED");
        QueueDesk desk=desks.findByIdForUpdate(ticket.getCalledDesk().getId()).orElseThrow(); requireDeskActor(desk,actor);
        ticket.setCalledAt(clock.instant()); tickets.saveAndFlush(ticket); event(ticket,"TICKET_RECALLED",actor,null);
        return response(ticket,desk,null,"TICKET_RECALLED",false);
    }

    @Transactional
    public QueueOperationResponse startService(UUID actorId, UUID ticketId) {
        User actor=user(actorId); QueueTicket ticket=ticket(ticketId); requireScope(ticket.getQueue(),actor);
        if(ticket.getStatus()!=QueueTicketStatus.CALLED || ticket.getCalledDesk()==null) throw new ResourceConflictException("QUEUE_TICKET_CANNOT_START_SERVICE");
        QueueDesk desk=desks.findByIdForUpdate(ticket.getCalledDesk().getId()).orElseThrow(); requireDeskActor(desk,actor);
        if(desk.getStatus()!=QueueDeskStatus.OPEN || sessions.existsByDeskAndStatus(desk,ServiceSessionStatus.ACTIVE))
            throw new ResourceConflictException("QUEUE_DESK_CANNOT_START_SERVICE");
        Instant now=clock.instant(); ServiceSession session=sessions.saveAndFlush(ServiceSession.builder().queueTicket(ticket)
                .desk(desk).staffUser(actor).startedAt(now).status(ServiceSessionStatus.ACTIVE).build());
        ticket.setStatus(QueueTicketStatus.SERVING); ticket.setServiceStartedAt(now); tickets.save(ticket);
        desk.setStatus(QueueDeskStatus.SERVING); desks.save(desk); event(ticket,"SERVICE_STARTED",actor,null);
        return response(ticket,desk,session,"SERVICE_STARTED",false);
    }

    @Transactional
    public QueueOperationResponse completeService(UUID actorId, UUID sessionId, String outcomeCode) {
        User actor=user(actorId); ServiceSession session=sessions.findByIdForUpdate(sessionId)
                .orElseThrow(()->new ResourceNotFoundException("SERVICE_SESSION_NOT_FOUND"));
        requireScope(session.getQueueTicket().getQueue(),actor);
        if(session.getStatus()!=ServiceSessionStatus.ACTIVE) throw new ResourceConflictException("SERVICE_SESSION_NOT_ACTIVE");
        QueueDesk desk=desks.findByIdForUpdate(session.getDesk().getId()).orElseThrow(); requireDeskActor(desk,actor);
        QueueTicket ticket=ticket(session.getQueueTicket().getId()); Instant now=clock.instant();
        session.setStatus(ServiceSessionStatus.COMPLETED); session.setEndedAt(now); session.setOutcomeCode(clean(outcomeCode)); sessions.save(session);
        ticket.setStatus(QueueTicketStatus.COMPLETED); ticket.setCompletedAt(now); tickets.save(ticket);
        desk.setStatus(QueueDeskStatus.OPEN); desks.save(desk); event(ticket,"SERVICE_COMPLETED",actor,clean(outcomeCode));
        return response(ticket,desk,session,"SERVICE_COMPLETED",false);
    }

    @Transactional
    public QueueOperationResponse noShow(UUID actorId, UUID ticketId) {
        User actor=user(actorId); QueueTicket ticket=ticket(ticketId); requireScope(ticket.getQueue(),actor);
        if(ticket.getStatus()!=QueueTicketStatus.CALLED || ticket.getCalledDesk()==null) throw new ResourceConflictException("QUEUE_TICKET_CANNOT_BE_NO_SHOW");
        QueueDesk desk=desks.findByIdForUpdate(ticket.getCalledDesk().getId()).orElseThrow(); requireDeskActor(desk,actor);
        ticket.setStatus(QueueTicketStatus.NO_SHOW); tickets.save(ticket); event(ticket,"TICKET_NO_SHOW",actor,null);
        return response(ticket,desk,null,"TICKET_NO_SHOW",false);
    }

    @Transactional
    public QueueOperationResponse transfer(UUID actorId, UUID ticketId, UUID destinationQueueId, String reason) {
        if(reason==null||reason.isBlank()) throw new IllegalArgumentException("TRANSFER_REASON_REQUIRED");
        User actor=user(actorId); QueueTicket source=ticket(ticketId); requireScope(source.getQueue(),actor);
        if(source.getStatus()!=QueueTicketStatus.WAITING && source.getStatus()!=QueueTicketStatus.CALLED)
            throw new ResourceConflictException("QUEUE_TICKET_CANNOT_BE_TRANSFERRED");
        MunicipalQueue destination=queue(destinationQueueId); requireScope(destination,actor);
        if(destination.getStatus()!=QueueStatus.OPEN || destination.getId().equals(source.getQueue().getId()))
            throw new ResourceConflictException("DESTINATION_QUEUE_NOT_AVAILABLE");
        LocalDate date=LocalDate.now(clock); int sequence=sequences.next(destination.getId(),date);
        source.setStatus(QueueTicketStatus.TRANSFERRED); tickets.saveAndFlush(source);
        QueueTicket target=tickets.saveAndFlush(QueueTicket.builder().ticketNumber("A%03d".formatted(sequence))
                .queue(destination).businessDate(date).citizenUser(source.getCitizenUser()).appointment(source.getAppointment())
                .sourceTicket(source).department(destination.getDepartment()).sequenceNumber(sequence)
                .priorityClass(source.getPriorityClass()).priorityReason(source.getPriorityReason()).status(QueueTicketStatus.WAITING).build());
        event(source,"TICKET_TRANSFERRED",actor,reason.trim()); event(target,"TICKET_RECEIVED_BY_TRANSFER",actor,reason.trim());
        return response(target,null,null,"TICKET_TRANSFERRED",false);
    }

    private QueueOperationResponse replayCall(IdempotencyRecord record,String fingerprint,UUID deskId){
        if(!MessageDigest.isEqual(record.getRequestFingerprint().getBytes(StandardCharsets.UTF_8),fingerprint.getBytes(StandardCharsets.UTF_8)))
            throw new ResourceConflictException("IDEMPOTENCY_KEY_REUSED");
        if(record.getState()!=IdempotencyState.COMPLETED) throw new ResourceConflictException("QUEUE_CALL_NEXT_IN_PROGRESS");
        QueueDesk desk=desks.findById(deskId).orElseThrow();
        if(record.getResponseResourceId()==null) return response(null,desk,null,"NO_TICKET",true);
        QueueTicket ticket=tickets.findById(record.getResponseResourceId()).orElseThrow(()->new IllegalStateException("Idempotent ticket missing"));
        return response(ticket,desk,null,"TICKET_CALLED",true);
    }
    private IdempotencyRecord claim(User actor,String operation,String key,String fingerprint){return idempotency.saveAndFlush(IdempotencyRecord.builder()
            .id(UUID.randomUUID()).citizenUser(actor).operation(operation).keyHash(hash(key.trim())).requestFingerprint(fingerprint)
            .state(IdempotencyState.IN_PROGRESS).expiresAt(clock.instant().plus(Duration.ofDays(7))).build());}
    private void event(QueueTicket ticket,String type,User actor,String reason){events.save(QueueEvent.builder().id(UUID.randomUUID()).ticket(ticket)
            .eventType(type).actorUser(actor).reason(reason).occurredAt(clock.instant()).build());}
    private MunicipalQueue queue(UUID id){return queues.findByIdForUpdate(id).orElseThrow(()->new ResourceNotFoundException("QUEUE_NOT_FOUND"));}
    private QueueDesk desk(UUID queueId,UUID id){return desks.findByQueueForUpdate(queueId,id).orElseThrow(()->new ResourceNotFoundException("QUEUE_DESK_NOT_FOUND"));}
    private QueueTicket ticket(UUID id){return tickets.findByIdForUpdate(id).orElseThrow(()->new ResourceNotFoundException("QUEUE_TICKET_NOT_FOUND"));}
    private User user(UUID id){return users.findById(id).orElseThrow(()->new ResourceNotFoundException("User not found"));}
    private void requireDeskActor(QueueDesk desk,User actor){if(desk.getCurrentStaffUser()==null||!desk.getCurrentStaffUser().getId().equals(actor.getId()))throw new ResourceConflictException("QUEUE_DESK_NOT_ASSIGNED_TO_STAFF");}
    private void requireScope(MunicipalQueue queue,User actor){if(!staffScopes.existsByQueueAndStaffUser(queue,actor))throw new AccessDeniedException("QUEUE_SCOPE_FORBIDDEN");}
    private QueueOperationResponse response(QueueTicket ticket,QueueDesk desk,ServiceSession session,String outcome,boolean replayed){return new QueueOperationResponse(
            ticket==null?null:ticket.getId(),ticket==null?null:ticket.getTicketNumber(),ticket==null?null:ticket.getStatus(),
            desk==null?null:desk.getId(),desk==null?null:desk.getDisplayName(),session==null?null:session.getId(),outcome,replayed);}
    private void validateKey(String key){if(key==null||key.isBlank()||key.length()>200)throw new IllegalArgumentException("IDEMPOTENCY_KEY_REQUIRED");}
    private String clean(String value){return value==null||value.isBlank()?null:value.trim();}
    private String hash(String value){try{return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8)));}catch(NoSuchAlgorithmException e){throw new IllegalStateException(e);}}
}
