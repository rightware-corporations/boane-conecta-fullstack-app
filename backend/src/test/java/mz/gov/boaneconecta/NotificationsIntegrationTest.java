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
class NotificationsIntegrationTest {
    private static final String PASSWORD = "Citizen123!";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void adminCreatesNotificationAndCitizenReadsIt() throws Exception {
        String email = "notify-" + UUID.randomUUID() + "@example.com";
        register(email);
        JsonNode citizenLogin = login(email, PASSWORD);
        String citizenToken = citizenLogin.path("data").path("accessToken").asText();
        String citizenId = citizenLogin.path("data").path("user").path("id").asText();
        String adminToken = login("admin@boane.gov.mz", "ChangeMe123!").path("data").path("accessToken").asText();

        JsonNode created = objectMapper.readTree(mockMvc.perform(post("/api/v1/admin/notifications")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"userId":"%s","title":"Request update","message":"Your request was updated","type":"REQUEST"}
                                """.formatted(citizenId)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.read").value(false))
                .andReturn().getResponse().getContentAsString());
        String notificationId = created.path("data").path("id").asText();

        mockMvc.perform(get("/api/v1/citizen/notifications/unread-count")
                        .header("Authorization", "Bearer " + citizenToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.unreadCount").value(1));

        mockMvc.perform(get("/api/v1/citizen/notifications")
                        .header("Authorization", "Bearer " + citizenToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].id").value(notificationId));

        mockMvc.perform(patch("/api/v1/citizen/notifications/{id}/read", notificationId)
                        .header("Authorization", "Bearer " + citizenToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.read").value(true));

        mockMvc.perform(get("/api/v1/citizen/notifications/unread-count")
                        .header("Authorization", "Bearer " + citizenToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.unreadCount").value(0));
    }

    private void register(String email) throws Exception {
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"fullName":"Notification Citizen","email":"%s","phone":"+258840000000","password":"%s"}
                                """.formatted(email, PASSWORD)))
                .andExpect(status().isCreated());
    }

    private JsonNode login(String email, String password) throws Exception {
        String response = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"%s","password":"%s"}
                                """.formatted(email, password)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(response);
    }
}
