package mz.gov.boaneconecta.requests.service;

import mz.gov.boaneconecta.core.Priority;
import mz.gov.boaneconecta.core.exception.ResourceNotFoundException;
import mz.gov.boaneconecta.municipalservices.entity.MunicipalService;
import mz.gov.boaneconecta.municipalservices.entity.MunicipalServiceStatus;
import mz.gov.boaneconecta.municipalservices.repository.MunicipalServiceRepository;
import mz.gov.boaneconecta.requests.dto.AssignRequestRequest;
import mz.gov.boaneconecta.requests.dto.CitizenRequestResponse;
import mz.gov.boaneconecta.requests.dto.CreateCitizenRequestRequest;
import mz.gov.boaneconecta.requests.dto.RequestStatusHistoryResponse;
import mz.gov.boaneconecta.requests.dto.UpdateRequestStatusRequest;
import mz.gov.boaneconecta.requests.dto.CitizenRequestDetailResponse;
import mz.gov.boaneconecta.requests.dto.CitizenSafeTimelineEntry;
import mz.gov.boaneconecta.requests.dto.CitizenSafeDocumentSummary;
import mz.gov.boaneconecta.requests.entity.CitizenRequest;
import mz.gov.boaneconecta.requests.entity.RequestStatus;
import mz.gov.boaneconecta.requests.entity.RequestStatusHistory;
import mz.gov.boaneconecta.requests.repository.CitizenRequestRepository;
import mz.gov.boaneconecta.requests.repository.RequestStatusHistoryRepository;
import mz.gov.boaneconecta.users.entity.User;
import mz.gov.boaneconecta.users.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class CitizenRequestService {
    private static final DateTimeFormatter REQUEST_DATE_FORMAT = DateTimeFormatter.BASIC_ISO_DATE;

    private final CitizenRequestRepository citizenRequestRepository;
    private final RequestStatusHistoryRepository statusHistoryRepository;
    private final UserRepository userRepository;
    private final MunicipalServiceRepository municipalServiceRepository;
    private final mz.gov.boaneconecta.requests.repository.RequestDocumentsRepository requestDocumentsRepository;

    public CitizenRequestService(
            CitizenRequestRepository citizenRequestRepository,
            RequestStatusHistoryRepository statusHistoryRepository,
            UserRepository userRepository,
            MunicipalServiceRepository municipalServiceRepository,
            mz.gov.boaneconecta.requests.repository.RequestDocumentsRepository requestDocumentsRepository) {
        this.citizenRequestRepository = citizenRequestRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.userRepository = userRepository;
        this.municipalServiceRepository = municipalServiceRepository;
        this.requestDocumentsRepository = requestDocumentsRepository;
    }

    @Transactional
    public CitizenRequestResponse create(UUID citizenUserId, CreateCitizenRequestRequest request) {
        User citizen = requireUser(citizenUserId);
        MunicipalService service = resolveService(request.serviceId());

        CitizenRequest citizenRequest = CitizenRequest.builder()
                .requestNumber(generateRequestNumber())
                .citizenUser(citizen)
                .service(service)
                .title(cleanRequired(request.title()))
                .description(clean(request.description()))
                .status(RequestStatus.SUBMITTED)
                .priority(Priority.NORMAL)
                .submittedAt(LocalDateTime.now())
                .build();

        citizenRequest = citizenRequestRepository.saveAndFlush(citizenRequest);
        addHistory(citizenRequest, null, RequestStatus.SUBMITTED, "Request submitted", citizen);
        return toResponse(citizenRequest, true);
    }

    @Transactional(readOnly = true)
    public List<CitizenRequestResponse> listCitizen(UUID citizenUserId) {
        User citizen = requireUser(citizenUserId);
        return citizenRequestRepository.findByCitizenUserOrderByCreatedAtDesc(citizen).stream()
                .map(request -> toResponse(request, false))
                .toList();
    }

    @Transactional(readOnly = true)
    public CitizenRequestResponse getCitizen(UUID citizenUserId, UUID requestId) {
        User citizen = requireUser(citizenUserId);
        CitizenRequest request = citizenRequestRepository.findByIdAndCitizenUser(requestId, citizen)
                .orElseThrow(() -> new ResourceNotFoundException("Citizen request not found"));
        return toResponse(request, true);
    }

    @Transactional(readOnly = true)
    public CitizenRequestDetailResponse getCitizenSafeDetail(UUID citizenUserId, UUID requestId) {
        User citizen = requireUser(citizenUserId);
        CitizenRequest request = citizenRequestRepository.findByIdAndCitizenUser(requestId, citizen)
                .orElseThrow(() -> new ResourceNotFoundException("Citizen request not found"));
        MunicipalService service = request.getService();
        List<CitizenSafeTimelineEntry> timeline = statusHistoryRepository.findByRequestOrderByCreatedAtAsc(request)
                .stream().map(item -> new CitizenSafeTimelineEntry(
                        item.getNewStatus(), statusLabel(item.getNewStatus()), item.getCreatedAt())).toList();
        List<CitizenSafeDocumentSummary> documents = requestDocumentsRepository.findByRequest(request).stream()
                .map(link -> new CitizenSafeDocumentSummary(link.getDocument().getId(), link.getDocument().getTitle(),
                        link.getDocument().getFileName(), link.getDocument().getStatus())).toList();
        return new CitizenRequestDetailResponse(request.getId(), request.getRequestNumber(),
                service == null ? null : service.getId(), service == null ? null : service.getTitle(),
                request.getTitle(), request.getStatus(), statusLabel(request.getStatus()), nextAction(request.getStatus()),
                request.getSubmittedAt(), timeline, documents, availableActions(request.getStatus()));
    }

    private String statusLabel(RequestStatus status) {
        return switch (status) {
            case DRAFT -> "Rascunho";
            case SUBMITTED -> "Submetido";
            case UNDER_REVIEW -> "Em análise";
            case WAITING_PAYMENT -> "A aguardar pagamento";
            case APPROVED -> "Aprovado";
            case REJECTED -> "Rejeitado";
            case CANCELLED -> "Cancelado";
            case COMPLETED -> "Concluído";
        };
    }

    private String nextAction(RequestStatus status) {
        return switch (status) {
            case SUBMITTED, UNDER_REVIEW -> "Aguarde a análise do Município de Boane.";
            case WAITING_PAYMENT -> "Consulte as instruções de pagamento associadas ao pedido.";
            case APPROVED, COMPLETED -> "O pedido não exige nenhuma ação adicional.";
            case REJECTED -> "Consulte a comunicação oficial recebida sobre o pedido.";
            case CANCELLED -> "Este pedido foi cancelado.";
            case DRAFT -> "Conclua e submeta o pedido.";
        };
    }

    private List<String> availableActions(RequestStatus status) {
        return status == RequestStatus.SUBMITTED ? List.of("VIEW", "CANCEL_IF_ALLOWED") : List.of("VIEW");
    }

    @Transactional(readOnly = true)
    public List<CitizenRequestResponse> listAdmin(RequestStatus status) {
        List<CitizenRequest> requests = status == null
                ? citizenRequestRepository.findAllByOrderByCreatedAtDesc()
                : citizenRequestRepository.findByStatusOrderByCreatedAtDesc(status);
        return requests.stream()
                .map(request -> toResponse(request, false))
                .toList();
    }

    @Transactional(readOnly = true)
    public CitizenRequestResponse getAdmin(UUID requestId) {
        return toResponse(requireRequest(requestId), true);
    }

    @Transactional
    public CitizenRequestResponse assign(UUID requestId, AssignRequestRequest request, UUID actorUserId) {
        CitizenRequest citizenRequest = requireRequest(requestId);
        User assignee = requireUser(request.assignedToUserId());
        User actor = requireUser(actorUserId);

        citizenRequest.setAssignedToUser(assignee);
        citizenRequest = citizenRequestRepository.saveAndFlush(citizenRequest);
        addHistory(citizenRequest, citizenRequest.getStatus(), citizenRequest.getStatus(),
                "Assigned to " + assignee.getFullName(), actor);
        return toResponse(citizenRequest, true);
    }

    @Transactional
    public CitizenRequestResponse updateStatus(UUID requestId, UpdateRequestStatusRequest request, UUID actorUserId) {
        CitizenRequest citizenRequest = requireRequest(requestId);
        User actor = requireUser(actorUserId);
        RequestStatus oldStatus = citizenRequest.getStatus();
        RequestStatus newStatus = request.status();

        citizenRequest.setStatus(newStatus);
        if (newStatus == RequestStatus.COMPLETED || newStatus == RequestStatus.APPROVED || newStatus == RequestStatus.REJECTED || newStatus == RequestStatus.CANCELLED) {
            citizenRequest.setCompletedAt(LocalDateTime.now());
        } else {
            citizenRequest.setCompletedAt(null);
        }

        citizenRequest = citizenRequestRepository.saveAndFlush(citizenRequest);
        addHistory(citizenRequest, oldStatus, newStatus, clean(request.comment()), actor);
        return toResponse(citizenRequest, true);
    }

    private MunicipalService resolveService(UUID serviceId) {
        if (serviceId == null) {
            return null;
        }
        MunicipalService service = municipalServiceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Municipal service not found"));
        if (service.getStatus() == MunicipalServiceStatus.ARCHIVED) {
            throw new IllegalArgumentException("Municipal service is archived");
        }
        return service;
    }

    private CitizenRequest requireRequest(UUID requestId) {
        return citizenRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Citizen request not found"));
    }

    private User requireUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private void addHistory(
            CitizenRequest request,
            RequestStatus oldStatus,
            RequestStatus newStatus,
            String comment,
            User changedByUser) {
        statusHistoryRepository.saveAndFlush(RequestStatusHistory.builder()
                .request(request)
                .oldStatus(oldStatus)
                .newStatus(newStatus)
                .comment(clean(comment))
                .changedByUser(changedByUser)
                .build());
    }

    private CitizenRequestResponse toResponse(CitizenRequest request, boolean includeHistory) {
        User citizen = request.getCitizenUser();
        MunicipalService service = request.getService();
        User assignee = request.getAssignedToUser();
        List<RequestStatusHistoryResponse> history = includeHistory
                ? statusHistoryRepository.findByRequestOrderByCreatedAtAsc(request).stream()
                        .map(this::toHistoryResponse)
                        .toList()
                : List.of();

        return new CitizenRequestResponse(
                request.getId(),
                request.getRequestNumber(),
                citizen == null ? null : citizen.getId(),
                citizen == null ? null : citizen.getFullName(),
                service == null ? null : service.getId(),
                service == null ? null : service.getTitle(),
                request.getTitle(),
                request.getDescription(),
                request.getStatus(),
                request.getPriority(),
                request.getSubmittedAt(),
                request.getCompletedAt(),
                assignee == null ? null : assignee.getId(),
                assignee == null ? null : assignee.getFullName(),
                history,
                request.getCreatedAt(),
                request.getUpdatedAt());
    }

    private RequestStatusHistoryResponse toHistoryResponse(RequestStatusHistory history) {
        User changedBy = history.getChangedByUser();
        return new RequestStatusHistoryResponse(
                history.getId(),
                history.getOldStatus(),
                history.getNewStatus(),
                history.getComment(),
                changedBy == null ? null : changedBy.getId(),
                changedBy == null ? null : changedBy.getFullName(),
                history.getCreatedAt());
    }

    private String generateRequestNumber() {
        String prefix = "BC-" + LocalDate.now().format(REQUEST_DATE_FORMAT) + "-";
        for (int attempt = 0; attempt < 20; attempt++) {
            String candidate = prefix + ThreadLocalRandom.current().nextInt(100000, 999999);
            if (!citizenRequestRepository.existsByRequestNumber(candidate)) {
                return candidate;
            }
        }
        throw new IllegalStateException("Could not generate unique request number");
    }

    private String cleanRequired(String value) {
        String cleaned = clean(value);
        if (cleaned == null) {
            throw new IllegalArgumentException("Title is required");
        }
        return cleaned;
    }

    private String clean(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
