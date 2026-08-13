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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ReportsIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void adminCanReadDashboardReportsAndCitizenCannot() throws Exception {
        String adminToken = login("admin@boane.gov.mz", "ChangeMe123!").path("data").path("accessToken").asText();
        String citizenEmail = "reports-citizen@example.com";
        register(citizenEmail);
        String citizenToken = login(citizenEmail, "Citizen123!").path("data").path("accessToken").asText();

        mockMvc.perform(get("/api/v1/admin/reports/dashboard-summary")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.requests.total").exists())
                .andExpect(jsonPath("$.data.complaints.total").exists())
                .andExpect(jsonPath("$.data.payments.total").exists())
                .andExpect(jsonPath("$.data.appointments.total").exists());

        mockMvc.perform(get("/api/v1/admin/reports/payments-summary")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.confirmedAmount").exists());

        mockMvc.perform(get("/api/v1/admin/reports/dashboard-summary")
                        .header("Authorization", "Bearer " + citizenToken))
                .andExpect(status().isForbidden());
    }

    private void register(String email) throws Exception {
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "fullName": "Reports Citizen",
                                  "email": "%s",
                                  "phone": "+258840000000",
                                  "password": "Citizen123!"
                                }
                                """.formatted(email)))
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
}
