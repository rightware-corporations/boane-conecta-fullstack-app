package mz.gov.boaneconecta.citizens;

import mz.gov.boaneconecta.citizens.dto.UpdateCitizenProfileRequest;
import mz.gov.boaneconecta.citizens.entity.CitizenProfile;
import mz.gov.boaneconecta.citizens.repository.CitizenProfileRepository;
import mz.gov.boaneconecta.citizens.service.CitizenProfileService;
import mz.gov.boaneconecta.users.entity.User;
import mz.gov.boaneconecta.users.repository.UserRepository;
import org.junit.jupiter.api.Test;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class CitizenProfileServiceTest {
    @Test void updatesOnlyCitizenManagedFieldsAndKeepsEmailServerOwned() {
        UserRepository users = mock(UserRepository.class); CitizenProfileRepository profiles = mock(CitizenProfileRepository.class);
        UUID id = UUID.randomUUID(); User user = User.builder().id(id).fullName("Old").email("citizen@example.test").phone("1").emailVerified(true).build();
        CitizenProfile profile = CitizenProfile.builder().id(UUID.randomUUID()).user(user).build();
        when(users.findById(id)).thenReturn(Optional.of(user)); when(profiles.findByUser(user)).thenReturn(Optional.of(profile)); when(profiles.save(profile)).thenReturn(profile);
        var service = new CitizenProfileService(users, profiles);
        var result = service.update(id, new UpdateCitizenProfileRequest("New Name", " 82123 ", "400", "BI", "123", LocalDate.of(1990, 1, 1), "F", "Boane"));
        assertThat(result.email()).isEqualTo("citizen@example.test"); assertThat(result.fullName()).isEqualTo("New Name"); assertThat(result.phone()).isEqualTo("82123"); assertThat(result.nuit()).isEqualTo("400");
        verify(users).save(user); verify(profiles).save(profile);
    }
}
