package mz.gov.boaneconecta.districts.service;

import mz.gov.boaneconecta.core.exception.ResourceConflictException;
import mz.gov.boaneconecta.core.exception.ResourceNotFoundException;
import mz.gov.boaneconecta.core.util.SlugUtils;
import mz.gov.boaneconecta.districts.dto.DistrictRequest;
import mz.gov.boaneconecta.districts.dto.DistrictResponse;
import mz.gov.boaneconecta.districts.entity.District;
import mz.gov.boaneconecta.districts.entity.DistrictStatus;
import mz.gov.boaneconecta.districts.repository.DistrictRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class DistrictService {
    private static final int MAX_SLUG_LENGTH = 180;

    private final DistrictRepository districtRepository;

    public DistrictService(DistrictRepository districtRepository) {
        this.districtRepository = districtRepository;
    }

    @Transactional(readOnly = true)
    public List<DistrictResponse> listPublic() {
        return districtRepository.findByStatusOrderByNameAsc(DistrictStatus.ACTIVE).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public DistrictResponse getPublicBySlug(String slug) {
        String normalizedSlug = SlugUtils.normalize(slug, MAX_SLUG_LENGTH);
        District district = districtRepository.findBySlugAndStatus(normalizedSlug, DistrictStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("District not found"));
        return toResponse(district);
    }

    @Transactional(readOnly = true)
    public List<DistrictResponse> listAdmin() {
        return districtRepository.findAllByOrderByNameAsc().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public DistrictResponse create(DistrictRequest request) {
        String slug = resolveSlug(request.slug(), request.name());
        ensureSlugAvailable(slug, null);

        District district = District.builder()
                .name(request.name().trim())
                .slug(slug)
                .description(clean(request.description()))
                .status(request.status() == null ? DistrictStatus.ACTIVE : request.status())
                .build();
        return toResponse(districtRepository.saveAndFlush(district));
    }

    @Transactional
    public DistrictResponse update(UUID id, DistrictRequest request) {
        District district = requireDistrict(id);
        String slug = resolveSlug(request.slug(), request.name());
        ensureSlugAvailable(slug, id);

        district.setName(request.name().trim());
        district.setSlug(slug);
        district.setDescription(clean(request.description()));
        if (request.status() != null) {
            district.setStatus(request.status());
        }
        return toResponse(districtRepository.saveAndFlush(district));
    }

    @Transactional
    public void deactivate(UUID id) {
        District district = requireDistrict(id);
        district.setStatus(DistrictStatus.INACTIVE);
        districtRepository.saveAndFlush(district);
    }

    private District requireDistrict(UUID id) {
        return districtRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("District not found"));
    }

    private String resolveSlug(String requestedSlug, String name) {
        String source = requestedSlug == null || requestedSlug.isBlank() ? name : requestedSlug;
        return SlugUtils.normalize(source, MAX_SLUG_LENGTH);
    }

    private void ensureSlugAvailable(String slug, UUID currentId) {
        boolean exists = currentId == null
                ? districtRepository.existsBySlug(slug)
                : districtRepository.existsBySlugAndIdNot(slug, currentId);
        if (exists) {
            throw new ResourceConflictException("District slug already exists: " + slug);
        }
    }

    private DistrictResponse toResponse(District district) {
        return new DistrictResponse(
                district.getId(),
                district.getName(),
                district.getSlug(),
                district.getDescription(),
                district.getStatus(),
                district.getCreatedAt(),
                district.getUpdatedAt());
    }

    private String clean(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
