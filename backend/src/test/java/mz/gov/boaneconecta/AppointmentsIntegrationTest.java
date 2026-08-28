package mz.gov.boaneconecta;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import mz.gov.boaneconecta.appointments.entity.AppointmentSlot;
import mz.gov.boaneconecta.appointments.entity.SlotStatus;
import mz.gov.boaneconecta.appointments.repository.AppointmentSlotRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AppointmentsIntegrationTest {
    private static final String CITIZEN_PASSWORD = "Citizen123!";

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @Autowired AppointmentSlotRepository appointmentSlotRepository;

    @Test
    void appointmentWorkflowWorks() throws Exception {
        String citizenToken = registerAndLogin(uniqueEmail("appointment"));
        String adminToken = login("admin@boane.gov.mz", "ChangeMe123!").path("data").path("accessToken").asText();
        AppointmentSlot slot = createFutureSlot();

        JsonNode created = objectMapper.readTree(mockMvc.perform(post("/api/v1/citizen/appointments")
                        .header("Authorization", "Bearer " + citizenToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"slotId":"%s","reason":"Attendance"}
                                """.formatted(slot.getId())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.appointmentNumber").isNotEmpty())
                .andExpect(jsonPath("$.data.status").value("SCHEDULED"))
                .andExpect(jsonPath("$.data.slotStatus").value("FULL"))
                .andReturn().getResponse().getContentAsString());
        String appointmentId = created.path("data").path("id").asText();

        mockMvc.perform(get("/api/v1/citizen/appointments")
                        .header("Authorization", "Bearer " + citizenToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].id").value(appointmentId));

        mockMvc.perform(patch("/api/v1/admin/appointments/{id}/status", appointmentId)
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"status":"COMPLETED"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("COMPLETED"))
                .andExpect(jsonPath("$.data.slotStatus").value("BLOCKED"));
    }

    private AppointmentSlot createFutureSlot() {
        Instant start = Instant.now().plusSeconds(3 * 24 * 60 * 60);
        return appointmentSlotRepository.saveAndFlush(AppointmentSlot.builder()
                .startTime(start)
                .endTime(start.plusMinutes(30))
                .capacity(1)
                .status(SlotStatus.AVAILABLE)
                .build());
    }

    private String registerAndLogin(String email) throws Exception {
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"fullName":"Appointment Citizen","email":"%s","phone":"+258840000000","password":"%s"}
                                """.formatted(email, CITIZEN_PASSWORD)))
                .andExpect(status().isCreated());
        return login(email, CITIZEN_PASSWORD).path("data").path("accessToken").asText();
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

    private String uniqueEmail(String prefix) {
        return prefix + "-" + UUID.randomUUID() + "@example.com";
    }
}
