package com.example.project1.controller;

import com.example.project1.dto.TransactionRequest;
import com.example.project1.dto.TransactionResponse;
import com.example.project1.model.Transaction;
import com.example.project1.model.TransactionType;
import com.example.project1.model.User;
import com.example.project1.repository.UserRepository;
import com.example.project1.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;


import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {
    private static final Logger log = LoggerFactory.getLogger(TransactionController.class);
    private final TransactionService transactionService;
    private final UserRepository userRepository;

    private User domainUser(UserDetails userDetails){
        if (userDetails == null) {
            log.warn("domainUser: userDetails is null");
            throw new IllegalStateException("Authentication required");
        }
        return userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
    }

    // Paged history with optional filters
    @GetMapping("/history")
    public Page<TransactionResponse> history(
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "category", required = false) String category
    ){
        UserDetails userDetails = null;
        try {
            userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        } catch (Exception e) {
            log.error("Failed to get userDetails from SecurityContextHolder", e);
        }
        log.debug("history: userDetails={}", userDetails);
        if(userDetails == null) throw new IllegalStateException("Authentication required");
        User user = domainUser(userDetails);
        TransactionType txType = null;
        if(type != null && !type.isBlank()){
            try { txType = TransactionType.valueOf(type.toUpperCase()); } catch (Exception ignored) {}
        }
        return transactionService.history(user, page, size, txType, category)
                .map(TransactionResponse::of);
    }

    @GetMapping("/categories")
    public List<String> categories(){
        UserDetails userDetails = null;
        try {
            userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        } catch (Exception e) {
            log.error("Failed to get userDetails from SecurityContextHolder", e);
        }
        log.debug("categories: userDetails={}", userDetails);
        if(userDetails == null) throw new IllegalStateException("Authentication required");
        User user = domainUser(userDetails);
        return transactionService.categories(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestBody TransactionRequest req
    ){
        try {
            UserDetails userDetails = null;
            try {
                userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            } catch (Exception e) {
                log.error("Failed to get userDetails from SecurityContextHolder", e);
            }
            log.debug("update: userDetails={}", userDetails);
            if(userDetails == null) return ResponseEntity.status(401).body(java.util.Map.of("error","Authentication required"));
            User user = domainUser(userDetails);
            TransactionType type = (req.getType() != null) ? TransactionType.valueOf(req.getType().toUpperCase()) : null;
            Transaction t = transactionService.update(user, id, req.getAmount(), type, req.getDescription(), req.getCategory());
            return ResponseEntity.ok(TransactionResponse.of(t));
        } catch (IllegalArgumentException ex){
            return ResponseEntity.badRequest().body(java.util.Map.of("error", ex.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id){
        UserDetails userDetails = null;
        try {
            userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        } catch (Exception e) {
            log.error("Failed to get userDetails from SecurityContextHolder", e);
        }
        log.debug("delete: userDetails={}", userDetails);
        if(userDetails == null) return ResponseEntity.status(401).body(java.util.Map.of("error","Authentication required"));
        User user = domainUser(userDetails);
        try {
            transactionService.delete(user, id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException ex){
            if ("Not found".equals(ex.getMessage())) {
                return ResponseEntity.status(404).body(java.util.Map.of("error", "Transaction not found"));
            }
            return ResponseEntity.badRequest().body(java.util.Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody TransactionRequest req){
        try {
            UserDetails userDetails = null;
            try {
                userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            } catch (Exception e) {
                log.error("Failed to get userDetails from SecurityContextHolder", e);
            }
            log.debug("create: userDetails={}", userDetails);
            if(userDetails == null) return ResponseEntity.status(401).body(java.util.Map.of("error","Authentication required"));
            User user = domainUser(userDetails);
            TransactionType type = TransactionType.valueOf(req.getType().toUpperCase());
            Transaction t = transactionService.create(user, req.getAmount(), type, req.getDescription(), req.getCategory());
            return ResponseEntity.ok(TransactionResponse.of(t));
        } catch (IllegalArgumentException ex){
            return ResponseEntity.badRequest().body(java.util.Map.of("error", ex.getMessage()));
        }
    }

    @GetMapping
    public List<TransactionResponse> recent(){
        UserDetails userDetails = null;
        try {
            userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        } catch (Exception e) {
            log.error("Failed to get userDetails from SecurityContextHolder", e);
        }
        log.debug("recent: userDetails={}", userDetails);
        if(userDetails == null) throw new IllegalStateException("Authentication required");
        User user = domainUser(userDetails);
        return transactionService.recent(user).stream().map(TransactionResponse::of).collect(Collectors.toList());
    }

    @PostMapping("/reset")
    public ResponseEntity<?> reset(){
        UserDetails userDetails = null;
        try {
            userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        } catch (Exception e) {
            log.error("Failed to get userDetails from SecurityContextHolder", e);
        }
        log.debug("reset: userDetails={}", userDetails);
        if(userDetails == null) return ResponseEntity.status(401).body(java.util.Map.of("error","Authentication required"));
        User user = domainUser(userDetails);
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
