package com.example.project1.service;

import com.example.project1.model.Transaction;
import com.example.project1.model.TransactionType;
import com.example.project1.model.User;
import com.example.project1.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;

    public Transaction create(User user, BigDecimal amount, TransactionType type, String description, String category){
        if(user == null) throw new IllegalArgumentException("User required");
        if(amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) throw new IllegalArgumentException("Amount must be positive");
        if(type == null) throw new IllegalArgumentException("Type required");
    Transaction t = Transaction.builder()
        .user(user)
        .amount(amount.setScale(2, RoundingMode.HALF_UP))
                .type(type)
                .description(description)
                .category(category)
                .build();
        return transactionRepository.save(t);
    }

    public List<Transaction> recent(User user){
        return transactionRepository.findTop10ByUserOrderByCreatedAtDesc(user);
    }

    public Map<String,Object> summary(User user){
        BigDecimal income = transactionRepository.sumByType(user, TransactionType.INCOME);
        BigDecimal expenses = transactionRepository.sumByType(user, TransactionType.EXPENSE);
        BigDecimal balance = income.subtract(expenses);
        return Map.of(
                "username", user.getUsername(),
                "currentBalance", balance,
                "totalIncome", income,
                "totalExpenses", expenses
        );
    }

    @Transactional
    public void reset(User user){
        transactionRepository.deleteByUser(user);
    }
}
