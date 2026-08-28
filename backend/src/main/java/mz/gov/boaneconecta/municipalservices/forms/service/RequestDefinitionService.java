package mz.gov.boaneconecta.municipalservices.forms.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import mz.gov.boaneconecta.core.exception.ResourceNotFoundException;
import mz.gov.boaneconecta.municipalservices.entity.MunicipalService;
import mz.gov.boaneconecta.municipalservices.entity.MunicipalServiceStatus;
import mz.gov.boaneconecta.municipalservices.forms.dto.CreateRequestDefinitionVersionRequest;
import mz.gov.boaneconecta.municipalservices.forms.dto.RequestDefinitionVersionResponse;
import mz.gov.boaneconecta.municipalservices.forms.entity.DefinitionStatus;
import mz.gov.boaneconecta.municipalservices.forms.entity.MunicipalServiceVersion;
import mz.gov.boaneconecta.municipalservices.forms.entity.ServiceFormDefinition;
import mz.gov.boaneconecta.municipalservices.forms.entity.ServiceFormVersion;
import mz.gov.boaneconecta.municipalservices.forms.repository.MunicipalServiceVersionRepository;
import mz.gov.boaneconecta.municipalservices.forms.repository.ServiceFormDefinitionRepository;
import mz.gov.boaneconecta.municipalservices.forms.repository.ServiceFormVersionRepository;
import mz.gov.boaneconecta.municipalservices.repository.MunicipalServiceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;

@Service
public class RequestDefinitionService {
    private final MunicipalServiceRepository serviceRepository;
    private final MunicipalServiceVersionRepository serviceVersionRepository;
    private final ServiceFormDefinitionRepository formDefinitionRepository;
    private final ServiceFormVersionRepository formVersionRepository;
    private final FormDefinitionValidator validator;
    private final ObjectMapper objectMapper;

    public RequestDefinitionService(
            MunicipalServiceRepository serviceRepository,
            MunicipalServiceVersionRepository serviceVersionRepository,
            ServiceFormDefinitionRepository formDefinitionRepository,
            ServiceFormVersionRepository formVersionRepository,
            FormDefinitionValidator validator,
            ObjectMapper objectMapper) {
        this.serviceRepository = serviceRepository;
        this.serviceVersionRepository = serviceVersionRepository;
        this.formDefinitionRepository = formDefinitionRepository;
        this.formVersionRepository = formVersionRepository;
        this.validator = validator;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public RequestDefinitionVersionResponse createDraftVersion(
            UUID serviceId,
            CreateRequestDefinitionVersionRequest request) {
        MunicipalService service = requireService(serviceId);
        if (!"citizen-request".equals(request.definitionKey())) {
            throw new IllegalArgumentException("F3 request definitions must use the citizen-request key");
        }
        validator.validate(request.schema(), request.eligibility(), request.documentRequirements());

        ServiceFormDefinition definition = formDefinitionRepository
                .findByServiceAndDefinitionKey(service, request.definitionKey())
                .orElseGet(() -> formDefinitionRepository.saveAndFlush(ServiceFormDefinition.builder()
                        .service(service)
                        .definitionKey(request.definitionKey())
                        .name(request.name().trim())
                        .build()));

        int nextServiceVersion = Math.toIntExact(serviceVersionRepository.countByService(service) + 1);
        MunicipalServiceVersion serviceVersion = serviceVersionRepository.saveAndFlush(
                MunicipalServiceVersion.builder()
                        .service(service)
                        .versionNumber(nextServiceVersion)
                        .status(DefinitionStatus.DRAFT)
                        .title(service.getTitle())
                        .description(service.getDescription())
                        .processingTime(service.getProcessingTime())
                        .onlineSubmissionEnabled(request.onlineSubmissionEnabled())
                        .build());

        int nextFormVersion = Math.toIntExact(formVersionRepository.countByDefinition(definition) + 1);
        ServiceFormVersion formVersion = formVersionRepository.saveAndFlush(ServiceFormVersion.builder()
                .definition(definition)
                .serviceVersion(serviceVersion)
                .versionNumber(nextFormVersion)
                .status(DefinitionStatus.DRAFT)
                .schema(request.schema().deepCopy())
                .eligibility(request.eligibility().deepCopy())
                .documentRequirements(request.documentRequirements().deepCopy())
                .declarationVersion(request.declarationVersion().trim())
                .declarationText(request.declarationText().trim())
                .schemaChecksum(checksum(request))
                .build());

        return toResponse(formVersion);
    }

    @Transactional
    public RequestDefinitionVersionResponse publish(UUID serviceId, UUID formVersionId) {
        MunicipalService service = requireService(serviceId);
        ServiceFormVersion candidate = formVersionRepository.findById(formVersionId)
                .filter(version -> version.getDefinition().getService().getId().equals(service.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Request definition version not found"));
        if (candidate.getStatus() != DefinitionStatus.DRAFT) {
            throw new IllegalArgumentException("Only a draft request definition can be published");
        }
        validator.validate(candidate.getSchema(), candidate.getEligibility(), candidate.getDocumentRequirements());

        List<ServiceFormVersion> publishedForms = formVersionRepository
                .findAllByDefinitionAndStatus(candidate.getDefinition(), DefinitionStatus.PUBLISHED);
        publishedForms.forEach(ServiceFormVersion::retire);
        formVersionRepository.saveAllAndFlush(publishedForms);

        List<MunicipalServiceVersion> publishedServices = serviceVersionRepository
                .findAllByServiceAndStatus(service, DefinitionStatus.PUBLISHED);
        publishedServices.forEach(MunicipalServiceVersion::retire);
        serviceVersionRepository.saveAllAndFlush(publishedServices);

        Instant now = Instant.now();
        candidate.getServiceVersion().publish(now);
        serviceVersionRepository.saveAndFlush(candidate.getServiceVersion());
        candidate.publish(now);
        return toResponse(formVersionRepository.saveAndFlush(candidate));
    }

    @Transactional(readOnly = true)
    public RequestDefinitionVersionResponse getPublished(UUID serviceId) {
        return toResponse(requirePublishedVersion(serviceId));
    }

    @Transactional(readOnly = true)
    public ServiceFormVersion requirePublishedVersion(UUID serviceId) {
        MunicipalService service = requireService(serviceId);
        ServiceFormDefinition definition = formDefinitionRepository
                .findByServiceAndDefinitionKey(service, "citizen-request")
                .orElseThrow(() -> new ResourceNotFoundException("Digital request definition is not available"));
        ServiceFormVersion version = formVersionRepository
                .findByDefinitionAndStatus(definition, DefinitionStatus.PUBLISHED)
                .filter(candidate -> candidate.getServiceVersion().isOnlineSubmissionEnabled())
                .orElseThrow(() -> new ResourceNotFoundException("Digital request definition is not available"));
        return version;
    }

    private MunicipalService requireService(UUID serviceId) {
        MunicipalService service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Municipal service not found"));
        if (service.getStatus() == MunicipalServiceStatus.ARCHIVED) {
            throw new IllegalArgumentException("Municipal service is archived");
        }
        return service;
    }

    private String checksum(CreateRequestDefinitionVersionRequest request) {
        ObjectNode canonical = objectMapper.createObjectNode();
        canonical.set("schema", request.schema());
        canonical.set("eligibility", request.eligibility());
        canonical.set("documentRequirements", request.documentRequirements());
        canonical.put("declarationVersion", request.declarationVersion().trim());
        canonical.put("declarationText", request.declarationText().trim());
        try {
            byte[] encoded = objectMapper.writeValueAsString(canonical).getBytes(StandardCharsets.UTF_8);
            return "sha256:" + HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(encoded));
        } catch (JsonProcessingException | NoSuchAlgorithmException exception) {
            throw new IllegalStateException("Could not calculate request definition checksum", exception);
        }
    }

    private RequestDefinitionVersionResponse toResponse(ServiceFormVersion version) {
        MunicipalServiceVersion serviceVersion = version.getServiceVersion();
        ServiceFormDefinition definition = version.getDefinition();
        return new RequestDefinitionVersionResponse(
                definition.getService().getId(),
                serviceVersion.getId(),
                serviceVersion.getVersionNumber(),
                definition.getId(),
                version.getId(),
                version.getVersionNumber(),
                version.getStatus(),
                definition.getDefinitionKey(),
                definition.getName(),
                serviceVersion.getTitle(),
                serviceVersion.getDescription(),
                serviceVersion.getProcessingTime(),
                serviceVersion.isOnlineSubmissionEnabled(),
                version.getSchema(),
                version.getEligibility(),
                version.getDocumentRequirements(),
                version.getDeclarationVersion(),
                version.getDeclarationText(),
                version.getSchemaChecksum(),
                version.getPublishedAt());
    }
}
