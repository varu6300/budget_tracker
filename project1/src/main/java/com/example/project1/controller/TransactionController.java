package com.example.project1.controller;

import com.example.project1.dto.TransactionRequest;
import com.example.project1.dto.TransactionResponse;
import com.example.project1.model.Transaction;
import com.example.project1.model.TransactionType;
import com.example.project1.model.User;
import com.example.project1.repository.UserRepository;
import com.example.project1.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionService transactionService;
    private final UserRepository userRepository;

    private User domainUser(UserDetails principal){
        return userRepository.findByUsername(principal.getUsername()).orElseThrow();
    }

    @PostMapping
    public ResponseEntity<?> create(@AuthenticationPrincipal UserDetails principal, @RequestBody TransactionRequest req){
        try {
            User user = domainUser(principal);
            TransactionType type = TransactionType.valueOf(req.getType().toUpperCase());
            Transaction t = transactionService.create(user, req.getAmount(), type, req.getDescription(), req.getCategory());
            return ResponseEntity.ok(TransactionResponse.of(t));
        } catch (IllegalArgumentException ex){
            return ResponseEntity.badRequest().body(java.util.Map.of("error", ex.getMessage()));
        }
    }

    @GetMapping
    public List<TransactionResponse> recent(@AuthenticationPrincipal UserDetails principal){
        User user = domainUser(principal);
        return transactionService.recent(user).stream().map(TransactionResponse::of).collect(Collectors.toList());
    }

    @PostMapping("/reset")
    public ResponseEntity<?> reset(@AuthenticationPrincipal UserDetails principal){
        User user = domainUser(principal);
        transactionService.reset(user);
        // Return an empty list + zeroed summary convenience
        return ResponseEntity.ok(java.util.Map.of(
                "transactions", java.util.List.of(),
                "summary", java.util.Map.of(
                        "username", user.getUsername(),
                        "currentBalance", 0,
                        "totalIncome", 0,
                        "totalExpenses", 0
                )
        ));
    }
}
