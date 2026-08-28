package mz.gov.boaneconecta.requests.draft.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import mz.gov.boaneconecta.core.exception.ResourceConflictException;
import mz.gov.boaneconecta.core.exception.ResourceNotFoundException;
import mz.gov.boaneconecta.municipalservices.forms.entity.ServiceFormVersion;
import mz.gov.boaneconecta.municipalservices.forms.service.RequestDefinitionService;
import mz.gov.boaneconecta.requests.draft.dto.CreateRequestDraftRequest;
import mz.gov.boaneconecta.requests.draft.dto.RequestDraftResponse;
import mz.gov.boaneconecta.requests.draft.entity.RequestDraft;
import mz.gov.boaneconecta.requests.draft.entity.RequestDraftStatus;
import mz.gov.boaneconecta.requests.draft.repository.RequestDraftRepository;
import mz.gov.boaneconecta.users.entity.User;
import mz.gov.boaneconecta.users.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class RequestDraftService {
    private static final List<RequestDraftStatus> RESUMABLE = List.of(
            RequestDraftStatus.IN_PROGRESS,
            RequestDraftStatus.READY_FOR_REVIEW);

    private final RequestDraftRepository draftRepository;
    private final UserRepository userRepository;
    private final RequestDefinitionService definitionService;
    private final ObjectMapper objectMapper;
    private final DynamicAnswerValidator answerValidator;
    private final EligibilityService eligibilityService;
    private final Duration draftTtl;

    public RequestDraftService(
            RequestDraftRepository draftRepository,
            UserRepository userRepository,
            RequestDefinitionService definitionService,
            ObjectMapper objectMapper,
            DynamicAnswerValidator answerValidator,
            EligibilityService eligibilityService,
            @Value("${app.requests.draft-ttl-days:90}") long draftTtlDays) {
        this.draftRepository = draftRepository;
        this.userRepository = userRepository;
        this.definitionService = definitionService;
        this.objectMapper = objectMapper;
        this.answerValidator = answerValidator;
        this.eligibilityService = eligibilityService;
        this.draftTtl = Duration.ofDays(draftTtlDays);
    }

    @Transactional
    public RequestDraftResponse createOrResume(UUID citizenUserId, CreateRequestDraftRequest request) {
        User citizen = requireUser(citizenUserId);
        ServiceFormVersion formVersion = definitionService.requirePublishedVersion(request.serviceId());
        Instant now = Instant.now();

        if (request.shouldResumeExisting()) {
            RequestDraft existing = draftRepository
                    .findByCitizenUserAndServiceAndStatusInOrderByUpdatedAtDesc(
                            citizen,
                            formVersion.getDefinition().getService(),
                            RESUMABLE)
                    .stream()
                    .filter(draft -> draft.isEditable(now))
                    .filter(draft -> draft.getFormVersion().getId().equals(formVersion.getId()))
                    .findFirst()
                    .orElse(null);
            if (existing != null) {
                return toResponse(existing);
            }
        }

        String firstStep = formVersion.getSchema().path("steps").path(0).path("key").asText(null);
        RequestDraft draft = RequestDraft.builder()
                .citizenUser(citizen)
                .service(formVersion.getDefinition().getService())
                .serviceVersion(formVersion.getServiceVersion())
                .formVersion(formVersion)
                .status(RequestDraftStatus.IN_PROGRESS)
                .currentStepKey(firstStep)
                .answers(objectMapper.createObjectNode())
                .eligibilityAnswers(objectMapper.createObjectNode())
                .version(0)
                .expiresAt(now.plus(draftTtl))
                .build();
        return toResponse(draftRepository.saveAndFlush(draft));
    }

    @Transactional(readOnly = true)
    public RequestDraftResponse get(UUID citizenUserId, UUID draftId) {
        return toResponse(requireOwnedDraft(citizenUserId, draftId));
    }

    @Transactional
    public RequestDraftResponse saveAnswers(
            UUID citizenUserId,
            UUID draftId,
            long expectedVersion,
            String stepKey,
            com.fasterxml.jackson.databind.JsonNode answers) {
        RequestDraft draft = requireEditableDraft(citizenUserId, draftId, expectedVersion);
        if (!hasStep(draft.getFormVersion().getSchema(), stepKey)) {
            throw new IllegalArgumentException("Unknown form step: " + stepKey);
        }
        ObjectNode merged = answerValidator.mergePartial(
                draft.getFormVersion().getSchema(),
                draft.getAnswers(),
                answers);
        draft.saveAnswers(merged, stepKey.trim(), Instant.now());
        return toResponse(draftRepository.saveAndFlush(draft));
    }

    @Transactional
    public RequestDraftResponse saveEligibility(
            UUID citizenUserId,
            UUID draftId,
            long expectedVersion,
            com.fasterxml.jackson.databind.JsonNode answers) {
        RequestDraft draft = requireEditableDraft(citizenUserId, draftId, expectedVersion);
        ObjectNode result = eligibilityService.evaluate(draft.getFormVersion().getEligibility(), answers);
        draft.saveEligibility(answers.deepCopy(), result, Instant.now());
        return toResponse(draftRepository.saveAndFlush(draft));
    }

    @Transactional(readOnly = true)
    public RequestDraft requireOwnedDraft(UUID citizenUserId, UUID draftId) {
        User citizen = requireUser(citizenUserId);
        return draftRepository.findByIdAndCitizenUser(draftId, citizen)
                .orElseThrow(() -> new ResourceNotFoundException("Request draft not found"));
    }

    public RequestDraft requireEditableDraft(UUID citizenUserId, UUID draftId, long expectedVersion) {
        RequestDraft draft = requireOwnedDraft(citizenUserId, draftId);
        Instant now = Instant.now();
        if (draft.getExpiresAt().isBefore(now) && draft.getStatus() != RequestDraftStatus.SUBMITTED) {
            draft.expire();
            draftRepository.saveAndFlush(draft);
            throw new ResourceConflictException("Request draft has expired");
        }
        if (!draft.isEditable(now)) {
            throw new ResourceConflictException("Request draft is not editable");
        }
        if (draft.getVersion() != expectedVersion) {
            throw new ResourceConflictException("Request draft version conflict");
        }
        return draft;
    }

    private boolean hasStep(com.fasterxml.jackson.databind.JsonNode schema, String stepKey) {
        for (com.fasterxml.jackson.databind.JsonNode step : schema.path("steps")) {
            if (stepKey.equals(step.path("key").asText())) {
                return true;
            }
        }
        return false;
    }

    private User requireUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public RequestDraftResponse toResponse(RequestDraft draft) {
        return new RequestDraftResponse(
                draft.getId(),
                draft.getService().getId(),
                draft.getServiceVersion().getId(),
                draft.getFormVersion().getId(),
                draft.getStatus(),
                draft.getCurrentStepKey(),
                draft.getAnswers(),
                draft.getEligibilityAnswers(),
                draft.getEligibilityResult(),
                draft.getVersion(),
                draft.getLastSavedAt(),
                draft.getExpiresAt(),
                draft.getSubmittedRequest() == null ? null : draft.getSubmittedRequest().getId(),
                draft.getCreatedAt(),
                draft.getUpdatedAt());
    }
}
