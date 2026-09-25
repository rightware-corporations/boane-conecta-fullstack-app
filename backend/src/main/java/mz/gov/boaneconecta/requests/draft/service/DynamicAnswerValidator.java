package mz.gov.boaneconecta.requests.draft.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

@Component
public class DynamicAnswerValidator {
    public ObjectNode mergePartial(JsonNode schema, JsonNode current, JsonNode patch, String stepKey) {
        if (patch == null || !patch.isObject()) {
            throw new IllegalArgumentException("Draft answers must be an object");
        }
        Map<String, JsonNode> fields = fieldsByStep(schema, stepKey);
        ObjectNode merged = current != null && current.isObject()
                ? ((ObjectNode) current).deepCopy()
                : com.fasterxml.jackson.databind.node.JsonNodeFactory.instance.objectNode();

        Iterator<Map.Entry<String, JsonNode>> values = patch.fields();
        while (values.hasNext()) {
            Map.Entry<String, JsonNode> value = values.next();
            JsonNode field = fields.get(value.getKey());
            if (field == null) {
                throw new IllegalArgumentException("Unknown form field: " + value.getKey());
            }
            validateType(value.getKey(), field, value.getValue());
            merged.set(value.getKey(), value.getValue());
        }
        applyHiddenPolicies(fields, merged);
        return merged;
    }

    private Map<String, JsonNode> fieldsByStep(JsonNode schema, String stepKey) {
        Map<String, JsonNode> fields = new HashMap<>();
        for (JsonNode step : schema.path("steps")) {
            if (!stepKey.equals(step.path("key").asText())) continue;
            for (JsonNode field : step.path("fields")) {
                fields.put(field.path("key").asText(), field);
            }
        }
        return fields;
    }

    public Map<String, JsonNode> fieldsByKey(JsonNode schema) {
        Map<String, JsonNode> fields = new HashMap<>();
        for (JsonNode step : schema.path("steps")) {
            for (JsonNode field : step.path("fields")) {
                fields.put(field.path("key").asText(), field);
            }
        }
        return fields;
    }

    public boolean isVisible(JsonNode field, ObjectNode answers) {
        JsonNode condition = field.get("visibleWhen");
        if (condition == null || condition.isNull()) {
            return true;
        }
        String source = condition.path("field").asText(null);
        if (source == null) {
            return false;
        }
        JsonNode actual = answers.get(source);
        JsonNode expected = condition.get("equals");
        return actual != null && expected != null && actual.equals(expected);
    }

    private void applyHiddenPolicies(Map<String, JsonNode> fields, ObjectNode answers) {
        for (Map.Entry<String, JsonNode> entry : fields.entrySet()) {
            JsonNode field = entry.getValue();
            if (!isVisible(field, answers)
                    && "CLEAR_ON_HIDE".equals(field.path("hiddenValuePolicy").asText("CLEAR_ON_HIDE"))) {
                answers.remove(entry.getKey());
            }
        }
    }

    private void validateType(String key, JsonNode field, JsonNode value) {
        if (value == null || value.isNull()) {
            return;
        }
        String type = field.path("type").asText();
        boolean valid = switch (type) {
            case "SHORT_TEXT", "LONG_TEXT", "EMAIL", "PHONE", "DATE", "SINGLE_SELECT" -> value.isTextual();
            case "INTEGER" -> value.isIntegralNumber();
            case "DECIMAL" -> value.isNumber();
            case "MULTI_SELECT" -> value.isArray();
            case "BOOLEAN" -> value.isBoolean();
            case "ADDRESS" -> value.isObject();
            default -> false;
        };
        if (!valid) {
            throw new IllegalArgumentException("Invalid value type for form field: " + key);
        }
        if ("ADDRESS".equals(type)) {
            JsonNode parts = field.path("addressFields");
            if (!parts.isArray() || parts.isEmpty())
                throw new IllegalArgumentException("Address structure unavailable for field: " + key);
            Set<String> allowed = new java.util.HashSet<>();
            for (JsonNode part : parts) allowed.add(part.path("key").asText());
            var entries = value.fields();
            while (entries.hasNext()) {
                var entry = entries.next();
                if (!allowed.contains(entry.getKey()) || !entry.getValue().isTextual())
                    throw new IllegalArgumentException("Invalid address component for field: " + key);
            }
        }
    }
}
