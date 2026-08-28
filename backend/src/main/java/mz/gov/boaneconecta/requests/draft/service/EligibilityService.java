package mz.gov.boaneconecta.requests.draft.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class EligibilityService {
    private final ObjectMapper objectMapper;

    public EligibilityService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public ObjectNode evaluate(JsonNode definition, JsonNode answers) {
        if (answers == null || !answers.isObject()) {
            throw new IllegalArgumentException("Eligibility answers must be an object");
        }
        Set<String> allowedKeys = new HashSet<>();
        ArrayNode blockingReasons = objectMapper.createArrayNode();
        ArrayNode advisories = objectMapper.createArrayNode();
        boolean eligible = true;

        for (JsonNode rule : definition) {
            String key = rule.path("key").asText(null);
            if (key == null) {
                continue;
            }
            allowedKeys.add(key);
            JsonNode answer = answers.get(key);
            boolean required = rule.path("required").asBoolean(true);
            boolean matched = matches(rule, answer);
            if ((required && (answer == null || answer.isNull())) || !matched) {
                if (rule.path("blocking").asBoolean(true)) {
                    eligible = false;
                    blockingReasons.add(rule.path("failureMessage").asText("Critério de elegibilidade não satisfeito."));
                } else {
                    advisories.add(rule.path("failureMessage").asText("Verifique este critério."));
                }
            }
        }
        answers.fieldNames().forEachRemaining(key -> {
            if (!allowedKeys.contains(key)) {
                throw new IllegalArgumentException("Unknown eligibility field: " + key);
            }
        });

        ObjectNode result = objectMapper.createObjectNode();
        result.put("eligible", eligible);
        result.set("blockingReasons", blockingReasons);
        result.set("advisories", advisories);
        return result;
    }

    private boolean matches(JsonNode rule, JsonNode answer) {
        if (answer == null || answer.isNull()) {
            return !rule.path("required").asBoolean(true);
        }
        String operator = rule.path("operator").asText("EQUALS");
        JsonNode expected = rule.get("expected");
        return switch (operator) {
            case "EQUALS" -> expected != null && answer.equals(expected);
            case "NOT_EQUALS" -> expected != null && !answer.equals(expected);
            case "TRUTHY" -> answer.isBoolean() && answer.asBoolean();
            case "IN" -> expected != null && expected.isArray()
                    && java.util.stream.StreamSupport.stream(expected.spliterator(), false)
                    .anyMatch(answer::equals);
            default -> throw new IllegalArgumentException("Unsupported eligibility operator: " + operator);
        };
    }
}
