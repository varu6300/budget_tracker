package com.example.project1.controller;

import com.example.project1.model.User;
import com.example.project1.repository.UserRepository;
import com.example.project1.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class SummaryController {
    private final TransactionService transactionService;
    private final UserRepository userRepository;

    public SummaryController(TransactionService transactionService, UserRepository userRepository) {
        this.transactionService = transactionService;
        this.userRepository = userRepository;
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> summary(@AuthenticationPrincipal UserDetails principal) {
        if(principal == null){
            return ResponseEntity.status(401).body(Map.of("error", "Unauthenticated"));
        }
        User user = userRepository.findByUsername(principal.getUsername()).orElseThrow();
        return ResponseEntity.ok(transactionService.summary(user));
    }
}

