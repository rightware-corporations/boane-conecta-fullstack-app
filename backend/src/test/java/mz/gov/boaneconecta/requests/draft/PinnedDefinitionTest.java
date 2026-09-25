package mz.gov.boaneconecta.requests.draft;

import com.fasterxml.jackson.databind.ObjectMapper;
import mz.gov.boaneconecta.core.exception.ResourceNotFoundException;
import mz.gov.boaneconecta.municipalservices.entity.MunicipalService;
import mz.gov.boaneconecta.municipalservices.forms.entity.MunicipalServiceVersion;
import mz.gov.boaneconecta.municipalservices.forms.entity.ServiceFormDefinition;
import mz.gov.boaneconecta.municipalservices.forms.entity.ServiceFormVersion;
import mz.gov.boaneconecta.municipalservices.forms.service.RequestDefinitionService;
import mz.gov.boaneconecta.requests.draft.entity.RequestDraft;
import mz.gov.boaneconecta.requests.draft.repository.RequestDraftRepository;
import mz.gov.boaneconecta.requests.draft.service.RequestDraftService;
import mz.gov.boaneconecta.users.entity.User;
import mz.gov.boaneconecta.users.repository.UserRepository;
import org.junit.jupiter.api.Test;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class PinnedDefinitionTest {
    @Test
    void readsRetiredVersionThroughOwnerScopedDraftAndNeverRequestsCurrentPublication() {
        UUID citizenId = UUID.randomUUID(), draftId = UUID.randomUUID(), serviceId = UUID.randomUUID();
        User owner = User.builder().id(citizenId).build();
        MunicipalService service = MunicipalService.builder().id(serviceId).build();
        MunicipalServiceVersion serviceVersion = MunicipalServiceVersion.builder().id(UUID.randomUUID()).build();
        ServiceFormDefinition definition = ServiceFormDefinition.builder().service(service).definitionKey("citizen-request").build();
        ServiceFormVersion pinned = ServiceFormVersion.builder().id(UUID.randomUUID()).definition(definition).serviceVersion(serviceVersion).build();
        RequestDraft draft = mock(RequestDraft.class);
        when(draft.getService()).thenReturn(service);
        when(draft.getServiceVersion()).thenReturn(serviceVersion);
        when(draft.getFormVersion()).thenReturn(pinned);
        UserRepository users = mock(UserRepository.class);
        RequestDraftRepository drafts = mock(RequestDraftRepository.class);
        RequestDefinitionService definitions = mock(RequestDefinitionService.class);
        when(users.findById(citizenId)).thenReturn(Optional.of(owner));
        when(drafts.findByIdAndCitizenUser(draftId, owner)).thenReturn(Optional.of(draft));
        RequestDraftService subject = new RequestDraftService(drafts, users, definitions, new ObjectMapper(), null, null, 90);
        subject.pinnedDefinition(citizenId, draftId);
        verify(definitions).pinnedResponse(pinned);
        verify(definitions, never()).requirePublishedVersion(any());
        verify(definitions, never()).getPublished(any());
    }

    @Test
    void foreignDraftReturnsSame404AsAbsentDraftWithoutReadingDefinition() {
        UUID citizenId = UUID.randomUUID(), draftId = UUID.randomUUID();
        User owner = User.builder().id(citizenId).build();
        UserRepository users = mock(UserRepository.class);
        RequestDraftRepository drafts = mock(RequestDraftRepository.class);
        RequestDefinitionService definitions = mock(RequestDefinitionService.class);
        when(users.findById(citizenId)).thenReturn(Optional.of(owner));
        RequestDraftService subject = new RequestDraftService(drafts, users, definitions, new ObjectMapper(), null, null, 90);
        assertThatThrownBy(() -> subject.pinnedDefinition(citizenId, draftId)).isInstanceOf(ResourceNotFoundException.class);
        verify(drafts).findByIdAndCitizenUser(draftId, owner);
        verifyNoInteractions(definitions);
    }
}
