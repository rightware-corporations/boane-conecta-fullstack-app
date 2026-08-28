package mz.gov.boaneconecta.municipalservices.forms.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class FormDefinitionValidator {
    private static final Set<String> FIELD_TYPES = Set.of(
            "SHORT_TEXT", "LONG_TEXT", "EMAIL", "PHONE", "INTEGER", "DECIMAL",
            "DATE", "SINGLE_SELECT", "MULTI_SELECT", "BOOLEAN", "ADDRESS");

    public void validate(JsonNode schema, JsonNode eligibility, JsonNode documentRequirements) {
        validateSchema(schema);
        validateArray(eligibility, "Eligibility definition must be an array");
        validateDocumentRequirements(documentRequirements);
    }

    private void validateSchema(JsonNode schema) {
        if (schema == null || !schema.isObject()) {
            throw new IllegalArgumentException("Form schema must be an object");
        }
        JsonNode steps = schema.get("steps");
        if (steps == null || !steps.isArray() || steps.isEmpty()) {
            throw new IllegalArgumentException("Form schema must contain at least one step");
        }

        Set<String> stepKeys = new HashSet<>();
        Set<String> fieldKeys = new HashSet<>();
        for (JsonNode step : steps) {
            String stepKey = requiredText(step, "key", "Each form step requires a key");
            requiredText(step, "title", "Each form step requires a title");
            if (!stepKeys.add(stepKey)) {
                throw new IllegalArgumentException("Duplicate form step key: " + stepKey);
            }
            JsonNode fields = step.get("fields");
            if (fields == null || !fields.isArray() || fields.isEmpty()) {
                throw new IllegalArgumentException("Form step " + stepKey + " must contain fields");
            }
            for (JsonNode field : fields) {
                String fieldKey = requiredText(field, "key", "Each form field requires a key");
                String fieldType = requiredText(field, "type", "Each form field requires a type");
                requiredText(field, "label", "Each form field requires a label");
                if (!fieldKeys.add(fieldKey)) {
                    throw new IllegalArgumentException("Duplicate form field key: " + fieldKey);
                }
                if (!FIELD_TYPES.contains(fieldType)) {
                    throw new IllegalArgumentException("Unsupported form field type: " + fieldType);
                }
                String hiddenPolicy = optionalText(field, "hiddenValuePolicy");
                if (hiddenPolicy != null && !Set.of("CLEAR_ON_HIDE", "PRESERVE_ON_HIDE").contains(hiddenPolicy)) {
                    throw new IllegalArgumentException("Invalid hidden value policy for field: " + fieldKey);
                }
            }
        }
    }

    private void validateDocumentRequirements(JsonNode requirements) {
        validateArray(requirements, "Document requirements must be an array");
        Set<String> keys = new HashSet<>();
        for (JsonNode requirement : requirements) {
            String key = requiredText(requirement, "key", "Each document requirement requires a key");
            requiredText(requirement, "title", "Each document requirement requires a title");
            if (!keys.add(key)) {
                throw new IllegalArgumentException("Duplicate document requirement key: " + key);
            }
            JsonNode accepted = requirement.get("acceptedMimeTypes");
            if (accepted == null || !accepted.isArray() || accepted.isEmpty()) {
                throw new IllegalArgumentException("Document requirement " + key + " requires accepted MIME types");
            }
            long maxSize = requirement.path("maxSizeBytes").asLong(0);
            if (maxSize <= 0 || maxSize > 10L * 1024L * 1024L) {
                throw new IllegalArgumentException("Document requirement " + key + " has an invalid maximum size");
            }
        }
    }

    private void validateArray(JsonNode node, String message) {
        if (node == null || !node.isArray()) {
            throw new IllegalArgumentException(message);
        }
    }

    private String requiredText(JsonNode node, String field, String message) {
        String value = optionalText(node, field);
        if (value == null) {
            throw new IllegalArgumentException(message);
        }
        return value;
    }

    private String optionalText(JsonNode node, String field) {
        JsonNode value = node == null ? null : node.get(field);
        if (value == null || !value.isTextual() || value.asText().isBlank()) {
            return null;
        }
        return value.asText().trim();
    }
}
