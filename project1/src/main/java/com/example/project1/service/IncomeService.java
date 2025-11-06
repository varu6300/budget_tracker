package com.example.project1.service;

import com.example.project1.model.Income;
import com.example.project1.model.User;
import com.example.project1.repository.IncomeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IncomeService {
    private final IncomeRepository incomeRepository;

    public Income create(User user, BigDecimal amount, String category, LocalDate date, String description) {
        Income income = Income.builder()
                .user(user)
                .amount(amount)
                .category(category)
                .date(date)
                .description(description)
                .build();
        return incomeRepository.save(income);
    }

    public List<Income> list(User user) {
        return incomeRepository.findByUser(user);
    }

    public Income update(User user, Long id, BigDecimal amount, String category, LocalDate date, String description) {
        Income income = incomeRepository.findByIdAndUser(id, user).orElseThrow(() -> new IllegalArgumentException("Not found"));
        income.setAmount(amount);
        income.setCategory(category);
        income.setDate(date);
        income.setDescription(description);
        return incomeRepository.save(income);
    }

    public void delete(User user, Long id) {
        Income income = incomeRepository.findByIdAndUser(id, user).orElseThrow(() -> new IllegalArgumentException("Not found"));
        incomeRepository.delete(income);
    }
}
