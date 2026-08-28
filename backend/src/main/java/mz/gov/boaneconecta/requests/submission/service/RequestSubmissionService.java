package mz.gov.boaneconecta.requests.submission.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import mz.gov.boaneconecta.core.Priority;
import mz.gov.boaneconecta.core.exception.ResourceConflictException;
import mz.gov.boaneconecta.core.exception.ResourceNotFoundException;
import mz.gov.boaneconecta.requests.draft.entity.RequestDraft;
import mz.gov.boaneconecta.requests.draft.repository.RequestDraftDocumentRepository;
import mz.gov.boaneconecta.requests.draft.repository.RequestDraftRepository;
import mz.gov.boaneconecta.requests.draft.service.DraftValidationService;
import mz.gov.boaneconecta.requests.draft.service.VersionHeaderParser;
import mz.gov.boaneconecta.requests.entity.*;
import mz.gov.boaneconecta.requests.repository.*;
import mz.gov.boaneconecta.requests.submission.dto.*;
import mz.gov.boaneconecta.requests.submission.entity.*;
import mz.gov.boaneconecta.requests.submission.repository.*;
import mz.gov.boaneconecta.users.entity.User;
import mz.gov.boaneconecta.users.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.HexFormat;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class RequestSubmissionService {
    private static final String OPERATION = "SUBMIT_REQUEST_DRAFT";
    private static final DateTimeFormatter DATE = DateTimeFormatter.BASIC_ISO_DATE;
    private final UserRepository users;
    private final RequestDraftRepository drafts;
    private final RequestDraftDocumentRepository draftDocuments;
    private final CitizenRequestRepository requests;
    private final RequestDocumentsRepository requestDocuments;
    private final RequestStatusHistoryRepository history;
    private final RequestAnswerSnapshotRepository snapshots;
    private final IdempotencyRecordRepository idempotency;
    private final DomainOutboxEventRepository outbox;
    private final DraftValidationService validation;
    private final VersionHeaderParser versionParser;
    private final ObjectMapper mapper;

    public RequestSubmissionService(UserRepository users, RequestDraftRepository drafts,
            RequestDraftDocumentRepository draftDocuments, CitizenRequestRepository requests,
            RequestDocumentsRepository requestDocuments, RequestStatusHistoryRepository history,
            RequestAnswerSnapshotRepository snapshots, IdempotencyRecordRepository idempotency,
            DomainOutboxEventRepository outbox, DraftValidationService validation,
            VersionHeaderParser versionParser, ObjectMapper mapper) {
        this.users = users; this.drafts = drafts; this.draftDocuments = draftDocuments; this.requests = requests;
        this.requestDocuments = requestDocuments; this.history = history; this.snapshots = snapshots;
        this.idempotency = idempotency; this.outbox = outbox; this.validation = validation;
        this.versionParser = versionParser; this.mapper = mapper;
    }

    @Transactional
    public RequestSubmissionResponse submit(UUID userId, UUID draftId, String ifMatch,
            String idempotencyKey, SubmitRequestDraftRequest command) {
        if (idempotencyKey == null || idempotencyKey.isBlank() || idempotencyKey.length() > 200) {
            throw new IllegalArgumentException("A valid Idempotency-Key header is required");
        }
        User user = users.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        String keyHash = sha256(idempotencyKey.trim());
        String fingerprint = sha256(draftId + ":" + command.declarationVersion() + ":" + command.declarationAccepted());
        var previous = idempotency.findByCitizenUserAndOperationAndKeyHash(user, OPERATION, keyHash);
        if (previous.isPresent()) {
            IdempotencyRecord record = previous.get();
            if (!record.getRequestFingerprint().equals(fingerprint)) {
                throw new ResourceConflictException("Idempotency key was already used for a different request");
            }
            if (record.getState() == IdempotencyState.COMPLETED) {
                CitizenRequest existing = requests.findById(record.getResponseResourceId())
                        .orElseThrow(() -> new IllegalStateException("Idempotent response resource is missing"));
                return response(existing, true);
            }
            throw new ResourceConflictException("Submission is already in progress");
        }

        IdempotencyRecord record = idempotency.saveAndFlush(IdempotencyRecord.builder()
                .id(UUID.randomUUID()).citizenUser(user).operation(OPERATION).keyHash(keyHash)
                .requestFingerprint(fingerprint).state(IdempotencyState.IN_PROGRESS)
                .expiresAt(Instant.now().plus(Duration.ofDays(7))).build());

        RequestDraft draft = drafts.findLockedByIdAndCitizenUser(draftId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Request draft not found"));
        if (draft.getVersion() != versionParser.parse(ifMatch)) {
            throw new ResourceConflictException("Request draft was changed; reload it before submitting");
        }
        if (!draft.isEditable(Instant.now())) throw new ResourceConflictException("Request draft is not editable");
        if (!command.declarationVersion().equals(draft.getFormVersion().getDeclarationVersion())) {
            throw new ResourceConflictException("The declaration changed; review and accept its current version");
        }
        var validationResult = validation.inspect(draft);
        if (!validationResult.valid()) throw new ResourceConflictException("Request draft has validation errors");

        Instant now = Instant.now();
        ArrayNode manifest = mapper.createArrayNode();
        draftDocuments.findByDraftAndActiveTrueOrderByCreatedAt(draft).forEach(link -> {
            ObjectNode item = manifest.addObject();
            item.put("requirementKey", link.getRequirementKey());
            item.put("documentId", link.getDocument().getId().toString());
            item.put("version", link.getDocument().getCurrentVersionNumber());
            item.put("sha256", link.getDocument().getSha256());
        });
        RequestAnswerSnapshot snapshot = snapshots.save(RequestAnswerSnapshot.builder()
                .id(UUID.randomUUID()).draft(draft).serviceVersion(draft.getServiceVersion())
                .formVersion(draft.getFormVersion()).answers(draft.getAnswers().deepCopy())
                .eligibility(draft.getEligibilityAnswers().deepCopy()).documentManifest(manifest)
                .declarationVersion(command.declarationVersion()).declarationAcceptedAt(now)
                .schemaChecksum(draft.getFormVersion().getSchemaChecksum()).build());

        CitizenRequest request = requests.saveAndFlush(CitizenRequest.builder()
                .requestNumber(generateReference()).citizenUser(user).service(draft.getService())
                .title(draft.getServiceVersion().getTitle()).description("Pedido submetido pelo formulário digital")
                .status(RequestStatus.SUBMITTED).priority(Priority.NORMAL)
                .submittedAt(LocalDateTime.ofInstant(now, ZoneId.of("Africa/Maputo")))
                .sourceDraft(draft).answerSnapshot(snapshot).declarationVersion(command.declarationVersion())
                .declarationAcceptedAt(now).build());
        draftDocuments.findByDraftAndActiveTrueOrderByCreatedAt(draft).forEach(link ->
                requestDocuments.save(RequestDocuments.builder().request(request).document(link.getDocument()).build()));
        history.save(RequestStatusHistory.builder().request(request).newStatus(RequestStatus.SUBMITTED)
                .comment("Request submitted").changedByUser(user).build());
        draft.markSubmitted(request, now);
        drafts.save(draft);
        ObjectNode event = mapper.createObjectNode();
        event.put("requestId", request.getId().toString());
        event.put("reference", request.getRequestNumber());
        event.put("citizenUserId", userId.toString());
        outbox.save(DomainOutboxEvent.builder().id(UUID.randomUUID()).aggregateType("CitizenRequest")
                .aggregateId(request.getId()).eventType("CitizenRequestSubmitted").payload(event)
                .occurredAt(now).status("PENDING").attemptCount(0).nextAttemptAt(now).build());
        record.complete(request.getId(), request.getRequestNumber(), now);
        idempotency.save(record);
        return response(request, false);
    }

    private RequestSubmissionResponse response(CitizenRequest request, boolean replayed) {
        return new RequestSubmissionResponse(request.getId(), request.getRequestNumber(), request.getStatus(),
                request.getDeclarationAcceptedAt(), replayed);
    }

    private String generateReference() {
        String prefix = "BC-" + LocalDate.now(ZoneId.of("Africa/Maputo")).format(DATE) + "-";
        for (int i = 0; i < 20; i++) {
            String value = prefix + ThreadLocalRandom.current().nextInt(100000, 1000000);
            if (!requests.existsByRequestNumber(value)) return value;
        }
        throw new IllegalStateException("Could not generate unique request number");
    }

    private String sha256(String value) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256")
                    .digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception exception) {
            throw new IllegalStateException("SHA-256 is unavailable", exception);
        }
    }
}
