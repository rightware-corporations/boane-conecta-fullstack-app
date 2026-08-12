package mz.gov.boaneconecta.complaints.service;

import mz.gov.boaneconecta.complaints.dto.AssignComplaintRequest;
import mz.gov.boaneconecta.complaints.dto.ComplaintResponse;
import mz.gov.boaneconecta.complaints.dto.ComplaintStatusHistoryResponse;
import mz.gov.boaneconecta.complaints.dto.CreateComplaintRequest;
import mz.gov.boaneconecta.complaints.dto.UpdateComplaintStatusRequest;
import mz.gov.boaneconecta.complaints.entity.Complaint;
import mz.gov.boaneconecta.complaints.entity.ComplaintStatus;
import mz.gov.boaneconecta.complaints.entity.ComplaintStatusHistory;
import mz.gov.boaneconecta.complaints.repository.ComplaintRepository;
import mz.gov.boaneconecta.complaints.repository.ComplaintStatusHistoryRepository;
import mz.gov.boaneconecta.core.Priority;
import mz.gov.boaneconecta.core.exception.ResourceNotFoundException;
import mz.gov.boaneconecta.users.entity.User;
import mz.gov.boaneconecta.users.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class ComplaintService {
    private static final DateTimeFormatter COMPLAINT_DATE_FORMAT = DateTimeFormatter.BASIC_ISO_DATE;

    private final ComplaintRepository complaintRepository;
    private final ComplaintStatusHistoryRepository statusHistoryRepository;
    private final UserRepository userRepository;

    public ComplaintService(
            ComplaintRepository complaintRepository,
            ComplaintStatusHistoryRepository statusHistoryRepository,
            UserRepository userRepository) {
        this.complaintRepository = complaintRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ComplaintResponse createPublic(CreateComplaintRequest request) {
        Complaint complaint = buildComplaint(null, request);
        complaint = complaintRepository.saveAndFlush(complaint);
        addHistory(complaint, null, ComplaintStatus.OPEN, "Complaint submitted", null);
        return toResponse(complaint, true);
    }

    @Transactional
    public ComplaintResponse createCitizen(UUID citizenUserId, CreateComplaintRequest request) {
        User citizen = requireUser(citizenUserId);
        Complaint complaint = buildComplaint(citizen, request);
        complaint = complaintRepository.saveAndFlush(complaint);
        addHistory(complaint, null, ComplaintStatus.OPEN, "Complaint submitted", citizen);
        return toResponse(complaint, true);
    }

    @Transactional(readOnly = true)
    public List<ComplaintResponse> listCitizen(UUID citizenUserId) {
        User citizen = requireUser(citizenUserId);
        return complaintRepository.findByCitizenUserOrderByCreatedAtDesc(citizen).stream()
                .map(complaint -> toResponse(complaint, false))
                .toList();
    }

    @Transactional(readOnly = true)
    public ComplaintResponse getCitizen(UUID citizenUserId, UUID complaintId) {
        User citizen = requireUser(citizenUserId);
        Complaint complaint = complaintRepository.findByIdAndCitizenUser(complaintId, citizen)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
        return toResponse(complaint, true);
    }

    @Transactional(readOnly = true)
    public List<ComplaintResponse> listAdmin(ComplaintStatus status) {
        List<Complaint> complaints = status == null
                ? complaintRepository.findAllByOrderByCreatedAtDesc()
                : complaintRepository.findByStatusOrderByCreatedAtDesc(status);
        return complaints.stream()
                .map(complaint -> toResponse(complaint, false))
                .toList();
    }

    @Transactional(readOnly = true)
    public ComplaintResponse getAdmin(UUID complaintId) {
        return toResponse(requireComplaint(complaintId), true);
    }

    @Transactional
    public ComplaintResponse assign(UUID complaintId, AssignComplaintRequest request, UUID actorUserId) {
        Complaint complaint = requireComplaint(complaintId);
        User assignee = requireUser(request.assignedToUserId());
        User actor = requireUser(actorUserId);

        complaint.setAssignedToUser(assignee);
        complaint = complaintRepository.saveAndFlush(complaint);
        addHistory(complaint, complaint.getStatus(), complaint.getStatus(),
                "Assigned to " + assignee.getFullName(), actor);
        return toResponse(complaint, true);
    }

    @Transactional
    public ComplaintResponse updateStatus(UUID complaintId, UpdateComplaintStatusRequest request, UUID actorUserId) {
        Complaint complaint = requireComplaint(complaintId);
        User actor = requireUser(actorUserId);
        ComplaintStatus oldStatus = complaint.getStatus();
        ComplaintStatus newStatus = request.status();

        complaint.setStatus(newStatus);
        complaint = complaintRepository.saveAndFlush(complaint);
        addHistory(complaint, oldStatus, newStatus, clean(request.comment()), actor);
        return toResponse(complaint, true);
    }

    private Complaint buildComplaint(User citizen, CreateComplaintRequest request) {
        return Complaint.builder()
                .complaintNumber(generateComplaintNumber())
                .citizenUser(citizen)
                .subject(cleanRequired(request.subject(), "Subject is required"))
                .description(cleanRequired(request.description(), "Description is required"))
                .status(ComplaintStatus.OPEN)
                .priority(request.priority() == null ? Priority.NORMAL : request.priority())
                .build();
    }

    private Complaint requireComplaint(UUID complaintId) {
        return complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
    }

    private User requireUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private void addHistory(
            Complaint complaint,
            ComplaintStatus oldStatus,
            ComplaintStatus newStatus,
            String comment,
            User changedByUser) {
        statusHistoryRepository.saveAndFlush(ComplaintStatusHistory.builder()
                .complaint(complaint)
                .oldStatus(oldStatus)
                .newStatus(newStatus)
                .comment(clean(comment))
                .changedByUser(changedByUser)
                .build());
    }

    private ComplaintResponse toResponse(Complaint complaint, boolean includeHistory) {
        User citizen = complaint.getCitizenUser();
        User assignee = complaint.getAssignedToUser();
        List<ComplaintStatusHistoryResponse> history = includeHistory
                ? statusHistoryRepository.findByComplaintOrderByCreatedAtAsc(complaint).stream()
                        .map(this::toHistoryResponse)
                        .toList()
                : List.of();

        return new ComplaintResponse(
                complaint.getId(),
                complaint.getComplaintNumber(),
                citizen == null ? null : citizen.getId(),
                citizen == null ? null : citizen.getFullName(),
                complaint.getSubject(),
                complaint.getDescription(),
                complaint.getStatus(),
                complaint.getPriority(),
                assignee == null ? null : assignee.getId(),
                assignee == null ? null : assignee.getFullName(),
                history,
                complaint.getCreatedAt(),
                complaint.getUpdatedAt());
    }

    private ComplaintStatusHistoryResponse toHistoryResponse(ComplaintStatusHistory history) {
        User changedBy = history.getChangedByUser();
        return new ComplaintStatusHistoryResponse(
                history.getId(),
                history.getOldStatus(),
                history.getNewStatus(),
                history.getComment(),
                changedBy == null ? null : changedBy.getId(),
                changedBy == null ? null : changedBy.getFullName(),
                history.getCreatedAt());
    }

    private String generateComplaintNumber() {
        String prefix = "CMP-" + LocalDate.now().format(COMPLAINT_DATE_FORMAT) + "-";
        for (int attempt = 0; attempt < 20; attempt++) {
            String candidate = prefix + ThreadLocalRandom.current().nextInt(100000, 999999);
            if (!complaintRepository.existsByComplaintNumber(candidate)) {
                return candidate;
            }
        }
        throw new IllegalStateException("Could not generate unique complaint number");
    }

    private String cleanRequired(String value, String message) {
        String cleaned = clean(value);
        if (cleaned == null) {
            throw new IllegalArgumentException(message);
        }
        return cleaned;
    }

    private String clean(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
