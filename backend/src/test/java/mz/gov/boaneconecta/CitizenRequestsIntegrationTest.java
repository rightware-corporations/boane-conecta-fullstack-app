package mz.gov.boaneconecta;

import mz.gov.boaneconecta.core.Priority;
import mz.gov.boaneconecta.municipalservices.dto.MunicipalServiceRequest;
import mz.gov.boaneconecta.municipalservices.dto.MunicipalServiceResponse;
import mz.gov.boaneconecta.municipalservices.entity.MunicipalServiceStatus;
import mz.gov.boaneconecta.municipalservices.service.MunicipalServiceService;
import mz.gov.boaneconecta.requests.dto.AssignRequestRequest;
import mz.gov.boaneconecta.requests.dto.CitizenRequestResponse;
import mz.gov.boaneconecta.requests.dto.CreateCitizenRequestRequest;
import mz.gov.boaneconecta.requests.dto.UpdateRequestStatusRequest;
import mz.gov.boaneconecta.requests.entity.RequestStatus;
import mz.gov.boaneconecta.requests.service.CitizenRequestService;
import mz.gov.boaneconecta.users.entity.User;
import mz.gov.boaneconecta.users.entity.UserStatus;
import mz.gov.boaneconecta.users.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class CitizenRequestsIntegrationTest {

    @Autowired
    private CitizenRequestService citizenRequestService;

    @Autowired
    private MunicipalServiceService municipalServiceService;

    @Autowired
    private UserRepository userRepository;

    @Test
    void citizenRequestWorkflowCreatesAssignsAndTracksStatusHistory() {
        String suffix = UUID.randomUUID().toString();
        User citizen = createUser("Citizen " + suffix, "citizen-requests-" + suffix + "@example.com");
        User admin = userRepository.findByEmailIgnoreCase("admin@boane.gov.mz")
                .orElseGet(() -> createUser("Admin " + suffix, "admin-requests-" + suffix + "@example.com"));
        MunicipalServiceResponse service = municipalServiceService.create(new MunicipalServiceRequest(
                null,
                "Pedido Municipal " + suffix,
                null,
                "Request workflow service",
                "5 days",
                MunicipalServiceStatus.PUBLISHED));

        CitizenRequestResponse created = citizenRequestService.create(
                citizen.getId(),
                new CreateCitizenRequestRequest(
                        service.id(),
                        "Licenciamento de teste",
                        "Preciso submeter um pedido municipal",
                        Priority.HIGH));

        assertThat(created.requestNumber()).startsWith("BC-");
        assertThat(created.status()).isEqualTo(RequestStatus.SUBMITTED);
        assertThat(created.priority()).isEqualTo(Priority.HIGH);
        assertThat(created.history()).singleElement()
                .extracting(history -> history.newStatus())
                .isEqualTo(RequestStatus.SUBMITTED);
        assertThat(citizenRequestService.listCitizen(citizen.getId()))
                .extracting(CitizenRequestResponse::id)
                .contains(created.id());

        CitizenRequestResponse assigned = citizenRequestService.assign(
                created.id(),
                new AssignRequestRequest(admin.getId()),
                admin.getId());
        assertThat(assigned.assignedToUserId()).isEqualTo(admin.getId());

        CitizenRequestResponse underReview = citizenRequestService.updateStatus(
                created.id(),
                new UpdateRequestStatusRequest(RequestStatus.UNDER_REVIEW, "Em analise"),
                admin.getId());
        assertThat(underReview.status()).isEqualTo(RequestStatus.UNDER_REVIEW);

        CitizenRequestResponse completed = citizenRequestService.updateStatus(
                created.id(),
                new UpdateRequestStatusRequest(RequestStatus.COMPLETED, "Processo concluido"),
                admin.getId());
        assertThat(completed.status()).isEqualTo(RequestStatus.COMPLETED);
        assertThat(completed.completedAt()).isNotNull();
        assertThat(completed.history()).hasSizeGreaterThanOrEqualTo(4);
    }

    private User createUser(String fullName, String email) {
        return userRepository.saveAndFlush(User.builder()
                .fullName(fullName)
                .email(email)
                .passwordHash("not-used-in-service-test")
                .status(UserStatus.ACTIVE)
                .emailVerified(true)
                .build());
    }
}
