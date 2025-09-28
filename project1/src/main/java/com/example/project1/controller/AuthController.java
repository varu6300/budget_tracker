package com.example.project1.controller;

import com.example.project1.dto.AuthRequest;
import com.example.project1.dto.AuthResponse;
import com.example.project1.model.User;
import com.example.project1.security.JwtService;
import com.example.project1.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"}, allowCredentials = "true")
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    private final JwtService jwtService;

    @PostMapping("/signup")
    public ResponseEntity<Object> signup(@RequestBody AuthRequest request) {
        try {
            User user = userService.register(request.getUsername(), request.getPassword());
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
        return userService.authenticate(request)
                .map(u -> ResponseEntity.<Object>ok(new AuthResponse(jwtService.generateToken(u.getUsername()), "Login successful")))
                .orElse(ResponseEntity.status(401).body((Object)"Invalid credentials"));
    }
}
