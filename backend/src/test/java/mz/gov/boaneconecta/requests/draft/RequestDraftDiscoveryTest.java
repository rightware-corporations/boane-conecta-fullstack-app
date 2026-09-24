package mz.gov.boaneconecta.requests.draft;

import com.fasterxml.jackson.databind.ObjectMapper;
import mz.gov.boaneconecta.municipalservices.entity.MunicipalService;
import mz.gov.boaneconecta.municipalservices.forms.entity.MunicipalServiceVersion;
import mz.gov.boaneconecta.municipalservices.forms.entity.ServiceFormVersion;
import mz.gov.boaneconecta.requests.draft.entity.RequestDraft;
import mz.gov.boaneconecta.requests.draft.entity.RequestDraftStatus;
import mz.gov.boaneconecta.requests.draft.repository.RequestDraftRepository;
import mz.gov.boaneconecta.requests.draft.service.RequestDraftService;
import mz.gov.boaneconecta.users.entity.User;
import mz.gov.boaneconecta.users.repository.UserRepository;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class RequestDraftDiscoveryTest {
    @Test
    void returnsOnlyEditableDraftsOwnedByTheAuthenticatedCitizen() {
        UUID citizenId = UUID.randomUUID();
        UUID activeId = UUID.randomUUID();
        User citizen = User.builder().id(citizenId).build();
        UserRepository users = mock(UserRepository.class);
        RequestDraftRepository drafts = mock(RequestDraftRepository.class);
        when(users.findById(citizenId)).thenReturn(Optional.of(citizen));

        RequestDraft expired = mock(RequestDraft.class);
        RequestDraft active = mock(RequestDraft.class);
        when(expired.isEditable(any(Instant.class))).thenReturn(false);
        when(active.isEditable(any(Instant.class))).thenReturn(true);
        when(active.getId()).thenReturn(activeId);
        when(active.getService()).thenReturn(MunicipalService.builder().id(UUID.randomUUID()).build());
        when(active.getServiceVersion()).thenReturn(MunicipalServiceVersion.builder().id(UUID.randomUUID()).build());
        when(active.getFormVersion()).thenReturn(ServiceFormVersion.builder().id(UUID.randomUUID()).build());
        when(active.getStatus()).thenReturn(RequestDraftStatus.IN_PROGRESS);
        when(drafts.findByCitizenUserAndStatusInOrderByUpdatedAtDesc(eq(citizen), any()))
                .thenReturn(List.of(expired, active));

        RequestDraftService service = new RequestDraftService(
                drafts, users, null, new ObjectMapper(), null, null, 90);
        var result = service.listResumable(citizenId);

        assertThat(result).extracting(item -> item.id()).containsExactly(activeId);
        verify(drafts).findByCitizenUserAndStatusInOrderByUpdatedAtDesc(
                citizen, List.of(RequestDraftStatus.IN_PROGRESS, RequestDraftStatus.READY_FOR_REVIEW));
        verify(expired, never()).getService();
    }
}
