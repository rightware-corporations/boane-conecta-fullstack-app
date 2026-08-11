package mz.gov.boaneconecta.auth.controller;

import jakarta.validation.Valid;
import mz.gov.boaneconecta.auth.dto.AuthResponse;
import mz.gov.boaneconecta.auth.dto.ChangePasswordRequest;
import mz.gov.boaneconecta.auth.dto.CurrentUserResponse;
import mz.gov.boaneconecta.auth.dto.LoginRequest;
import mz.gov.boaneconecta.auth.dto.RefreshTokenRequest;
import mz.gov.boaneconecta.auth.dto.RegisterRequest;
import mz.gov.boaneconecta.auth.service.AuthService;
import mz.gov.boaneconecta.core.response.ApiResponse;
import mz.gov.boaneconecta.core.security.UserDetailsImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<CurrentUserResponse>> register(@Valid @RequestBody RegisterRequest request) {
        CurrentUserResponse user = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Citizen account created", user));
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success("Login successful", authService.login(request));
    }

    @PostMapping("/refresh")
    public ApiResponse<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ApiResponse.success("Token refreshed", authService.refresh(request.refreshToken()));
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @Valid @RequestBody RefreshTokenRequest request) {
        authService.logout(principal.getId(), request.refreshToken());
        return ApiResponse.success("Logout successful", null);
    }

    @GetMapping("/me")
    public ApiResponse<CurrentUserResponse> me(@AuthenticationPrincipal UserDetailsImpl principal) {
        return ApiResponse.success("Current user retrieved", authService.getCurrentUser(principal.getId()));
    }

    @PostMapping("/change-password")
    public ApiResponse<Void> changePassword(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(principal.getId(), request);
        return ApiResponse.success("Password changed successfully", null);
    }
}
