package mz.gov.boaneconecta.documents.storage;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.CopyObjectRequest;
import software.amazon.awssdk.services.s3.model.CreateBucketRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.HeadBucketRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
@Profile("!test")
public class S3ObjectStorage implements ObjectStorage {
    private final S3Client client;

    public S3ObjectStorage(S3Client client) {
        this.client = client;
    }

    @Override
    public void put(String bucket, String key, byte[] content, String contentType) {
        ensureBucket(bucket);
        client.putObject(PutObjectRequest.builder()
                        .bucket(bucket)
                        .key(key)
                        .contentType(contentType)
                        .build(),
                RequestBody.fromBytes(content));
    }

    @Override
    public StoredObject get(String bucket, String key) {
        var response = client.getObjectAsBytes(GetObjectRequest.builder().bucket(bucket).key(key).build());
        return new StoredObject(response.asByteArray(), response.response().contentType());
    }

    @Override
    public void move(String sourceBucket, String sourceKey, String targetBucket, String targetKey) {
        ensureBucket(targetBucket);
        String copySource = URLEncoder.encode(sourceBucket + "/" + sourceKey, StandardCharsets.UTF_8)
                .replace("%2F", "/");
        client.copyObject(CopyObjectRequest.builder()
                .copySource(copySource)
                .destinationBucket(targetBucket)
                .destinationKey(targetKey)
                .build());
        delete(sourceBucket, sourceKey);
    }

    @Override
    public void delete(String bucket, String key) {
        client.deleteObject(DeleteObjectRequest.builder().bucket(bucket).key(key).build());
    }

    private void ensureBucket(String bucket) {
        try {
            client.headBucket(HeadBucketRequest.builder().bucket(bucket).build());
        } catch (S3Exception exception) {
            if (exception.statusCode() != 404) throw exception;
            client.createBucket(CreateBucketRequest.builder().bucket(bucket).build());
        }
    }
}
