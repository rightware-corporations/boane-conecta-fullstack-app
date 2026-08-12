package mz.gov.boaneconecta;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ComplaintsIntegrationTest {
    private static final String CITIZEN_PASSWORD = "Citizen123!";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void anonymousUserCanSubmitPublicComplaint() throws Exception {
        mockMvc.perform(post("/api/v1/public/complaints")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(complaintBody("Public lighting failure", "Street lights are off near the market")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.complaintNumber").isNotEmpty())
                .andExpect(jsonPath("$.data.status").value("OPEN"))
                .andExpect(jsonPath("$.data.history[0].newStatus").value("OPEN"));
    }

    @Test
    void citizenComplaintIsOwnedAndHiddenFromOtherCitizens() throws Exception {
        String citizenEmail = uniqueEmail("complaint-owner");
        String otherEmail = uniqueEmail("complaint-other");
        register(citizenEmail);
        register(otherEmail);
        String citizenToken = login(citizenEmail, CITIZEN_PASSWORD).path("data").path("accessToken").asText();
        String otherToken = login(otherEmail, CITIZEN_PASSWORD).path("data").path("accessToken").asText();

        JsonNode created = objectMapper.readTree(mockMvc.perform(post("/api/v1/citizen/complaints")
                        .header("Authorization", "Bearer " + citizenToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(complaintBody("Waste collection delay", "Waste has not been collected for several days")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.status").value("OPEN"))
                .andReturn()
                .getResponse()
                .getContentAsString());
        String complaintId = created.path("data").path("id").asText();

        mockMvc.perform(get("/api/v1/citizen/complaints")
                        .header("Authorization", "Bearer " + citizenToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].id").value(complaintId));

        mockMvc.perform(get("/api/v1/citizen/complaints/{id}", complaintId)
                        .header("Authorization", "Bearer " + otherToken))
                .andExpect(status().isNotFound());
    }

    @Test
    void adminCanAssignAndUpdateComplaintStatus() throws Exception {
        String citizenEmail = uniqueEmail("complaint-admin");
        register(citizenEmail);
        String citizenToken = login(citizenEmail, CITIZEN_PASSWORD).path("data").path("accessToken").asText();
        JsonNode adminLogin = login("admin@boane.gov.mz", "ChangeMe123!");
        String adminToken = adminLogin.path("data").path("accessToken").asText();
        String adminId = adminLogin.path("data").path("user").path("id").asText();

        JsonNode created = objectMapper.readTree(mockMvc.perform(post("/api/v1/citizen/complaints")
                        .header("Authorization", "Bearer " + citizenToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(complaintBody("Road damage", "A road section is damaged after heavy rain")))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString());
        String complaintId = created.path("data").path("id").asText();

        mockMvc.perform(get("/api/v1/admin/complaints")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].id").exists());

        mockMvc.perform(patch("/api/v1/admin/complaints/{id}/assign", complaintId)
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"assignedToUserId":"%s"}
                                """.formatted(adminId)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.assignedToUserId").value(adminId));

        mockMvc.perform(patch("/api/v1/admin/complaints/{id}/status", complaintId)
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"status":"RESOLVED","comment":"Resolved by municipal team"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("RESOLVED"))
                .andExpect(jsonPath("$.data.history[2].newStatus").value("RESOLVED"));
    }

    private void register(String email) throws Exception {
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "fullName": "Complaint Citizen",
                                  "email": "%s",
                                  "phone": "+258840000000",
                                  "password": "%s"
                                }
                                """.formatted(email, CITIZEN_PASSWORD)))
                .andExpect(status().isCreated());
    }

    private JsonNode login(String email, String password) throws Exception {
        String response = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"%s","password":"%s"}
                                """.formatted(email, password)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        return objectMapper.readTree(response);
    }

    private String complaintBody(String subject, String description) {
        return """
                {
                  "subject": "%s",
                  "description": "%s",
                  "priority": "NORMAL"
                }
                """.formatted(subject, description);
    }

    private String uniqueEmail(String prefix) {
        return prefix + "-" + UUID.randomUUID() + "@example.com";
    }
}
