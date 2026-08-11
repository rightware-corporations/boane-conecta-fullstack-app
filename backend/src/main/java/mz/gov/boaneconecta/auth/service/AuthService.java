package mz.gov.boaneconecta.auth.service;

import mz.gov.boaneconecta.auth.dto.AuthResponse;
import mz.gov.boaneconecta.auth.dto.ChangePasswordRequest;
import mz.gov.boaneconecta.auth.dto.CurrentUserResponse;
import mz.gov.boaneconecta.auth.dto.LoginRequest;
import mz.gov.boaneconecta.auth.dto.RegisterRequest;
import mz.gov.boaneconecta.core.exception.ResourceConflictException;
import mz.gov.boaneconecta.core.exception.ResourceNotFoundException;
import mz.gov.boaneconecta.core.security.CustomUserDetailsService;
import mz.gov.boaneconecta.core.security.JwtService;
import mz.gov.boaneconecta.core.security.UserDetailsImpl;
import mz.gov.boaneconecta.roles.entity.Role;
import mz.gov.boaneconecta.roles.entity.RoleName;
import mz.gov.boaneconecta.roles.entity.UserRole;
import mz.gov.boaneconecta.roles.repository.RoleRepository;
import mz.gov.boaneconecta.roles.repository.UserRoleRepository;
import mz.gov.boaneconecta.users.entity.User;
import mz.gov.boaneconecta.users.entity.UserStatus;
import mz.gov.boaneconecta.users.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final CustomUserDetailsService userDetailsService;

    public AuthService(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            RoleRepository roleRepository,
            UserRoleRepository userRoleRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            RefreshTokenService refreshTokenService,
            CustomUserDetailsService userDetailsService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userRoleRepository = userRoleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.userDetailsService = userDetailsService;
    }

    @Transactional
    public CurrentUserResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.email());
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ResourceConflictException("An account already exists for this email");
        }

        Role citizenRole = roleRepository.findByName(RoleName.CITIZEN)
                .orElseThrow(() -> new IllegalStateException("CITIZEN role is not configured"));

        User user = userRepository.save(User.builder()
                .fullName(request.fullName().trim())
                .email(email)
                .phone(normalizeOptional(request.phone()))
                .passwordHash(passwordEncoder.encode(request.password()))
                .status(UserStatus.ACTIVE)
                .emailVerified(false)
                .build());

        userRoleRepository.save(UserRole.builder()
                .user(user)
                .role(citizenRole)
                .build());

        return toCurrentUser(user);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizeEmail(request.email()), request.password()));
        UserDetailsImpl principal = (UserDetailsImpl) authentication.getPrincipal();
        User user = requireUser(principal.getId());

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        return issueSession(principal, refreshTokenService.issue(user).value());
    }

    @Transactional
    public AuthResponse refresh(String rawRefreshToken) {
        RefreshTokenService.IssuedRefreshToken rotated = refreshTokenService.rotate(rawRefreshToken);
        UserDetailsImpl principal = (UserDetailsImpl) userDetailsService.loadUserByUsername(rotated.user().getEmail());
        assertActive(principal);
        return issueSession(principal, rotated.value());
    }

    @Transactional
    public void logout(UUID userId, String rawRefreshToken) {
        refreshTokenService.revoke(rawRefreshToken, userId);
    }

    @Transactional(readOnly = true)
    public CurrentUserResponse getCurrentUser(UUID userId) {
        return toCurrentUser(requireUser(userId));
    }

    @Transactional
    public void changePassword(UUID userId, ChangePasswordRequest request) {
        User user = requireUser(userId);
        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new org.springframework.security.authentication.BadCredentialsException(
                    "Current password is incorrect");
        }
        if (passwordEncoder.matches(request.newPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("New password must be different from the current password");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
        refreshTokenService.revokeAll(user);
    }

    private AuthResponse issueSession(UserDetailsImpl principal, String refreshToken) {
        return new AuthResponse(
                jwtService.generateAccessToken(principal),
                refreshToken,
                "Bearer",
                jwtService.getAccessExpirationSeconds(),
                getCurrentUser(principal.getId()));
    }

    private CurrentUserResponse toCurrentUser(User user) {
        List<String> roles = userRoleRepository.findByUser(user).stream()
                .map(userRole -> userRole.getRole().getName().name())
                .sorted()
                .toList();

        return new CurrentUserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getStatus(),
                Boolean.TRUE.equals(user.getEmailVerified()),
                roles);
    }

    private User requireUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private void assertActive(UserDetailsImpl principal) {
        if (!principal.isAccountNonLocked()) {
            throw new LockedException("Account is suspended");
        }
        if (!principal.isEnabled()) {
            throw new DisabledException("Account is inactive");
        }
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private String normalizeOptional(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
