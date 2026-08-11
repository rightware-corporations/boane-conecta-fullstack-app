package mz.gov.boaneconecta.municipalservices.service;

import mz.gov.boaneconecta.core.exception.ResourceConflictException;
import mz.gov.boaneconecta.core.exception.ResourceNotFoundException;
import mz.gov.boaneconecta.core.util.SlugUtils;
import mz.gov.boaneconecta.departments.entity.Department;
import mz.gov.boaneconecta.departments.repository.DepartmentRepository;
import mz.gov.boaneconecta.municipalservices.dto.MunicipalServiceRequest;
import mz.gov.boaneconecta.municipalservices.dto.MunicipalServiceResponse;
import mz.gov.boaneconecta.municipalservices.dto.ServiceFeeRequest;
import mz.gov.boaneconecta.municipalservices.dto.ServiceFeeResponse;
import mz.gov.boaneconecta.municipalservices.dto.ServiceRequirementRequest;
import mz.gov.boaneconecta.municipalservices.dto.ServiceRequirementResponse;
import mz.gov.boaneconecta.municipalservices.entity.MunicipalService;
import mz.gov.boaneconecta.municipalservices.entity.MunicipalServiceStatus;
import mz.gov.boaneconecta.municipalservices.entity.ServiceFee;
import mz.gov.boaneconecta.municipalservices.entity.ServiceRequirement;
import mz.gov.boaneconecta.municipalservices.repository.MunicipalServiceRepository;
import mz.gov.boaneconecta.municipalservices.repository.ServiceFeeRepository;
import mz.gov.boaneconecta.municipalservices.repository.ServiceRequirementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MunicipalServiceService {
    private static final int MAX_SLUG_LENGTH = 200;

    private final MunicipalServiceRepository municipalServiceRepository;
    private final ServiceRequirementRepository requirementRepository;
    private final ServiceFeeRepository feeRepository;
    private final DepartmentRepository departmentRepository;

    public MunicipalServiceService(
            MunicipalServiceRepository municipalServiceRepository,
            ServiceRequirementRepository requirementRepository,
            ServiceFeeRepository feeRepository,
            DepartmentRepository departmentRepository) {
        this.municipalServiceRepository = municipalServiceRepository;
        this.requirementRepository = requirementRepository;
        this.feeRepository = feeRepository;
        this.departmentRepository = departmentRepository;
    }

    @Transactional(readOnly = true)
    public List<MunicipalServiceResponse> listPublic() {
        return toResponses(municipalServiceRepository
                .findByStatusOrderByTitleAsc(MunicipalServiceStatus.PUBLISHED));
    }

    @Transactional(readOnly = true)
    public MunicipalServiceResponse getPublicBySlug(String slug) {
        String normalizedSlug = SlugUtils.normalize(slug, MAX_SLUG_LENGTH);
        MunicipalService service = municipalServiceRepository
                .findBySlugAndStatus(normalizedSlug, MunicipalServiceStatus.PUBLISHED)
                .orElseThrow(() -> new ResourceNotFoundException("Municipal service not found"));
        return toResponse(
                service,
                requirementRepository.findByServiceIdOrderByCreatedAtAsc(service.getId()),
                feeRepository.findByServiceIdOrderByCreatedAtAsc(service.getId()));
    }

    @Transactional(readOnly = true)
    public List<MunicipalServiceResponse> listAdmin() {
        return toResponses(municipalServiceRepository.findAllByOrderByTitleAsc());
    }

    @Transactional
    public MunicipalServiceResponse create(MunicipalServiceRequest request) {
        String slug = resolveSlug(request.slug(), request.title());
        ensureSlugAvailable(slug, null);

        MunicipalService service = MunicipalService.builder()
                .department(resolveDepartment(request.departmentId()))
                .title(request.title().trim())
                .slug(slug)
                .description(clean(request.description()))
                .processingTime(clean(request.processingTime()))
                .status(request.status() == null ? MunicipalServiceStatus.PUBLISHED : request.status())
                .build();
        service = municipalServiceRepository.saveAndFlush(service);
        return toResponse(service, List.of(), List.of());
    }

    @Transactional
    public MunicipalServiceResponse update(UUID id, MunicipalServiceRequest request) {
        MunicipalService service = requireService(id);
        String slug = resolveSlug(request.slug(), request.title());
        ensureSlugAvailable(slug, id);

        service.setDepartment(resolveDepartment(request.departmentId()));
        service.setTitle(request.title().trim());
        service.setSlug(slug);
        service.setDescription(clean(request.description()));
        service.setProcessingTime(clean(request.processingTime()));
        if (request.status() != null) {
            service.setStatus(request.status());
        }
        service = municipalServiceRepository.saveAndFlush(service);
        return toResponse(
                service,
                requirementRepository.findByServiceIdOrderByCreatedAtAsc(id),
                feeRepository.findByServiceIdOrderByCreatedAtAsc(id));
    }

    @Transactional
    public void archive(UUID id) {
        MunicipalService service = requireService(id);
        service.setStatus(MunicipalServiceStatus.ARCHIVED);
        municipalServiceRepository.saveAndFlush(service);
    }

    @Transactional
    public ServiceRequirementResponse addRequirement(UUID serviceId, ServiceRequirementRequest request) {
        MunicipalService service = requireService(serviceId);
        ServiceRequirement requirement = ServiceRequirement.builder()
                .service(service)
                .title(request.title().trim())
                .description(clean(request.description()))
                .required(request.required() == null || request.required())
                .build();
        return toRequirementResponse(requirementRepository.saveAndFlush(requirement));
    }

    @Transactional(readOnly = true)
    public List<ServiceRequirementResponse> listRequirements(UUID serviceId) {
        requireService(serviceId);
        return requirementRepository.findByServiceIdOrderByCreatedAtAsc(serviceId).stream()
                .map(this::toRequirementResponse)
                .toList();
    }

    @Transactional
    public ServiceRequirementResponse updateRequirement(
            UUID serviceId,
            UUID requirementId,
            ServiceRequirementRequest request) {
        requireService(serviceId);
        ServiceRequirement requirement = requireRequirement(serviceId, requirementId);
        requirement.setTitle(request.title().trim());
        requirement.setDescription(clean(request.description()));
        if (request.required() != null) {
            requirement.setRequired(request.required());
        }
        return toRequirementResponse(requirementRepository.saveAndFlush(requirement));
    }

    @Transactional
    public void deleteRequirement(UUID serviceId, UUID requirementId) {
        requireService(serviceId);
        requirementRepository.delete(requireRequirement(serviceId, requirementId));
        requirementRepository.flush();
    }

    @Transactional
    public ServiceFeeResponse addFee(UUID serviceId, ServiceFeeRequest request) {
        MunicipalService service = requireService(serviceId);
        validateFeeAmount(request);
        ServiceFee fee = ServiceFee.builder()
                .service(service)
                .title(request.title().trim())
                .amount(request.amount())
                .currency(normalizeCurrency(request.currency()))
                .build();
        return toFeeResponse(feeRepository.saveAndFlush(fee));
    }

    @Transactional(readOnly = true)
    public List<ServiceFeeResponse> listFees(UUID serviceId) {
        requireService(serviceId);
        return feeRepository.findByServiceIdOrderByCreatedAtAsc(serviceId).stream()
                .map(this::toFeeResponse)
                .toList();
    }

    @Transactional
    public ServiceFeeResponse updateFee(UUID serviceId, UUID feeId, ServiceFeeRequest request) {
        requireService(serviceId);
        ServiceFee fee = requireFee(serviceId, feeId);
        validateFeeAmount(request);
        fee.setTitle(request.title().trim());
        fee.setAmount(request.amount());
        fee.setCurrency(normalizeCurrency(request.currency()));
        return toFeeResponse(feeRepository.saveAndFlush(fee));
    }

    @Transactional
    public void deleteFee(UUID serviceId, UUID feeId) {
        requireService(serviceId);
        feeRepository.delete(requireFee(serviceId, feeId));
        feeRepository.flush();
    }

    private MunicipalService requireService(UUID id) {
        return municipalServiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Municipal service not found"));
    }

    private ServiceRequirement requireRequirement(UUID serviceId, UUID requirementId) {
        return requirementRepository.findByIdAndServiceId(requirementId, serviceId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Service requirement not found for municipal service"));
    }

    private ServiceFee requireFee(UUID serviceId, UUID feeId) {
        return feeRepository.findByIdAndServiceId(feeId, serviceId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Service fee not found for municipal service"));
    }

    private Department resolveDepartment(UUID departmentId) {
        if (departmentId == null) {
            return null;
        }
        return departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
    }

    private String resolveSlug(String requestedSlug, String title) {
        String source = requestedSlug == null || requestedSlug.isBlank() ? title : requestedSlug;
        return SlugUtils.normalize(source, MAX_SLUG_LENGTH);
    }

    private void ensureSlugAvailable(String slug, UUID currentId) {
        boolean exists = currentId == null
                ? municipalServiceRepository.existsBySlug(slug)
                : municipalServiceRepository.existsBySlugAndIdNot(slug, currentId);
        if (exists) {
            throw new ResourceConflictException("Municipal service slug already exists: " + slug);
        }
    }

    private void validateFeeAmount(ServiceFeeRequest request) {
        if (request.amount() == null || request.amount().signum() < 0) {
            throw new IllegalArgumentException("Fee amount must be greater than or equal to zero");
        }
    }

    private String normalizeCurrency(String currency) {
        return currency == null || currency.isBlank()
                ? "MZN"
                : currency.trim().toUpperCase(Locale.ROOT);
    }

    private List<MunicipalServiceResponse> toResponses(List<MunicipalService> services) {
        if (services.isEmpty()) {
            return List.of();
        }
        List<UUID> serviceIds = services.stream().map(MunicipalService::getId).toList();
        Map<UUID, List<ServiceRequirement>> requirements = requirementRepository
                .findByServiceIdInOrderByCreatedAtAsc(serviceIds).stream()
                .collect(Collectors.groupingBy(item -> item.getService().getId()));
        Map<UUID, List<ServiceFee>> fees = feeRepository
                .findByServiceIdInOrderByCreatedAtAsc(serviceIds).stream()
                .collect(Collectors.groupingBy(item -> item.getService().getId()));

        return services.stream()
                .map(service -> toResponse(
                        service,
                        requirements.getOrDefault(service.getId(), List.of()),
                        fees.getOrDefault(service.getId(), List.of())))
                .toList();
    }

    private MunicipalServiceResponse toResponse(
            MunicipalService service,
            List<ServiceRequirement> requirements,
            List<ServiceFee> fees) {
        Department department = service.getDepartment();
        return new MunicipalServiceResponse(
                service.getId(),
                department == null ? null : department.getId(),
                department == null ? null : department.getName(),
                service.getTitle(),
                service.getSlug(),
                service.getDescription(),
                service.getProcessingTime(),
                service.getStatus(),
                requirements.stream().map(this::toRequirementResponse).toList(),
                fees.stream().map(this::toFeeResponse).toList(),
                service.getCreatedAt(),
                service.getUpdatedAt());
    }

    private ServiceRequirementResponse toRequirementResponse(ServiceRequirement requirement) {
        return new ServiceRequirementResponse(
                requirement.getId(),
                requirement.getService().getId(),
                requirement.getTitle(),
                requirement.getDescription(),
                Boolean.TRUE.equals(requirement.getRequired()),
                requirement.getCreatedAt(),
                requirement.getUpdatedAt());
    }

    private ServiceFeeResponse toFeeResponse(ServiceFee fee) {
        return new ServiceFeeResponse(
                fee.getId(),
                fee.getService().getId(),
                fee.getTitle(),
                fee.getAmount(),
                fee.getCurrency(),
                fee.getCreatedAt(),
                fee.getUpdatedAt());
    }

    private String clean(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
