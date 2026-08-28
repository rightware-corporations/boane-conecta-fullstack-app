package mz.gov.boaneconecta.documents.security;

import org.junit.jupiter.api.Test;
import java.nio.charset.StandardCharsets;
import static org.assertj.core.api.Assertions.*;

class FileSignatureDetectorTest {
    private final FileSignatureDetector detector = new FileSignatureDetector();

    @Test void detectsVerifiedFormats() {
        assertThat(detector.detect("%PDF-1.7".getBytes(StandardCharsets.US_ASCII))).isEqualTo("application/pdf");
        assertThat(detector.detect("conteúdo cidadão".getBytes(StandardCharsets.UTF_8))).isEqualTo("text/plain");
    }

    @Test void rejectsOpaqueBinaryContent() {
        assertThatThrownBy(() -> detector.detect(new byte[]{0, 1, 2, 3}))
                .isInstanceOf(IllegalArgumentException.class);
    }
}
