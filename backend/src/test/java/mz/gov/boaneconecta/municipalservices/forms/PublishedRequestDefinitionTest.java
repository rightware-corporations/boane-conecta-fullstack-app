package mz.gov.boaneconecta.municipalservices.forms;

import com.fasterxml.jackson.databind.ObjectMapper;
import mz.gov.boaneconecta.core.exception.ResourceNotFoundException;
import mz.gov.boaneconecta.municipalservices.entity.MunicipalService;
import mz.gov.boaneconecta.municipalservices.entity.MunicipalServiceStatus;
import mz.gov.boaneconecta.municipalservices.forms.service.RequestDefinitionService;
import mz.gov.boaneconecta.municipalservices.repository.MunicipalServiceRepository;
import org.junit.jupiter.api.Test;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

class PublishedRequestDefinitionTest {
    @Test
    void hidesRequestDefinitionForUnpublishedMunicipalService() {
        UUID id = UUID.randomUUID();
        MunicipalServiceRepository services = mock(MunicipalServiceRepository.class);
        when(services.findById(id)).thenReturn(Optional.of(
                MunicipalService.builder().id(id).status(MunicipalServiceStatus.DRAFT).build()));
        RequestDefinitionService definitions = new RequestDefinitionService(
                services, null, null, null, null, new ObjectMapper());

        assertThatThrownBy(() -> definitions.requirePublishedVersion(id))
                .isInstanceOf(ResourceNotFoundException.class);
        verify(services).findById(id);
        verifyNoMoreInteractions(services);
    }
}
