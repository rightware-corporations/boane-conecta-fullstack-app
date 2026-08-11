package mz.gov.boaneconecta.requests.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mz.gov.boaneconecta.documents.entity.Document;

import java.io.Serializable;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "request_documents")
@IdClass(RequestDocuments.RequestDocumentId.class)
public class RequestDocuments {

    @Id
    @ManyToOne
    @JoinColumn(name = "request_id", nullable = false)
    private CitizenRequest request;

    @Id
    @ManyToOne
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RequestDocumentId implements Serializable {
        private UUID request;
        private UUID document;
    }
}
