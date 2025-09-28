package com.example.project1.service;

import com.example.project1.dto.AuthRequest;
import com.example.project1.model.User;
import com.example.project1.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User register(String username, String password) {
        // Prevent duplicate usernames (gives cleaner 409 response instead of generic 500)
        userRepository.findByUsername(username).ifPresent(u -> {
            throw new IllegalArgumentException("USERNAME_TAKEN");
        });
        User u = User.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .role("ROLE_USER")
                .build();
        return userRepository.save(u);
    }

    public Optional<User> authenticate(AuthRequest req) {
        return userRepository.findByUsername(req.getUsername())
                .filter(u -> passwordEncoder.matches(req.getPassword(), u.getPassword()));
    }
}
