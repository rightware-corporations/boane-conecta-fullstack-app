package mz.gov.boaneconecta.auth.service;

import mz.gov.boaneconecta.auth.entity.RefreshToken;
import mz.gov.boaneconecta.auth.repository.RefreshTokenRepository;
import mz.gov.boaneconecta.core.exception.InvalidRefreshTokenException;
import mz.gov.boaneconecta.users.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;
import java.util.UUID;

@Service
public class RefreshTokenService {
    private static final int TOKEN_BYTES = 64;

    private final RefreshTokenRepository refreshTokenRepository;
    private final SecureRandom secureRandom = new SecureRandom();
    private final long refreshExpirationSeconds;

    public RefreshTokenService(
            RefreshTokenRepository refreshTokenRepository,
            @Value("${app.jwt.refresh-expiration}") long refreshExpirationSeconds) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.refreshExpirationSeconds = refreshExpirationSeconds;
    }

    @Transactional
    public IssuedRefreshToken issue(User user) {
        String rawToken = generateSecureToken();
        RefreshToken entity = RefreshToken.builder()
                .user(user)
                .tokenHash(hash(rawToken))
                .expiresAt(LocalDateTime.now().plusSeconds(refreshExpirationSeconds))
                .build();
        refreshTokenRepository.save(entity);
        return new IssuedRefreshToken(rawToken, user);
    }

    @Transactional
    public IssuedRefreshToken rotate(String rawToken) {
        RefreshToken current = requireActive(rawToken);
        current.setRevokedAt(LocalDateTime.now());
        refreshTokenRepository.save(current);
        return issue(current.getUser());
    }

    @Transactional
    public void revoke(String rawToken, UUID expectedUserId) {
        RefreshToken token = refreshTokenRepository.findByTokenHash(hash(rawToken))
                .orElseThrow(() -> new InvalidRefreshTokenException("Invalid refresh token"));

        if (!token.getUser().getId().equals(expectedUserId)) {
            throw new InvalidRefreshTokenException("Refresh token does not belong to the current user");
        }
        if (token.getRevokedAt() == null) {
            token.setRevokedAt(LocalDateTime.now());
            refreshTokenRepository.save(token);
        }
    }

    @Transactional
    public void revokeAll(User user) {
        refreshTokenRepository.revokeAllByUser(user);
    }

    private RefreshToken requireActive(String rawToken) {
        RefreshToken token = refreshTokenRepository.findByTokenHash(hash(rawToken))
                .orElseThrow(() -> new InvalidRefreshTokenException("Invalid refresh token"));

        if (token.getRevokedAt() != null) {
            throw new InvalidRefreshTokenException("Refresh token has been revoked");
        }
        if (!token.getExpiresAt().isAfter(LocalDateTime.now())) {
            token.setRevokedAt(LocalDateTime.now());
            refreshTokenRepository.save(token);
            throw new InvalidRefreshTokenException("Refresh token has expired");
        }
        return token;
    }

    private String generateSecureToken() {
        byte[] bytes = new byte[TOKEN_BYTES];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hash(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(rawToken.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is unavailable", exception);
        }
    }

    public record IssuedRefreshToken(String value, User user) {
    }
}
