package mz.gov.boaneconecta.citizens.service;

import mz.gov.boaneconecta.citizens.dto.CitizenProfileResponse;
import mz.gov.boaneconecta.citizens.dto.UpdateCitizenProfileRequest;
import mz.gov.boaneconecta.citizens.entity.CitizenProfile;
import mz.gov.boaneconecta.citizens.repository.CitizenProfileRepository;
import mz.gov.boaneconecta.core.exception.ResourceNotFoundException;
import mz.gov.boaneconecta.users.entity.User;
import mz.gov.boaneconecta.users.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
public class CitizenProfileService {
    private final UserRepository users;
    private final CitizenProfileRepository profiles;
    public CitizenProfileService(UserRepository users, CitizenProfileRepository profiles) { this.users = users; this.profiles = profiles; }
    @Transactional(readOnly = true)
    public CitizenProfileResponse get(UUID userId) { User user = user(userId); return response(user, profiles.findByUser(user).orElse(null)); }
    @Transactional
    public CitizenProfileResponse update(UUID userId, UpdateCitizenProfileRequest request) {
        User user = user(userId); user.setFullName(request.fullName().trim()); user.setPhone(clean(request.phone())); users.save(user);
        CitizenProfile profile = profiles.findByUser(user).orElseGet(() -> CitizenProfile.builder().user(user).build());
        profile.setNuit(clean(request.nuit())); profile.setDocumentType(clean(request.documentType())); profile.setDocumentNumber(clean(request.documentNumber()));
        profile.setBirthDate(request.birthDate()); profile.setGender(clean(request.gender())); profile.setAddress(clean(request.address()));
        return response(user, profiles.save(profile));
    }
    private User user(UUID id) { return users.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found")); }
    private String clean(String value) { return value == null || value.isBlank() ? null : value.trim(); }
    private CitizenProfileResponse response(User user, CitizenProfile profile) {
        return new CitizenProfileResponse(user.getId(), user.getFullName(), user.getEmail(), user.getPhone(), user.getEmailVerified(),
                profile == null ? null : profile.getNuit(), profile == null ? null : profile.getDocumentType(), profile == null ? null : profile.getDocumentNumber(),
                profile == null ? null : profile.getBirthDate(), profile == null ? null : profile.getGender(), profile == null ? null : profile.getAddress(),
                profile == null || profile.getDistrict() == null ? null : profile.getDistrict().getName());
    }
}
