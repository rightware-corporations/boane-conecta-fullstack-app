package mz.gov.boaneconecta.documents.service;

import mz.gov.boaneconecta.documents.entity.*;
import mz.gov.boaneconecta.documents.repository.*;
import mz.gov.boaneconecta.documents.security.MalwareScanner;
import mz.gov.boaneconecta.documents.storage.ObjectStorage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Component
public class DocumentScanWorker {
    private final DocumentVersionRepository versions;
    private final DocumentRepository documents;
    private final ObjectStorage storage;
    private final MalwareScanner scanner;
    private final String trustedBucket;

    public DocumentScanWorker(DocumentVersionRepository versions, DocumentRepository documents,
            ObjectStorage storage, MalwareScanner scanner,
            @Value("${app.storage.trusted-bucket:boane-documents}") String trustedBucket) {
        this.versions = versions; this.documents = documents; this.storage = storage;
        this.scanner = scanner; this.trustedBucket = trustedBucket;
    }

    @Scheduled(fixedDelayString = "${app.scanner.poll-delay-millis:5000}")
    @Transactional
    public void scanBatch() {
        List<DocumentVersion> batch = versions.findBatchForUpdate(DocumentStatus.RECEIVED, PageRequest.of(0, 25));
        for (DocumentVersion version : batch) scan(version);
    }

    private void scan(DocumentVersion version) {
        Document document = version.getDocument();
        version.markScanning();
        document.markScanning();
        try {
            byte[] content = storage.get(version.getStorageBucket(), version.getStorageKey()).content();
            MalwareScanner.ScanResult result = scanner.scan(content);
            if (!result.clean()) {
                version.reject(result.failureCode());
                document.reject(result.failureCode());
                return;
            }
            String targetKey = "documents/" + document.getOwnerUser().getId() + "/" + document.getId()
                    + "/v" + version.getVersionNumber();
            storage.move(version.getStorageBucket(), version.getStorageKey(), trustedBucket, targetKey);
            version.relocate(trustedBucket, targetKey);
            document.setStorageBucket(trustedBucket);
            document.setStorageKey(targetKey);
            version.markValid();
            document.markValid();
        } catch (RuntimeException exception) {
            version.reject("SCANNER_UNAVAILABLE");
            document.reject("SCANNER_UNAVAILABLE");
        }
        versions.save(version);
        documents.save(document);
    }
}
