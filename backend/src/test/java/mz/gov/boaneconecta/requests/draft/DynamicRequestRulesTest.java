package mz.gov.boaneconecta.requests.draft;

import com.fasterxml.jackson.databind.ObjectMapper;
import mz.gov.boaneconecta.requests.draft.service.DynamicAnswerValidator;
import mz.gov.boaneconecta.requests.draft.service.EligibilityService;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.*;

class DynamicRequestRulesTest {
    private final ObjectMapper mapper = new ObjectMapper();

    @Test
    void hiddenAnswersAreClearedAndUnknownKeysRejected() throws Exception {
        var schema = mapper.readTree("""
                {"steps":[{"key":"main","fields":[
                  {"key":"hasDetails","type":"BOOLEAN"},
                  {"key":"details","type":"SHORT_TEXT","visibleWhen":{"field":"hasDetails","equals":true}}
                ]}]}
                """);
        var validator = new DynamicAnswerValidator();
        var current = mapper.readTree("{\"hasDetails\":true,\"details\":\"kept\"}");
        var hidden = validator.mergePartial(schema, current, mapper.readTree("{\"hasDetails\":false}"));
        assertThat(hidden.has("details")).isFalse();
        assertThatThrownBy(() -> validator.mergePartial(schema, hidden, mapper.readTree("{\"invented\":1}")))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void eligibilityProducesBlockingAndAdvisoryResults() throws Exception {
        var rules = mapper.readTree("""
                [{"key":"resident","operator":"TRUTHY","blocking":true,"failureMessage":"Residência obrigatória"},
                 {"key":"email","operator":"TRUTHY","blocking":false,"failureMessage":"Email recomendado"}]
                """);
        var result = new EligibilityService(mapper).evaluate(rules,
                mapper.readTree("{\"resident\":false,\"email\":false}"));
        assertThat(result.path("eligible").asBoolean()).isFalse();
        assertThat(result.path("blockingReasons").size()).isEqualTo(1);
        assertThat(result.path("advisories").size()).isEqualTo(1);
    }
}
