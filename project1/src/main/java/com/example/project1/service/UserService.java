package com.example.project1.service;

import com.example.project1.dto.AuthRequest;
import com.example.project1.model.User;
import com.example.project1.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    public User register(String username, String password, String role, String email) {
        // Prevent duplicate usernames (gives cleaner 409 response instead of generic 500)
        userRepository.findByUsername(username).ifPresent(u -> {
            throw new IllegalArgumentException("USERNAME_TAKEN");
        });
        String normalizedRole = "ROLE_USER";
        if (role != null && role.equalsIgnoreCase("admin")) {
            normalizedRole = "ROLE_ADMIN";
        }
    User u = User.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .role(normalizedRole)
        .email(email)
                .build();
        return userRepository.save(u);
    }

    public Optional<User> authenticate(AuthRequest req) {
    if (req == null || req.getUsername() == null) return Optional.empty();
    String identifier = req.getUsername().trim();
    String password = req.getPassword();
    if (identifier.isEmpty() || password == null) return Optional.empty();

        log.debug("Authenticating identifier='{}'", identifier);
        return userRepository.findByUsernameOrEmail(identifier, identifier)
                .map(u -> {
                    boolean matches = passwordEncoder.matches(password, u.getPassword());
                    log.debug("Found user id={} username='{}'. passwordMatches={}", u.getId(), u.getUsername(), matches);
                    return u;
                })
                .filter(u -> passwordEncoder.matches(password, u.getPassword()));
    }
}
