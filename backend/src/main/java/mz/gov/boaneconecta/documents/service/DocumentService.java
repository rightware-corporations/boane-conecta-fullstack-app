package mz.gov.boaneconecta.documents.service;

import mz.gov.boaneconecta.core.exception.ResourceConflictException;
import mz.gov.boaneconecta.core.exception.ResourceNotFoundException;
import mz.gov.boaneconecta.documents.dto.DocumentResponse;
import mz.gov.boaneconecta.documents.dto.UpdateDocumentStatusRequest;
import mz.gov.boaneconecta.documents.entity.Document;
import mz.gov.boaneconecta.documents.entity.DocumentClassification;
import mz.gov.boaneconecta.documents.entity.DocumentStatus;
import mz.gov.boaneconecta.documents.entity.DocumentVersion;
import mz.gov.boaneconecta.documents.entity.Visibility;
import mz.gov.boaneconecta.documents.repository.DocumentRepository;
import mz.gov.boaneconecta.documents.repository.DocumentVersionRepository;
import mz.gov.boaneconecta.documents.security.FileSignatureDetector;
import mz.gov.boaneconecta.documents.storage.ObjectStorage;
import mz.gov.boaneconecta.requests.entity.CitizenRequest;
import mz.gov.boaneconecta.requests.entity.RequestDocuments;
import mz.gov.boaneconecta.requests.repository.CitizenRequestRepository;
import mz.gov.boaneconecta.requests.repository.RequestDocumentsRepository;
import mz.gov.boaneconecta.users.entity.User;
import mz.gov.boaneconecta.users.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import java.util.HexFormat;

@Service
public class DocumentService {
    private static final long MAX_FILE_SIZE = 10L * 1024L * 1024L;
    private static final Set<String> ALLOWED_MIME_TYPES = Set.of(
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/webp",
            "text/plain");

    private final DocumentRepository documentRepository;
    private final DocumentVersionRepository documentVersionRepository;
    private final UserRepository userRepository;
    private final CitizenRequestRepository citizenRequestRepository;
    private final RequestDocumentsRepository requestDocumentsRepository;
    private final Path storageRoot;
    private final ObjectStorage objectStorage;
    private final FileSignatureDetector signatureDetector;
    private final String quarantineBucket;

    public DocumentService(
            DocumentRepository documentRepository,
            DocumentVersionRepository documentVersionRepository,
            UserRepository userRepository,
            CitizenRequestRepository citizenRequestRepository,
            RequestDocumentsRepository requestDocumentsRepository,
            ObjectStorage objectStorage,
            FileSignatureDetector signatureDetector,
            @Value("${app.storage.root}") String storageRoot,
            @Value("${app.storage.quarantine-bucket:boane-quarantine}") String quarantineBucket) {
        this.documentRepository = documentRepository;
        this.documentVersionRepository = documentVersionRepository;
        this.userRepository = userRepository;
        this.citizenRequestRepository = citizenRequestRepository;
        this.requestDocumentsRepository = requestDocumentsRepository;
        this.storageRoot = Paths.get(storageRoot).toAbsolutePath().normalize();
        this.objectStorage = objectStorage;
        this.signatureDetector = signatureDetector;
        this.quarantineBucket = quarantineBucket;
    }

    @Transactional
    public DocumentResponse uploadCitizenDocument(UUID ownerUserId, MultipartFile file, String title, String documentType) {
        User owner = requireUser(ownerUserId);
        validateFile(file);

        String originalFileName = sanitizeFileName(file.getOriginalFilename());
        String extension = extensionOf(originalFileName);
        String storedFileName = UUID.randomUUID() + extension;
        byte[] content;
        try {
            content = file.getBytes();
        } catch (IOException exception) {
            throw new IllegalStateException("Could not read document", exception);
        }
        String detectedMimeType = signatureDetector.detect(content);
        String declaredMimeType = file.getContentType() == null ? "" : file.getContentType().toLowerCase(Locale.ROOT);
        if (!detectedMimeType.equals(declaredMimeType)) {
            throw new IllegalArgumentException("Document content does not match its declared type");
        }
        String objectKey = "quarantine/" + owner.getId() + "/" + UUID.randomUUID() + extension;
        objectStorage.put(quarantineBucket, objectKey, content, detectedMimeType);

        Document document = documentRepository.saveAndFlush(Document.builder()
                .ownerUser(owner)
                .title(cleanTitle(title, originalFileName))
                .documentType(clean(documentType))
                .fileName(storedFileName)
                .originalFileName(originalFileName)
                .storageBucket(quarantineBucket)
                .storageKey(objectKey)
                .mimeType(declaredMimeType)
                .detectedMimeType(detectedMimeType)
                .fileSize(file.getSize())
                .sha256(sha256(content))
                .visibility(Visibility.PRIVATE)
                .classification(DocumentClassification.PERSONAL)
                .currentVersionNumber(1)
                .status(DocumentStatus.RECEIVED)
                .build());

        documentVersionRepository.saveAndFlush(DocumentVersion.builder()
                .document(document)
                .versionNumber(1)
                .storageBucket(quarantineBucket)
                .storageKey(objectKey)
                .originalFileName(originalFileName)
                .detectedMimeType(detectedMimeType)
                .fileSize(file.getSize())
                .sha256(document.getSha256())
                .status(DocumentStatus.RECEIVED)
                .build());

        return toResponse(document);
    }

    @Transactional(readOnly = true)
    public List<DocumentResponse> listCitizenDocuments(UUID ownerUserId) {
        User owner = requireUser(ownerUserId);
        return documentRepository.findByOwnerUserAndStatusNotOrderByCreatedAtDesc(owner, DocumentStatus.ARCHIVED).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public DocumentResponse getCitizenDocument(UUID ownerUserId, UUID documentId) {
        return toResponse(requireCitizenDocument(ownerUserId, documentId));
    }

    @Transactional
    public void archiveCitizenDocument(UUID ownerUserId, UUID documentId) {
        Document document = requireCitizenDocument(ownerUserId, documentId);
        document.setStatus(DocumentStatus.ARCHIVED);
        documentRepository.saveAndFlush(document);
    }

    @Transactional(readOnly = true)
    public StoredDocument getCitizenDownload(UUID ownerUserId, UUID documentId) {
        return toStoredDocument(requireCitizenDocument(ownerUserId, documentId));
    }

    @Transactional(readOnly = true)
    public List<DocumentResponse> listAdminDocuments(DocumentStatus status) {
        List<Document> documents = status == null
                ? documentRepository.findAllByOrderByCreatedAtDesc()
                : documentRepository.findByStatusOrderByCreatedAtDesc(status);
        return documents.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public DocumentResponse getAdminDocument(UUID documentId) {
        return toResponse(requireDocument(documentId));
    }

    @Transactional(readOnly = true)
    public StoredDocument getAdminDownload(UUID documentId) {
        return toStoredDocument(requireDocument(documentId));
    }

    @Transactional
    public DocumentResponse updateStatus(UUID documentId, UpdateDocumentStatusRequest request) {
        Document document = requireDocument(documentId);
        document.setStatus(request.status());
        return toResponse(documentRepository.saveAndFlush(document));
    }

    @Transactional
    public DocumentResponse attachCitizenDocumentToRequest(UUID citizenUserId, UUID requestId, UUID documentId) {
        User citizen = requireUser(citizenUserId);
        CitizenRequest request = citizenRequestRepository.findByIdAndCitizenUser(requestId, citizen)
                .orElseThrow(() -> new ResourceNotFoundException("Citizen request not found"));
        Document document = documentRepository.findByIdAndOwnerUser(documentId, citizen)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
        if (document.getStatus() != DocumentStatus.VALID) {
            throw new IllegalArgumentException("Only validated documents can be attached to requests");
        }
        if (requestDocumentsRepository.existsByRequestAndDocument(request, document)) {
            throw new ResourceConflictException("Document is already attached to this request");
        }

        requestDocumentsRepository.saveAndFlush(RequestDocuments.builder()
                .request(request)
                .document(document)
                .build());
        return toResponse(document);
    }

    @Transactional(readOnly = true)
    public List<DocumentResponse> listCitizenRequestDocuments(UUID citizenUserId, UUID requestId) {
        User citizen = requireUser(citizenUserId);
        CitizenRequest request = citizenRequestRepository.findByIdAndCitizenUser(requestId, citizen)
                .orElseThrow(() -> new ResourceNotFoundException("Citizen request not found"));
        return requestDocumentsRepository.findByRequest(request).stream()
                .map(RequestDocuments::getDocument)
                .sorted(Comparator.comparing(Document::getCreatedAt).reversed())
                .map(this::toResponse)
                .toList();
    }

    private Document requireCitizenDocument(UUID ownerUserId, UUID documentId) {
        User owner = requireUser(ownerUserId);
        return documentRepository.findByIdAndOwnerUser(documentId, owner)
                .filter(document -> document.getStatus() != DocumentStatus.ARCHIVED)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
    }

    private Document requireDocument(UUID documentId) {
        return documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
    }

    private User requireUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private StoredDocument toStoredDocument(Document document) {
        if (document.getStatus() != DocumentStatus.VALID) {
            throw new ResourceConflictException("Document is not available for download");
        }
        if (document.getStorageBucket() != null && document.getStorageKey() != null) {
            ObjectStorage.StoredObject stored = objectStorage.get(document.getStorageBucket(), document.getStorageKey());
            Resource resource = new ByteArrayResource(stored.content());
            return new StoredDocument(
                    resource,
                    document.getOriginalFileName() == null ? document.getFileName() : document.getOriginalFileName(),
                    document.getDetectedMimeType() == null ? "application/octet-stream" : document.getDetectedMimeType());
        }
        Path path = Paths.get(document.getFilePath()).toAbsolutePath().normalize();
        if (!path.startsWith(storageRoot)) {
            throw new IllegalArgumentException("Invalid document path");
        }
        if (!Files.exists(path) || !Files.isRegularFile(path)) {
            throw new ResourceNotFoundException("Document file not found");
        }
        try {
            Resource resource = new UrlResource(path.toUri());
            return new StoredDocument(
                    resource,
                    document.getOriginalFileName() == null ? document.getFileName() : document.getOriginalFileName(),
                    document.getMimeType() == null ? "application/octet-stream" : document.getMimeType());
        } catch (MalformedURLException exception) {
            throw new IllegalStateException("Could not load document", exception);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Document file is required");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("Document file exceeds maximum size of 10MB");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType.toLowerCase(Locale.ROOT))) {
            throw new IllegalArgumentException("Document file type is not allowed");
        }
    }

    private DocumentResponse toResponse(Document document) {
        User owner = document.getOwnerUser();
        return new DocumentResponse(
                document.getId(),
                owner == null ? null : owner.getId(),
                owner == null ? null : owner.getFullName(),
                document.getTitle(),
                document.getDocumentType(),
                document.getFileName(),
                document.getOriginalFileName(),
                document.getMimeType(),
                document.getFileSize(),
                document.getVisibility(),
                document.getStatus(),
                document.getCreatedAt(),
                document.getUpdatedAt());
    }

    private String cleanTitle(String title, String fallback) {
        String cleaned = clean(title);
        if (cleaned != null) {
            return cleaned;
        }
        return fallback == null || fallback.isBlank() ? "Document" : fallback;
    }

    private String clean(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private String sanitizeFileName(String fileName) {
        if (fileName == null || fileName.isBlank()) {
            return "document";
        }
        return Paths.get(fileName).getFileName().toString().replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    private String extensionOf(String fileName) {
        int index = fileName.lastIndexOf('.');
        if (index < 0 || index == fileName.length() - 1) {
            return "";
        }
        return fileName.substring(index).toLowerCase(Locale.ROOT);
    }

    private String sha256(byte[] content) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(content));
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is not available", exception);
        }
    }

    public record StoredDocument(Resource resource, String fileName, String mimeType) {
    }
}
