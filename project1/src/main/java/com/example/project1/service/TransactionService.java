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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

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
                "email", user.getEmail(),
                "currentBalance", balance,
                "totalIncome", income,
                "totalExpenses", expenses
        );
    }

    @Transactional
    public void reset(User user){
        transactionRepository.deleteByUser(user);
    }

    public Page<Transaction> history(User user, Integer page, Integer size, TransactionType type, String category){
        Pageable pageable = PageRequest.of(page == null ? 0 : Math.max(0,page), size == null ? 10 : Math.max(1, Math.min(size, 100)));
        if(type != null && category != null && !category.isBlank()){
            return transactionRepository.findByUserAndTypeAndCategoryOrderByCreatedAtDesc(user, type, category, pageable);
        } else if(type != null){
            return transactionRepository.findByUserAndTypeOrderByCreatedAtDesc(user, type, pageable);
        } else if(category != null && !category.isBlank()){
            return transactionRepository.findByUserAndCategoryOrderByCreatedAtDesc(user, category, pageable);
        }
        return transactionRepository.findByUserOrderByCreatedAtDesc(user, pageable);
    }

    public List<String> categories(User user){
        return transactionRepository.distinctCategories(user);
    }

    @Transactional
    public Transaction update(User user, Long id, BigDecimal amount, TransactionType type, String description, String category){
        Transaction t = transactionRepository.findByIdAndUser(id, user).orElseThrow(() -> new IllegalArgumentException("Not found"));
        if(amount != null){
            if(amount.compareTo(BigDecimal.ZERO) <= 0) throw new IllegalArgumentException("Amount must be positive");
            t.setAmount(amount.setScale(2, RoundingMode.HALF_UP));
        }
        if(type != null) t.setType(type);
        if(description != null) t.setDescription(description);
        if(category != null) t.setCategory(category);
        return transactionRepository.save(t);
    }

    @Transactional
    public void delete(User user, Long id){
        Transaction t = transactionRepository.findByIdAndUser(id, user).orElseThrow(() -> new IllegalArgumentException("Not found"));
        transactionRepository.delete(t);
    }
}
