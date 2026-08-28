package mz.gov.boaneconecta.support;

import mz.gov.boaneconecta.documents.storage.ObjectStorage;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Primary
@Profile("test")
public class InMemoryObjectStorage implements ObjectStorage {
    private final Map<String, StoredObject> objects = new ConcurrentHashMap<>();

    @Override
    public void put(String bucket, String key, byte[] content, String contentType) {
        objects.put(path(bucket, key), new StoredObject(content.clone(), contentType));
    }

    @Override
    public StoredObject get(String bucket, String key) {
        StoredObject object = objects.get(path(bucket, key));
        if (object == null) {
            throw new IllegalStateException("Stored object not found");
        }
        return new StoredObject(object.content().clone(), object.contentType());
    }

    @Override
    public void move(String sourceBucket, String sourceKey, String targetBucket, String targetKey) {
        StoredObject object = get(sourceBucket, sourceKey);
        put(targetBucket, targetKey, object.content(), object.contentType());
        delete(sourceBucket, sourceKey);
    }

    @Override
    public void delete(String bucket, String key) {
        objects.remove(path(bucket, key));
    }

    private String path(String bucket, String key) {
        return bucket + "/" + key;
    }
}
