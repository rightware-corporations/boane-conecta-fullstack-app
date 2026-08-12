package mz.gov.boaneconecta.requests.repository;

import mz.gov.boaneconecta.documents.entity.Document;
import mz.gov.boaneconecta.requests.entity.CitizenRequest;
import mz.gov.boaneconecta.requests.entity.RequestDocuments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestDocumentsRepository extends JpaRepository<RequestDocuments, RequestDocuments.RequestDocumentId> {
    List<RequestDocuments> findByRequest(CitizenRequest request);
    boolean existsByRequestAndDocument(CitizenRequest request, Document document);
}
