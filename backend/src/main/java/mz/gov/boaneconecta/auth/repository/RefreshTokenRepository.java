package mz.gov.boaneconecta.auth.repository;

import jakarta.persistence.LockModeType;
import mz.gov.boaneconecta.auth.entity.RefreshToken;
import mz.gov.boaneconecta.users.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<RefreshToken> findByTokenHash(String tokenHash);

    @Modifying
    @Query("""
            update RefreshToken token
            set token.revokedAt = CURRENT_TIMESTAMP
            where token.user = :user and token.revokedAt is null
            """)
    int revokeAllByUser(@Param("user") User user);
}
