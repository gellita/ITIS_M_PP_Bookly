package ru.kpfu.itis.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kpfu.itis.dto.resp.AuthResponse;
import ru.kpfu.itis.dto.req.LoginRequest;
import ru.kpfu.itis.dto.req.RegisterRequest;
import ru.kpfu.itis.dto.resp.UserResponse;
import ru.kpfu.itis.entity.UserAccount;
import ru.kpfu.itis.service.AuthService;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Registration, login, logout, and current user profile")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Creates a user account and immediately returns a bearer token.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User registered"),
            @ApiResponse(responseCode = "400", description = "Validation error or username/email is already taken")
    })
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    @Operation(summary = "Sign in", description = "Authenticates by username or email and returns a bearer token.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Authenticated"),
            @ApiResponse(responseCode = "401", description = "Invalid credentials")
    })
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/logout")
    @Operation(summary = "Log out", description = "Deletes the current bearer session token.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponse(responseCode = "200", description = "Logged out")
    public Map<String, Boolean> logout(
            @Parameter(description = "Bearer token", example = "Bearer token-value")
            @RequestHeader(value = "Authorization", required = false) String authorization
    ) {
        authService.logout(authorization);
        return Map.of("ok", true);
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user", description = "Returns the profile of the authenticated user.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Current user profile"),
            @ApiResponse(responseCode = "401", description = "Missing or invalid bearer token")
    })
    public UserResponse me(@AuthenticationPrincipal UserAccount user) {
        return authService.toResponse(user);
    }
}
