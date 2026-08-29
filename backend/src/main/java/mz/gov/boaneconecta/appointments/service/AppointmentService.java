package mz.gov.boaneconecta.appointments.service;

import mz.gov.boaneconecta.appointments.dto.AppointmentResponse;
import mz.gov.boaneconecta.appointments.entity.Appointment;
import mz.gov.boaneconecta.appointments.entity.AppointmentSlot;
import mz.gov.boaneconecta.appointments.entity.AppointmentStatus;
import mz.gov.boaneconecta.appointments.repository.AppointmentRepository;
import mz.gov.boaneconecta.core.exception.ResourceNotFoundException;
import mz.gov.boaneconecta.departments.entity.Department;
import mz.gov.boaneconecta.users.entity.User;
import mz.gov.boaneconecta.users.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public AppointmentService(AppointmentRepository appointmentRepository, UserRepository userRepository) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
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

    @Transactional(readOnly = true)
    public List<AppointmentResponse> listAdmin(UUID actorId, AppointmentStatus status) {
        User actor = requireUser(actorId);
        List<Appointment> appointments = appointmentRepository.findScopedAgenda(actor, status);
        return appointments.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public AppointmentResponse getAdmin(UUID actorId, UUID appointmentId) {
        User actor = requireUser(actorId);
        return toResponse(appointmentRepository.findScopedById(appointmentId, actor)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found")));
    }

    private User requireUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
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
                slot == null || slot.getService() == null ? null : slot.getService().getId(),
                slot == null || slot.getService() == null ? null : slot.getService().getTitle(),
                slot == null ? null : slot.getLocationCode(),
                slot == null ? null : slot.getLocationName(),
                slot == null ? null : slot.getStartTime(),
                slot == null ? null : slot.getEndTime(),
                department == null ? null : department.getId(),
                department == null ? null : department.getName(),
                appointment.getReason(),
                appointment.getStatus(),
                slot == null ? null : slot.getStatus(),
                appointment.getVersion(),
                appointment.getCreatedAt(),
                appointment.getUpdatedAt());
    }

}
