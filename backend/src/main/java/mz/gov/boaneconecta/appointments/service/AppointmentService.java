package mz.gov.boaneconecta.appointments.service;

import mz.gov.boaneconecta.appointments.dto.AppointmentResponse;
import mz.gov.boaneconecta.appointments.dto.AppointmentSlotResponse;
import mz.gov.boaneconecta.appointments.dto.ChangeAppointmentRequest;
import mz.gov.boaneconecta.appointments.dto.CreateAppointmentRequest;
import mz.gov.boaneconecta.appointments.entity.Appointment;
import mz.gov.boaneconecta.appointments.entity.AppointmentSlot;
import mz.gov.boaneconecta.appointments.entity.AppointmentStatus;
import mz.gov.boaneconecta.appointments.entity.SlotStatus;
import mz.gov.boaneconecta.appointments.repository.AppointmentRepository;
import mz.gov.boaneconecta.appointments.repository.AppointmentSlotRepository;
import mz.gov.boaneconecta.core.exception.ResourceConflictException;
import mz.gov.boaneconecta.core.exception.ResourceNotFoundException;
import mz.gov.boaneconecta.departments.entity.Department;
import mz.gov.boaneconecta.users.entity.User;
import mz.gov.boaneconecta.users.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class AppointmentService {
    private static final DateTimeFormatter APPOINTMENT_DATE_FORMAT = DateTimeFormatter.BASIC_ISO_DATE;

    private final AppointmentRepository appointmentRepository;
    private final AppointmentSlotRepository appointmentSlotRepository;
    private final UserRepository userRepository;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            AppointmentSlotRepository appointmentSlotRepository,
            UserRepository userRepository) {
        this.appointmentRepository = appointmentRepository;
        this.appointmentSlotRepository = appointmentSlotRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<AppointmentSlotResponse> listAvailableSlots() {
        LocalDateTime now = LocalDateTime.now();
        return appointmentSlotRepository.findAll().stream()
                .filter(slot -> slot.getStatus() == SlotStatus.AVAILABLE)
                .filter(slot -> slot.getStartTime() != null && slot.getStartTime().isAfter(now))
                .sorted(Comparator.comparing(AppointmentSlot::getStartTime))
                .map(this::toSlotResponse)
                .toList();
    }

    @Transactional
    public AppointmentResponse create(UUID citizenUserId, CreateAppointmentRequest request) {
        User citizen = requireUser(citizenUserId);
        if (request.slotId() == null) {
            throw new IllegalArgumentException("Appointment slot is required");
        }
        AppointmentSlot slot = appointmentSlotRepository.findById(request.slotId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment slot not found"));
        validateBookableSlot(slot);

        Appointment appointment = Appointment.builder()
                .appointmentNumber(generateAppointmentNumber())
                .citizenUser(citizen)
                .slot(slot)
                .reason(clean(request.reason()))
                .status(AppointmentStatus.SCHEDULED)
                .build();

        slot.setStatus(SlotStatus.BOOKED);
        appointmentSlotRepository.saveAndFlush(slot);
        return toResponse(appointmentRepository.saveAndFlush(appointment));
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> listCitizen(UUID citizenUserId) {
        User citizen = requireUser(citizenUserId);
        return appointmentRepository.findByCitizenUserOrderByCreatedAtDesc(citizen).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AppointmentResponse getCitizen(UUID citizenUserId, UUID appointmentId) {
        User citizen = requireUser(citizenUserId);
        Appointment appointment = appointmentRepository.findByIdAndCitizenUser(appointmentId, citizen)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        return toResponse(appointment);
    }

    @Transactional
    public AppointmentResponse cancelCitizen(UUID citizenUserId, UUID appointmentId) {
        User citizen = requireUser(citizenUserId);
        Appointment appointment = appointmentRepository.findByIdAndCitizenUser(appointmentId, citizen)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        if (appointment.getStatus() == AppointmentStatus.COMPLETED || appointment.getStatus() == AppointmentStatus.NO_SHOW) {
            throw new ResourceConflictException("Appointment can no longer be cancelled");
        }
        appointment.setStatus(AppointmentStatus.CANCELLED);
        AppointmentSlot slot = appointment.getSlot();
        if (slot != null && slot.getStartTime() != null && slot.getStartTime().isAfter(LocalDateTime.now())) {
            slot.setStatus(SlotStatus.AVAILABLE);
            appointmentSlotRepository.saveAndFlush(slot);
        }
        return toResponse(appointmentRepository.saveAndFlush(appointment));
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> listAdmin(AppointmentStatus status) {
        List<Appointment> appointments = status == null
                ? appointmentRepository.findAllByOrderByCreatedAtDesc()
                : appointmentRepository.findByStatusOrderByCreatedAtDesc(status);
        return appointments.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public AppointmentResponse getAdmin(UUID appointmentId) {
        return toResponse(requireAppointment(appointmentId));
    }

    @Transactional
    public AppointmentResponse changeStatus(UUID appointmentId, ChangeAppointmentRequest request) {
        Appointment appointment = requireAppointment(appointmentId);
        AppointmentStatus newStatus = parseStatus(request.status());
        appointment.setStatus(newStatus);

        AppointmentSlot slot = appointment.getSlot();
        if (slot != null) {
            if (newStatus == AppointmentStatus.CANCELLED) {
                slot.setStatus(SlotStatus.AVAILABLE);
            } else if (newStatus == AppointmentStatus.COMPLETED || newStatus == AppointmentStatus.NO_SHOW) {
                slot.setStatus(SlotStatus.CLOSED);
            } else {
                slot.setStatus(SlotStatus.BOOKED);
            }
            appointmentSlotRepository.saveAndFlush(slot);
        }

        return toResponse(appointmentRepository.saveAndFlush(appointment));
    }

    private void validateBookableSlot(AppointmentSlot slot) {
        if (slot.getStatus() != SlotStatus.AVAILABLE) {
            throw new ResourceConflictException("Appointment slot is not available");
        }
        if (slot.getStartTime() == null || !slot.getStartTime().isAfter(LocalDateTime.now())) {
            throw new IllegalArgumentException("Appointment slot must be in the future");
        }
        if (slot.getEndTime() == null || !slot.getEndTime().isAfter(slot.getStartTime())) {
            throw new IllegalArgumentException("Appointment slot end time is invalid");
        }
    }

    private Appointment requireAppointment(UUID appointmentId) {
        return appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
    }

    private User requireUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private AppointmentStatus parseStatus(String status) {
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Appointment status is required");
        }
        try {
            return AppointmentStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException("Invalid appointment status");
        }
    }

    private AppointmentResponse toResponse(Appointment appointment) {
        User citizen = appointment.getCitizenUser();
        AppointmentSlot slot = appointment.getSlot();
        Department department = slot == null ? null : slot.getDepartment();
        return new AppointmentResponse(
                appointment.getId(),
                appointment.getAppointmentNumber(),
                citizen == null ? null : citizen.getId(),
                citizen == null ? null : citizen.getFullName(),
                slot == null ? null : slot.getId(),
                slot == null ? null : slot.getStartTime(),
                slot == null ? null : slot.getEndTime(),
                department == null ? null : department.getId(),
                department == null ? null : department.getName(),
                appointment.getReason(),
                appointment.getStatus(),
                slot == null ? null : slot.getStatus(),
                appointment.getCreatedAt(),
                appointment.getUpdatedAt());
    }

    private AppointmentSlotResponse toSlotResponse(AppointmentSlot slot) {
        Department department = slot.getDepartment();
        return new AppointmentSlotResponse(
                slot.getId(),
                department == null ? null : department.getId(),
                department == null ? null : department.getName(),
                slot.getStartTime(),
                slot.getEndTime(),
                slot.getCapacity(),
                slot.getStatus());
    }

    private String generateAppointmentNumber() {
        String prefix = "APT-" + LocalDate.now().format(APPOINTMENT_DATE_FORMAT) + "-";
        for (int attempt = 0; attempt < 20; attempt++) {
            String candidate = prefix + ThreadLocalRandom.current().nextInt(100000, 999999);
            if (!appointmentRepository.existsByAppointmentNumber(candidate)) {
                return candidate;
            }
        }
        throw new IllegalStateException("Could not generate unique appointment number");
    }

    private String clean(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
