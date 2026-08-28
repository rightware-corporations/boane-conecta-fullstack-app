package mz.gov.boaneconecta;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import mz.gov.boaneconecta.documents.service.DocumentScanWorker;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class DocumentsIntegrationTest {
    private static final String PASSWORD = "Citizen123!";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private DocumentScanWorker documentScanWorker;

    @Test
    void citizenDocumentLifecycleAndRequestAttachmentWork() throws Exception {
        String citizenToken = registerAndLogin(uniqueEmail());
        String otherCitizenToken = registerAndLogin(uniqueEmail());

        UUID documentId = uploadDocument(citizenToken, "Identity document");

        mockMvc.perform(get("/api/v1/citizen/documents/{id}", documentId)
                        .header("Authorization", bearer(citizenToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.title").value("Identity document"))
                .andExpect(jsonPath("$.data.status").value("VALID"));

        mockMvc.perform(get("/api/v1/citizen/documents/{id}", documentId)
                        .header("Authorization", bearer(otherCitizenToken)))
                .andExpect(status().isNotFound());

        mockMvc.perform(get("/api/v1/citizen/documents/{id}/download", documentId)
                        .header("Authorization", bearer(citizenToken)))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", org.hamcrest.Matchers.containsString("citizen-id.txt")));

        UUID requestId = createCitizenRequest(citizenToken);
        mockMvc.perform(post("/api/v1/citizen/requests/{requestId}/documents/{documentId}", requestId, documentId)
                        .header("Authorization", bearer(citizenToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(documentId.toString()));

        mockMvc.perform(get("/api/v1/citizen/requests/{requestId}/documents", requestId)
                        .header("Authorization", bearer(citizenToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].id").value(documentId.toString()));

        mockMvc.perform(delete("/api/v1/citizen/documents/{id}", documentId)
                        .header("Authorization", bearer(citizenToken)))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/v1/citizen/documents/{id}", documentId)
                        .header("Authorization", bearer(citizenToken)))
                .andExpect(status().isNotFound());
    }

    @Test
    void adminCanListDownloadAndUpdateDocumentStatus() throws Exception {
        String citizenToken = registerAndLogin(uniqueEmail());
        String adminToken = login("admin@boane.gov.mz", "ChangeMe123!");
        UUID documentId = uploadDocument(citizenToken, "Proof of residence");

        mockMvc.perform(get("/api/v1/admin/documents")
                        .header("Authorization", bearer(adminToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").isNumber());

        mockMvc.perform(get("/api/v1/admin/documents/{id}/download", documentId)
                        .header("Authorization", bearer(adminToken)))
                .andExpect(status().isOk());

        mockMvc.perform(patch("/api/v1/admin/documents/{id}/status", documentId)
                        .header("Authorization", bearer(adminToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"REJECTED\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("REJECTED"));
    }

    @Test
    void uploadRejectsUnsupportedFileTypes() throws Exception {
        String citizenToken = registerAndLogin(uniqueEmail());
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "malware.exe",
                "application/x-msdownload",
                "binary".getBytes());

        mockMvc.perform(multipart("/api/v1/citizen/documents")
                        .file(file)
                        .param("title", "Invalid file")
                        .header("Authorization", bearer(citizenToken)))
                .andExpect(status().isBadRequest());
    }

    private UUID uploadDocument(String token, String title) throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "citizen-id.txt",
                "text/plain",
                "identity-data".getBytes());

        String response = mockMvc.perform(multipart("/api/v1/citizen/documents")
                        .file(file)
                        .param("title", title)
                        .param("documentType", "IDENTITY")
                        .header("Authorization", bearer(token)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.id").isNotEmpty())
                .andExpect(jsonPath("$.data.originalFileName").value("citizen-id.txt"))
                .andReturn()
                .getResponse()
                .getContentAsString();
        documentScanWorker.scanBatch();
        return UUID.fromString(objectMapper.readTree(response).path("data").path("id").asText());
    }

    private UUID createCitizenRequest(String token) throws Exception {
        String response = mockMvc.perform(post("/api/v1/citizen/requests")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Document request",
                                  "description": "Request with document"
                                }
                                """))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();
        return UUID.fromString(objectMapper.readTree(response).path("data").path("id").asText());
    }

    private String registerAndLogin(String email) throws Exception {
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "fullName": "Document Citizen",
                                  "email": "%s",
                                  "phone": "+258840000000",
                                  "password": "%s"
                                }
                                """.formatted(email, PASSWORD)))
                .andExpect(status().isCreated());
        return login(email, PASSWORD);
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
        JsonNode json = objectMapper.readTree(response);
        String token = json.path("data").path("accessToken").asText();
        assertThat(token).isNotBlank();
        return token;
    }

    private String uniqueEmail() {
        return "docs-" + UUID.randomUUID() + "@example.com";
    }

    private String bearer(String token) {
        return "Bearer " + token;
    }
}
