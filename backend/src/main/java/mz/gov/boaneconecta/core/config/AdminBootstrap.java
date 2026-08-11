package mz.gov.boaneconecta.core.config;

import mz.gov.boaneconecta.roles.entity.Role;
import mz.gov.boaneconecta.roles.entity.RoleName;
import mz.gov.boaneconecta.roles.entity.UserRole;
import mz.gov.boaneconecta.roles.repository.RoleRepository;
import mz.gov.boaneconecta.roles.repository.UserRoleRepository;
import mz.gov.boaneconecta.users.entity.User;
import mz.gov.boaneconecta.users.entity.UserStatus;
import mz.gov.boaneconecta.users.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AdminBootstrap implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(AdminBootstrap.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminPassword;

    public AdminBootstrap(
            UserRepository userRepository,
            RoleRepository roleRepository,
            UserRoleRepository userRoleRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.bootstrap.admin-password:ChangeMe123!}") String adminPassword) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userRoleRepository = userRoleRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminPassword = adminPassword;
    }

    @Override
    @Transactional
    public void run(String... args) {
        for (RoleName roleName : RoleName.values()) {
            roleRepository.findByName(roleName).orElseGet(() -> roleRepository.save(
                    Role.builder()
                            .name(roleName)
                            .description(defaultRoleDescription(roleName))
                            .build()));
        }

        Role superAdminRole = roleRepository.findByName(RoleName.SUPER_ADMIN)
                .orElseThrow(() -> new IllegalStateException("SUPER_ADMIN role bootstrap failed"));

        User admin = userRepository.findByEmailIgnoreCase("admin@boane.gov.mz")
                .orElseGet(() -> userRepository.save(User.builder()
                        .fullName("System Administrator")
                        .email("admin@boane.gov.mz")
                        .passwordHash(passwordEncoder.encode(adminPassword))
                        .status(UserStatus.ACTIVE)
                        .emailVerified(true)
                        .build()));

        if (!userRoleRepository.existsByUserAndRole(admin, superAdminRole)) {
            userRoleRepository.save(UserRole.builder()
                    .user(admin)
                    .role(superAdminRole)
                    .build());
        }

        if ("ChangeMe123!".equals(adminPassword)) {
            log.warn("Default bootstrap admin password is configured. Set ADMIN_BOOTSTRAP_PASSWORD before production use.");
        }
    }

    private String defaultRoleDescription(RoleName roleName) {
        return switch (roleName) {
            case SUPER_ADMIN -> "Full system access";
            case ADMIN -> "Institutional management access";
            case MANAGER -> "Operational management access";
            case EDITOR -> "Content management access";
            case EMPLOYEE -> "Operational processing access";
            case CITIZEN -> "Citizen access";
        };
    }
}
