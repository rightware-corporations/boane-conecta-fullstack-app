package mz.gov.boaneconecta.departments.service;

import mz.gov.boaneconecta.core.exception.ResourceConflictException;
import mz.gov.boaneconecta.core.exception.ResourceNotFoundException;
import mz.gov.boaneconecta.core.util.SlugUtils;
import mz.gov.boaneconecta.departments.dto.DepartmentRequest;
import mz.gov.boaneconecta.departments.dto.DepartmentResponse;
import mz.gov.boaneconecta.departments.entity.Department;
import mz.gov.boaneconecta.departments.entity.DepartmentStatus;
import mz.gov.boaneconecta.departments.repository.DepartmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class DepartmentService {
    private static final int MAX_SLUG_LENGTH = 180;

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    @Transactional(readOnly = true)
    public List<DepartmentResponse> listPublic() {
        return departmentRepository.findByStatusOrderByNameAsc(DepartmentStatus.ACTIVE).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public DepartmentResponse getPublicBySlug(String slug) {
        String normalizedSlug = SlugUtils.normalize(slug, MAX_SLUG_LENGTH);
        Department department = departmentRepository
                .findBySlugAndStatus(normalizedSlug, DepartmentStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        return toResponse(department);
    }

    @Transactional(readOnly = true)
    public List<DepartmentResponse> listAdmin() {
        return departmentRepository.findAllByOrderByNameAsc().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public DepartmentResponse create(DepartmentRequest request) {
        String slug = resolveSlug(request.slug(), request.name());
        ensureSlugAvailable(slug, null);

        Department department = Department.builder()
                .name(request.name().trim())
                .slug(slug)
                .description(clean(request.description()))
                .status(request.status() == null ? DepartmentStatus.ACTIVE : request.status())
                .build();
        return toResponse(departmentRepository.saveAndFlush(department));
    }

    @Transactional
    public DepartmentResponse update(UUID id, DepartmentRequest request) {
        Department department = requireDepartment(id);
        String slug = resolveSlug(request.slug(), request.name());
        ensureSlugAvailable(slug, id);

        department.setName(request.name().trim());
        department.setSlug(slug);
        department.setDescription(clean(request.description()));
        if (request.status() != null) {
            department.setStatus(request.status());
        }
        return toResponse(departmentRepository.saveAndFlush(department));
    }

    @Transactional
    public void deactivate(UUID id) {
        Department department = requireDepartment(id);
        department.setStatus(DepartmentStatus.INACTIVE);
        departmentRepository.saveAndFlush(department);
    }

    private Department requireDepartment(UUID id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
    }

    private String resolveSlug(String requestedSlug, String name) {
        String source = requestedSlug == null || requestedSlug.isBlank() ? name : requestedSlug;
        return SlugUtils.normalize(source, MAX_SLUG_LENGTH);
    }

    private void ensureSlugAvailable(String slug, UUID currentId) {
        boolean exists = currentId == null
                ? departmentRepository.existsBySlug(slug)
                : departmentRepository.existsBySlugAndIdNot(slug, currentId);
        if (exists) {
            throw new ResourceConflictException("Department slug already exists: " + slug);
        }
    }

    private DepartmentResponse toResponse(Department department) {
        return new DepartmentResponse(
                department.getId(),
                department.getName(),
                department.getSlug(),
                department.getDescription(),
                department.getStatus(),
                department.getCreatedAt(),
                department.getUpdatedAt());
    }

    private String clean(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
