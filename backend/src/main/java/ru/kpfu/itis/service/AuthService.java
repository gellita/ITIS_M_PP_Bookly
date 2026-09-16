package ru.kpfu.itis.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kpfu.itis.dto.resp.AuthResponse;
import ru.kpfu.itis.dto.req.LoginRequest;
import ru.kpfu.itis.dto.req.RegisterRequest;
import ru.kpfu.itis.dto.resp.UserResponse;
import ru.kpfu.itis.entity.AuthSession;
import ru.kpfu.itis.entity.UserAccount;
import ru.kpfu.itis.repository.AuthSessionRepository;
import ru.kpfu.itis.repository.UserRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final AuthSessionRepository sessionRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new IllegalArgumentException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email is already taken");
        }

        UserAccount user = new UserAccount();
        user.setUsername(request.username().trim());
        user.setEmail(request.email().trim().toLowerCase());
        user.setDisplayName(request.displayName().trim());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        userRepository.save(user);

        return createSession(user);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        UserAccount user = userRepository.findByUsername(request.usernameOrEmail())
                .or(() -> userRepository.findByEmail(request.usernameOrEmail().toLowerCase()))
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        return createSession(user);
    }

    @Transactional
    public void logout(String authorizationHeader) {
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            sessionRepository.deleteByToken(authorizationHeader.substring(7));
        }
    }

    public UserResponse toResponse(UserAccount user) {
        return new UserResponse(user.getId(), user.getUsername(), user.getEmail(), user.getDisplayName());
    }

    private AuthResponse createSession(UserAccount user) {
        AuthSession session = new AuthSession();
        session.setUser(user);
        session.setToken(UUID.randomUUID().toString().replace("-", "") + UUID.randomUUID().toString().replace("-", ""));
        sessionRepository.save(session);
        return new AuthResponse(session.getToken(), toResponse(user));
    }
}
