package mz.gov.boaneconecta.documents.storage;

public interface ObjectStorage {
    void put(String bucket, String key, byte[] content, String contentType);
    StoredObject get(String bucket, String key);
    void move(String sourceBucket, String sourceKey, String targetBucket, String targetKey);
    void delete(String bucket, String key);

    record StoredObject(byte[] content, String contentType) {
    }
}
