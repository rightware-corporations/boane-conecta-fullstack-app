package mz.gov.boaneconecta.documents.security;

import org.springframework.stereotype.Component;

import java.nio.ByteBuffer;
import java.nio.charset.CharacterCodingException;
import java.nio.charset.CodingErrorAction;
import java.nio.charset.StandardCharsets;

@Component
public class FileSignatureDetector {
    public String detect(byte[] content) {
        if (startsWith(content, new int[]{0x25, 0x50, 0x44, 0x46, 0x2D})) {
            return "application/pdf";
        }
        if (startsWith(content, new int[]{0xFF, 0xD8, 0xFF})) {
            return "image/jpeg";
        }
        if (startsWith(content, new int[]{0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A})) {
            return "image/png";
        }
        if (content.length >= 12
                && new String(content, 0, 4, StandardCharsets.US_ASCII).equals("RIFF")
                && new String(content, 8, 4, StandardCharsets.US_ASCII).equals("WEBP")) {
            return "image/webp";
        }
        if (isPlainText(content)) {
            return "text/plain";
        }
        throw new IllegalArgumentException("Document content type could not be verified");
    }

    private boolean startsWith(byte[] content, int[] signature) {
        if (content.length < signature.length) {
            return false;
        }
        for (int index = 0; index < signature.length; index++) {
            if ((content[index] & 0xFF) != signature[index]) {
                return false;
            }
        }
        return true;
    }

    private boolean isPlainText(byte[] content) {
        if (content.length == 0) {
            return false;
        }
        for (byte value : content) {
            if (value == 0) {
                return false;
            }
        }
        try {
            StandardCharsets.UTF_8.newDecoder()
                    .onMalformedInput(CodingErrorAction.REPORT)
                    .onUnmappableCharacter(CodingErrorAction.REPORT)
                    .decode(ByteBuffer.wrap(content));
            return true;
        } catch (CharacterCodingException exception) {
            return false;
        }
    }
}
