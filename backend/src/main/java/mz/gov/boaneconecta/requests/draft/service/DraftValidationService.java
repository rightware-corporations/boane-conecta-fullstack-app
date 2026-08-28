package mz.gov.boaneconecta.requests.draft.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import mz.gov.boaneconecta.documents.entity.DocumentStatus;
import mz.gov.boaneconecta.requests.draft.dto.DraftValidationIssue;
import mz.gov.boaneconecta.requests.draft.dto.DraftValidationResponse;
import mz.gov.boaneconecta.requests.draft.entity.RequestDraft;
import mz.gov.boaneconecta.requests.draft.entity.RequestDraftDocument;
import mz.gov.boaneconecta.requests.draft.repository.RequestDraftDocumentRepository;
import mz.gov.boaneconecta.requests.draft.repository.RequestDraftRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class DraftValidationService {
    private static final Pattern EMAIL = Pattern.compile("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");

    private final RequestDraftService draftService;
    private final RequestDraftRepository draftRepository;
    private final RequestDraftDocumentRepository documentRepository;
    private final DynamicAnswerValidator answerValidator;

    public DraftValidationService(
            RequestDraftService draftService,
            RequestDraftRepository draftRepository,
            RequestDraftDocumentRepository documentRepository,
            DynamicAnswerValidator answerValidator) {
        this.draftService = draftService;
        this.draftRepository = draftRepository;
        this.documentRepository = documentRepository;
        this.answerValidator = answerValidator;
    }

    @Transactional
    public DraftValidationResponse validate(UUID citizenUserId, UUID draftId, long expectedVersion) {
        RequestDraft draft = draftService.requireEditableDraft(citizenUserId, draftId, expectedVersion);
        DraftValidationResponse inspected = inspect(draft);
        if (inspected.valid()) {
            draft.markReadyForReview();
            draftRepository.saveAndFlush(draft);
        }
        return new DraftValidationResponse(
                inspected.valid(), inspected.fieldErrors(), inspected.documentErrors(), inspected.globalErrors(),
                draftService.toResponse(draft));
    }

    public DraftValidationResponse inspect(RequestDraft draft) {
        List<DraftValidationIssue> fieldErrors = validateFields(draft);
        List<DraftValidationIssue> documentErrors = validateDocuments(draft);
        List<DraftValidationIssue> globalErrors = validateEligibility(draft);
        boolean valid = fieldErrors.isEmpty() && documentErrors.isEmpty() && globalErrors.isEmpty();
        return new DraftValidationResponse(
                valid,
                List.copyOf(fieldErrors),
                List.copyOf(documentErrors),
                List.copyOf(globalErrors),
                draftService.toResponse(draft));
    }

    private List<DraftValidationIssue> validateFields(RequestDraft draft) {
        List<DraftValidationIssue> errors = new ArrayList<>();
        ObjectNode answers = draft.getAnswers() != null && draft.getAnswers().isObject()
                ? (ObjectNode) draft.getAnswers()
                : com.fasterxml.jackson.databind.node.JsonNodeFactory.instance.objectNode();
        for (JsonNode step : draft.getFormVersion().getSchema().path("steps")) {
            String stepKey = step.path("key").asText();
            for (JsonNode field : step.path("fields")) {
                String fieldKey = field.path("key").asText();
                if (!answerValidator.isVisible(field, answers)) {
                    continue;
                }
                JsonNode value = answers.get(fieldKey);
                if (field.path("required").asBoolean(false) && isEmpty(value)) {
                    errors.add(fieldIssue(stepKey, fieldKey, "REQUIRED", "Preencha este campo."));
                    continue;
                }
                if (value == null || value.isNull()) {
                    continue;
                }
                if (value.isTextual()) {
                    int length = value.asText().length();
                    int minimum = field.path("minLength").asInt(0);
                    int maximum = field.path("maxLength").asInt(Integer.MAX_VALUE);
                    if (length < minimum) {
                        errors.add(fieldIssue(stepKey, fieldKey, "MIN_LENGTH", "O valor é demasiado curto."));
                    }
                    if (length > maximum) {
                        errors.add(fieldIssue(stepKey, fieldKey, "MAX_LENGTH", "O valor excede o limite permitido."));
                    }
                    if ("EMAIL".equals(field.path("type").asText()) && !EMAIL.matcher(value.asText()).matches()) {
                        errors.add(fieldIssue(stepKey, fieldKey, "INVALID_EMAIL", "Introduza um endereço de email válido."));
                    }
                }
            }
        }
        return errors;
    }

    private List<DraftValidationIssue> validateDocuments(RequestDraft draft) {
        List<DraftValidationIssue> errors = new ArrayList<>();
        Map<String, RequestDraftDocument> active = new HashMap<>();
        documentRepository.findByDraftAndActiveTrueOrderByCreatedAt(draft)
                .forEach(link -> active.put(link.getRequirementKey(), link));
        for (JsonNode requirement : draft.getFormVersion().getDocumentRequirements()) {
            String key = requirement.path("key").asText();
            RequestDraftDocument link = active.get(key);
            if (requirement.path("required").asBoolean(false) && link == null) {
                errors.add(new DraftValidationIssue(
                        "documents", null, key, "DOCUMENT_REQUIRED", "Adicione o documento obrigatório."));
            } else if (link != null && link.getDocument().getStatus() != DocumentStatus.VALID) {
                errors.add(new DraftValidationIssue(
                        "documents", null, key, "DOCUMENT_NOT_VALID", "O documento ainda não foi validado."));
            }
        }
        return errors;
    }

    private List<DraftValidationIssue> validateEligibility(RequestDraft draft) {
        if (draft.getFormVersion().getEligibility().isEmpty()) {
            return List.of();
        }
        JsonNode result = draft.getEligibilityResult();
        if (result == null) {
            return List.of(new DraftValidationIssue(
                    "eligibility", null, null, "ELIGIBILITY_REQUIRED", "Conclua a verificação de elegibilidade."));
        }
        if (!result.path("eligible").asBoolean(false)) {
            return List.of(new DraftValidationIssue(
                    "eligibility", null, null, "ELIGIBILITY_NOT_SATISFIED", "Os critérios de elegibilidade não foram satisfeitos."));
        }
        return List.of();
    }

    private DraftValidationIssue fieldIssue(String stepKey, String fieldKey, String code, String message) {
        return new DraftValidationIssue(stepKey, fieldKey, null, code, message);
    }

    private boolean isEmpty(JsonNode value) {
        return value == null || value.isNull()
                || (value.isTextual() && value.asText().isBlank())
                || (value.isArray() && value.isEmpty());
    }
}
