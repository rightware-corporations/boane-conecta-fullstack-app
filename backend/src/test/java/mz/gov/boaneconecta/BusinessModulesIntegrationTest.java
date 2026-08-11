package mz.gov.boaneconecta;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import mz.gov.boaneconecta.core.exception.ResourceConflictException;
import mz.gov.boaneconecta.core.exception.ResourceNotFoundException;
import mz.gov.boaneconecta.departments.dto.DepartmentRequest;
import mz.gov.boaneconecta.departments.dto.DepartmentResponse;
import mz.gov.boaneconecta.departments.entity.DepartmentStatus;
import mz.gov.boaneconecta.departments.service.DepartmentService;
import mz.gov.boaneconecta.districts.dto.DistrictRequest;
import mz.gov.boaneconecta.districts.dto.DistrictResponse;
import mz.gov.boaneconecta.districts.entity.DistrictStatus;
import mz.gov.boaneconecta.districts.service.DistrictService;
import mz.gov.boaneconecta.municipalservices.dto.MunicipalServiceRequest;
import mz.gov.boaneconecta.municipalservices.dto.MunicipalServiceResponse;
import mz.gov.boaneconecta.municipalservices.dto.ServiceFeeRequest;
import mz.gov.boaneconecta.municipalservices.dto.ServiceFeeResponse;
import mz.gov.boaneconecta.municipalservices.dto.ServiceRequirementRequest;
import mz.gov.boaneconecta.municipalservices.dto.ServiceRequirementResponse;
import mz.gov.boaneconecta.municipalservices.entity.MunicipalServiceStatus;
import mz.gov.boaneconecta.municipalservices.service.MunicipalServiceService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class BusinessModulesIntegrationTest {
    private static final String CITIZEN_PASSWORD = "Citizen123!";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private DepartmentService departmentService;

    @Autowired
    private DistrictService districtService;

    @Autowired
    private MunicipalServiceService municipalServiceService;

    @Test
    void publicCatalogEndpointsAreAccessibleWithoutToken() throws Exception {
        assertPublicEndpoint("/api/v1/public/departments");
        assertPublicEndpoint("/api/v1/public/districts");
        assertPublicEndpoint("/api/v1/public/services");
    }

    @Test
    void adminCatalogEndpointsRejectAnonymousRequests() throws Exception {
        assertUnauthorized("/api/v1/admin/departments");
        assertUnauthorized("/api/v1/admin/districts");
        assertUnauthorized("/api/v1/admin/services");
    }

    @Test
    void citizenCannotAccessAdminCatalogEndpoints() throws Exception {
        String email = "catalog-" + UUID.randomUUID() + "@example.com";
        registerCitizen(email);
        String token = login(email, CITIZEN_PASSWORD);

        assertForbidden("/api/v1/admin/departments", token);
        assertForbidden("/api/v1/admin/districts", token);
        assertForbidden("/api/v1/admin/services", token);
    }

    @Test
    void superAdminCanAccessAdminCatalogEndpoints() throws Exception {
        String token = login("admin@boane.gov.mz", "ChangeMe123!");

        assertAllowed("/api/v1/admin/departments", token);
        assertAllowed("/api/v1/admin/districts", token);
        assertAllowed("/api/v1/admin/services", token);
    }

    @Test
    void departmentLifecycleNormalizesSlugAndSoftDeletes() {
        String suffix = shortId();
        DepartmentResponse created = departmentService.create(new DepartmentRequest(
                "Administracao Municipal " + suffix,
                null,
                "Initial description",
                DepartmentStatus.ACTIVE));

        DepartmentResponse updated = departmentService.update(created.id(), new DepartmentRequest(
                "Gestao Municipal " + suffix,
                null,
                "Updated description",
                DepartmentStatus.ACTIVE));

        assertThat(updated.slug()).startsWith("gestao-municipal-");
        assertThatThrownBy(() -> departmentService.create(new DepartmentRequest(
                "Duplicate",
                updated.slug(),
                null,
                DepartmentStatus.ACTIVE)))
                .isInstanceOf(ResourceConflictException.class)
                .hasMessageContaining("slug already exists");

        departmentService.deactivate(created.id());
        DepartmentResponse deactivated = departmentService.listAdmin().stream()
                .filter(item -> item.id().equals(created.id()))
                .findFirst()
                .orElseThrow();
        assertThat(deactivated.status()).isEqualTo(DepartmentStatus.INACTIVE);
        assertThat(departmentService.listPublic()).noneMatch(item -> item.id().equals(created.id()));
    }

    @Test
    void districtLifecycleNormalizesSlugAndSoftDeletes() {
        String suffix = shortId();
        DistrictResponse created = districtService.create(new DistrictRequest(
                "Distrito Inicial " + suffix,
                null,
                "Initial description",
                DistrictStatus.ACTIVE));

        DistrictResponse updated = districtService.update(created.id(), new DistrictRequest(
                "Distrito Atualizado " + suffix,
                null,
                "Updated description",
                DistrictStatus.ACTIVE));
        assertThat(updated.slug()).startsWith("distrito-atualizado-");

        districtService.deactivate(created.id());
        DistrictResponse deactivated = districtService.listAdmin().stream()
                .filter(item -> item.id().equals(created.id()))
                .findFirst()
                .orElseThrow();
        assertThat(deactivated.status()).isEqualTo(DistrictStatus.INACTIVE);
        assertThat(districtService.listPublic()).noneMatch(item -> item.id().equals(created.id()));
    }

    @Test
    void municipalServiceRequirementAndFeeLifecycleIsConsistent() {
        String suffix = shortId();
        DepartmentResponse department = departmentService.create(new DepartmentRequest(
                "Urbanizacao " + suffix,
                null,
                "Urban planning services",
                DepartmentStatus.ACTIVE));
        MunicipalServiceResponse service = municipalServiceService.create(new MunicipalServiceRequest(
                department.id(),
                "Licenca de Construcao " + suffix,
                null,
                "Construction licensing",
                "15 business days",
                MunicipalServiceStatus.PUBLISHED));
        MunicipalServiceResponse otherService = municipalServiceService.create(new MunicipalServiceRequest(
                null,
                "Servico Alternativo " + suffix,
                null,
                null,
                null,
                MunicipalServiceStatus.DRAFT));

        ServiceRequirementResponse requirement = municipalServiceService.addRequirement(
                service.id(),
                new ServiceRequirementRequest("Identity document", "Valid identification", true));
        ServiceFeeResponse fee = municipalServiceService.addFee(
                service.id(),
                new ServiceFeeRequest("Application fee", new BigDecimal("250.00"), null));

        assertThat(municipalServiceService.listRequirements(service.id())).hasSize(1);
        assertThat(municipalServiceService.listFees(service.id())).hasSize(1);
        assertThat(fee.currency()).isEqualTo("MZN");

        ServiceRequirementResponse updatedRequirement = municipalServiceService.updateRequirement(
                service.id(),
                requirement.id(),
                new ServiceRequirementRequest("Updated document", "Updated description", false));
        ServiceFeeResponse updatedFee = municipalServiceService.updateFee(
                service.id(),
                fee.id(),
                new ServiceFeeRequest("Updated fee", new BigDecimal("300.00"), "usd"));

        assertThat(updatedRequirement.required()).isFalse();
        assertThat(updatedFee.amount()).isEqualByComparingTo("300.00");
        assertThat(updatedFee.currency()).isEqualTo("USD");
        assertThatThrownBy(() -> municipalServiceService.updateRequirement(
                otherService.id(), requirement.id(),
                new ServiceRequirementRequest("Wrong owner", null, true)))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("not found for municipal service");
        assertThatThrownBy(() -> municipalServiceService.updateFee(
                otherService.id(), fee.id(),
                new ServiceFeeRequest("Wrong owner", BigDecimal.ZERO, "MZN")))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("not found for municipal service");

        MunicipalServiceResponse publicDetail = municipalServiceService.getPublicBySlug(service.slug());
        assertThat(publicDetail.departmentId()).isEqualTo(department.id());
        assertThat(publicDetail.departmentName()).isEqualTo(department.name());
        assertThat(publicDetail.requirements()).singleElement()
                .extracting(ServiceRequirementResponse::title)
                .isEqualTo("Updated document");
        assertThat(publicDetail.fees()).singleElement()
                .extracting(ServiceFeeResponse::amount)
                .isEqualTo(new BigDecimal("300.00"));

        municipalServiceService.deleteRequirement(service.id(), requirement.id());
        municipalServiceService.deleteFee(service.id(), fee.id());
        assertThat(municipalServiceService.listRequirements(service.id())).isEmpty();
        assertThat(municipalServiceService.listFees(service.id())).isEmpty();

        municipalServiceService.archive(service.id());
        MunicipalServiceResponse archived = municipalServiceService.listAdmin().stream()
                .filter(item -> item.id().equals(service.id()))
                .findFirst()
                .orElseThrow();
        assertThat(archived.status()).isEqualTo(MunicipalServiceStatus.ARCHIVED);
        assertThatThrownBy(() -> municipalServiceService.getPublicBySlug(service.slug()))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void invalidReferencesAndNegativeFeesReturnClearErrors() {
        String suffix = shortId();
        assertThatThrownBy(() -> municipalServiceService.create(new MunicipalServiceRequest(
                UUID.randomUUID(),
                "Invalid department " + suffix,
                null,
                null,
                null,
                MunicipalServiceStatus.DRAFT)))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Department not found");

        MunicipalServiceResponse service = municipalServiceService.create(new MunicipalServiceRequest(
                null,
                "Fee validation " + suffix,
                null,
                null,
                null,
                MunicipalServiceStatus.DRAFT));
        assertThatThrownBy(() -> municipalServiceService.addFee(
                service.id(),
                new ServiceFeeRequest("Invalid fee", new BigDecimal("-0.01"), "MZN")))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("greater than or equal to zero");
    }

    private void assertPublicEndpoint(String path) throws Exception {
        mockMvc.perform(get(path))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    private void assertUnauthorized(String path) throws Exception {
        mockMvc.perform(get(path))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    private void assertForbidden(String path, String token) throws Exception {
        mockMvc.perform(get(path).header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success").value(false));
    }

    private void assertAllowed(String path, String token) throws Exception {
        mockMvc.perform(get(path).header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    private void registerCitizen(String email) throws Exception {
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "fullName": "Catalog Citizen",
                                  "email": "%s",
                                  "password": "%s"
                                }
                                """.formatted(email, CITIZEN_PASSWORD)))
                .andExpect(status().isCreated());
    }

    private String login(String email, String password) throws Exception {
        String response = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"%s","password":"%s"}
                                """.formatted(email, password)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        JsonNode body = objectMapper.readTree(response);
        return body.path("data").path("accessToken").asText();
    }

    private String shortId() {
        return UUID.randomUUID().toString().substring(0, 8);
    }
}
