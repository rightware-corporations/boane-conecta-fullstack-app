package mz.gov.boaneconecta.municipalservices.forms;

import com.fasterxml.jackson.databind.ObjectMapper;
import mz.gov.boaneconecta.municipalservices.forms.service.FormDefinitionValidator;
import mz.gov.boaneconecta.requests.draft.service.DynamicAnswerValidator;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;

class AddressDefinitionContractTest {
    private final ObjectMapper json = new ObjectMapper();
    private final FormDefinitionValidator definition = new FormDefinitionValidator();
    private final DynamicAnswerValidator answers = new DynamicAnswerValidator();

    @Test
    void requiresLabelledGenericComponentsAtPublication() throws Exception {
        var eligibility = json.readTree("[]"); var documents = json.readTree("[]");
        var legacy = json.readTree("{\"steps\":[{\"key\":\"s\",\"title\":\"S\",\"fields\":[{\"key\":\"a\",\"label\":\"A\",\"type\":\"ADDRESS\"}]}]}");
        assertThatThrownBy(() -> definition.validate(legacy, eligibility, documents)).isInstanceOf(IllegalArgumentException.class);
        var valid = json.readTree("{\"steps\":[{\"key\":\"s\",\"title\":\"S\",\"fields\":[{\"key\":\"a\",\"label\":\"A\",\"type\":\"ADDRESS\",\"addressFields\":[{\"key\":\"part\",\"label\":\"Part\",\"required\":true}]}]}]}");
        assertThatCode(() -> definition.validate(valid, eligibility, documents)).doesNotThrowAnyException();
        var merged = answers.mergePartial(valid, json.readTree("{\"otherStep\":\"unchanged\"}"), json.readTree("{\"a\":{\"part\":\"text\"}}"), "s");
        assertThat(merged.path("otherStep").asText()).isEqualTo("unchanged");
        assertThatThrownBy(() -> answers.mergePartial(valid, merged, json.readTree("{\"a\":{\"unexpected\":\"text\"}}"), "s"))
                .isInstanceOf(IllegalArgumentException.class);
    }
}
