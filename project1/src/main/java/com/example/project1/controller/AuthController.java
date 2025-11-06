package com.example.project1.controller;

import com.example.project1.dto.AuthRequest;
import com.example.project1.dto.AuthResponse;
import com.example.project1.model.User;
import com.example.project1.security.JwtService;
import com.example.project1.service.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"}, allowCredentials = "true")
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    private final JwtService jwtService;
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @PostMapping("/signup")
    public ResponseEntity<Object> signup(@RequestBody AuthRequest request) {
        try {
            String role = request.getRole();
            if (role == null || (!role.equalsIgnoreCase("admin") && !role.equalsIgnoreCase("user"))) {
                role = "user"; // default
            }
            User user = userService.register(request.getUsername(), request.getPassword(), role, request.getEmail());
            String token = jwtService.generateToken(user.getUsername());
            return ResponseEntity.ok(new AuthResponse(token, "Signup successful"));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(409).body(java.util.Map.of("error", "Username already exists"));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).body(java.util.Map.of("error", "Signup failed", "detail", ex.getClass().getSimpleName()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody AuthRequest request) {
        if (request == null) {
            log.debug("Login called with null request");
            return ResponseEntity.status(400).body("Missing credentials");
        }
        String identifier = request.getUsername();
        log.debug("Login attempt for identifier='{}'", identifier);
        return userService.authenticate(request)
                .map(u -> {
                    log.debug("Authentication success for username='{}' (id={})", u.getUsername(), u.getId());
                    return ResponseEntity.<Object>ok(new AuthResponse(jwtService.generateToken(u.getUsername()), "Login successful"));
                })
                .orElseGet(() -> {
                    log.debug("Authentication failed for identifier='{}'", identifier);
                    return ResponseEntity.status(401).body((Object)"Invalid credentials");
                });
    }
}
