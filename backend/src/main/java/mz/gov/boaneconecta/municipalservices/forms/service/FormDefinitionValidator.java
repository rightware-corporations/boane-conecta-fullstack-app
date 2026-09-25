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
        Set<String> eligibilityKeys = new HashSet<>();
        for (JsonNode rule : eligibility) {
            String key = requiredText(rule, "key", "Eligibility question requires a key");
            requiredText(rule, "label", "Eligibility question requires a label");
            if (!eligibilityKeys.add(key)) throw new IllegalArgumentException("Duplicate eligibility key: " + key);
            String operator = optionalText(rule, "operator");
            if (operator != null && !Set.of("TRUTHY", "EQUALS", "NOT_EQUALS", "IN").contains(operator))
                throw new IllegalArgumentException("Unsupported eligibility operator: " + key);
            if (rule.has("options")) validateOptions(rule.get("options"), key);
            if (!"TRUTHY".equals(operator) && !rule.has("options"))
                throw new IllegalArgumentException("Eligibility question requires labelled options: " + key);
            if (!"TRUTHY".equals(operator) && !rule.has("expected"))
                throw new IllegalArgumentException("Eligibility question requires expected value: " + key);
            if ("IN".equals(operator) && (!rule.path("expected").isArray() || rule.path("expected").isEmpty()))
                throw new IllegalArgumentException("Eligibility IN requires expected values: " + key);
            if (!"TRUTHY".equals(operator) && !"IN".equals(operator) && !isScalar(rule.get("expected")))
                throw new IllegalArgumentException("Eligibility expected value must be scalar: " + key);
        }
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
        Set<String> previousFields = new HashSet<>();
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
                if (Set.of("SINGLE_SELECT", "MULTI_SELECT").contains(fieldType))
                    validateOptions(field.get("options"), fieldKey);
                if ("ADDRESS".equals(fieldType)) validateAddressFields(field.get("addressFields"), fieldKey);
                JsonNode condition = field.get("visibleWhen");
                if (condition != null && !condition.isNull()) {
                    String source = requiredText(condition, "field", "Visibility condition requires source field: " + fieldKey);
                    if (!previousFields.contains(source) || !condition.has("equals") || !isScalar(condition.get("equals")))
                        throw new IllegalArgumentException("Visibility condition must reference a preceding field with a scalar value: " + fieldKey);
                }
                String hiddenPolicy = optionalText(field, "hiddenValuePolicy");
                if (hiddenPolicy != null && !Set.of("CLEAR_ON_HIDE", "PRESERVE_ON_HIDE").contains(hiddenPolicy)) {
                    throw new IllegalArgumentException("Invalid hidden value policy for field: " + fieldKey);
                }
                previousFields.add(fieldKey);
            }
        }
    }

    private void validateAddressFields(JsonNode components, String key) {
        if (components == null || !components.isArray() || components.isEmpty())
            throw new IllegalArgumentException("Address field requires labelled addressFields: " + key);
        Set<String> keys = new HashSet<>();
        for (JsonNode component : components) {
            String part = requiredText(component, "key", "Address component requires a key: " + key);
            requiredText(component, "label", "Address component requires a label: " + key);
            if (!keys.add(part)) throw new IllegalArgumentException("Duplicate address component: " + part);
            for (String bound : Set.of("minLength", "maxLength"))
                if (component.has(bound) && (!component.get(bound).canConvertToInt() || component.get(bound).asInt() < 0))
                    throw new IllegalArgumentException("Invalid address component length: " + part);
            if (component.has("minLength") && component.has("maxLength")
                    && component.get("minLength").asInt() > component.get("maxLength").asInt())
                throw new IllegalArgumentException("Invalid address component length range: " + part);
        }
    }

    private void validateOptions(JsonNode options, String key) {
        if (options == null || !options.isArray() || options.isEmpty())
            throw new IllegalArgumentException("Options are required: " + key);
        Set<String> values = new HashSet<>();
        for (JsonNode option : options) {
            String value = option.isTextual() && !option.asText().isBlank() ? option.asText().trim()
                    : requiredText(option, "value", "Option requires a value: " + key);
            if (option.isObject()) requiredText(option, "label", "Option requires a label: " + key);
            if (!values.add(value)) throw new IllegalArgumentException("Duplicate option: " + key);
        }
    }

    private boolean isScalar(JsonNode node) {
        return node != null && (node.isTextual() || node.isNumber() || node.isBoolean());
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
            for (JsonNode mime : accepted) if (!mime.isTextual() || mime.asText().isBlank())
                throw new IllegalArgumentException("Document requirement has invalid MIME type: " + key);
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
