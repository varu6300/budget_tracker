package com.example.project1.controller;

import com.example.project1.dto.IncomeRequest;
import com.example.project1.dto.IncomeResponse;
import com.example.project1.model.Income;
import com.example.project1.model.User;
import com.example.project1.repository.UserRepository;
import com.example.project1.service.IncomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/income")
@RequiredArgsConstructor
public class IncomeController {
    private final IncomeService incomeService;
    private final UserRepository userRepository;

    private User domainUser(UserDetails userDetails){
        return userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody IncomeRequest req){
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(userDetails == null) return ResponseEntity.status(401).body(java.util.Map.of("error","Authentication required"));
        User user = domainUser(userDetails);
        Income income = incomeService.create(user, req.getAmount(), req.getCategory(), req.getDate(), req.getDescription());
        return ResponseEntity.ok(IncomeResponse.of(income));
    }

    @GetMapping
    public List<IncomeResponse> list(){
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(userDetails == null) throw new IllegalStateException("Authentication required");
        User user = domainUser(userDetails);
        return incomeService.list(user).stream().map(IncomeResponse::of).collect(Collectors.toList());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody IncomeRequest req){
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(userDetails == null) return ResponseEntity.status(401).body(java.util.Map.of("error","Authentication required"));
        User user = domainUser(userDetails);
        Income income = incomeService.update(user, id, req.getAmount(), req.getCategory(), req.getDate(), req.getDescription());
        return ResponseEntity.ok(IncomeResponse.of(income));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id){
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(userDetails == null) return ResponseEntity.status(401).body(java.util.Map.of("error","Authentication required"));
        User user = domainUser(userDetails);
        incomeService.delete(user, id);
        return ResponseEntity.noContent().build();
    }
}
