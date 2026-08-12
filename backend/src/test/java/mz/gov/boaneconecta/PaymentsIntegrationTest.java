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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PaymentsIntegrationTest {
    private static final String CITIZEN_PASSWORD = "Citizen123!";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void citizenCanCreateAndListPayment() throws Exception {
        String email = uniqueEmail("payment-citizen");
        register(email);
        String token = login(email, CITIZEN_PASSWORD).path("data").path("accessToken").asText();

        JsonNode created = objectMapper.readTree(mockMvc.perform(post("/api/v1/citizen/payments")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "amount": 250.50,
                                  "method": "MANUAL"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.paymentNumber").isNotEmpty())
                .andExpect(jsonPath("$.data.currency").value("MZN"))
                .andExpect(jsonPath("$.data.status").value("PENDING"))
                .andReturn()
                .getResponse()
                .getContentAsString());
        String paymentId = created.path("data").path("id").asText();

        mockMvc.perform(get("/api/v1/citizen/payments")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].id").value(paymentId));
    }

    @Test
    void citizenCannotReadOtherCitizenPayment() throws Exception {
        String ownerEmail = uniqueEmail("payment-owner");
        String otherEmail = uniqueEmail("payment-other");
        register(ownerEmail);
        register(otherEmail);
        String ownerToken = login(ownerEmail, CITIZEN_PASSWORD).path("data").path("accessToken").asText();
        String otherToken = login(otherEmail, CITIZEN_PASSWORD).path("data").path("accessToken").asText();

        JsonNode created = objectMapper.readTree(mockMvc.perform(post("/api/v1/citizen/payments")
                        .header("Authorization", "Bearer " + ownerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"amount": 100, "currency": "mzn"}
                                """))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString());
        String paymentId = created.path("data").path("id").asText();

        mockMvc.perform(get("/api/v1/citizen/payments/{id}", paymentId)
                        .header("Authorization", "Bearer " + otherToken))
                .andExpect(status().isNotFound());
    }

    @Test
    void adminCanConfirmPayment() throws Exception {
        String citizenEmail = uniqueEmail("payment-admin");
        register(citizenEmail);
        String citizenToken = login(citizenEmail, CITIZEN_PASSWORD).path("data").path("accessToken").asText();
        String adminToken = login("admin@boane.gov.mz", "ChangeMe123!").path("data").path("accessToken").asText();

        JsonNode created = objectMapper.readTree(mockMvc.perform(post("/api/v1/citizen/payments")
                        .header("Authorization", "Bearer " + citizenToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"amount": 500, "currency": "MZN", "method": "BANK_TRANSFER"}
                                """))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString());
        String paymentId = created.path("data").path("id").asText();

        mockMvc.perform(get("/api/v1/admin/payments")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].id").exists());

        mockMvc.perform(patch("/api/v1/admin/payments/{id}/status", paymentId)
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"status":"CONFIRMED"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("CONFIRMED"))
                .andExpect(jsonPath("$.data.paidAt").isNotEmpty());
    }

    private void register(String email) throws Exception {
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "fullName": "Payment Citizen",
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

    private String uniqueEmail(String prefix) {
        return prefix + "-" + UUID.randomUUID() + "@example.com";
    }
}
