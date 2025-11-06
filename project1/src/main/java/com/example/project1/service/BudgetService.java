package com.example.project1.service;

import com.example.project1.model.Budget;
import com.example.project1.repository.BudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BudgetService {
    @Autowired
    private BudgetRepository budgetRepository;

    public List<Budget> getAllBudgets() {
        return budgetRepository.findAll();
    }

    public Optional<Budget> getBudget(Long id) {
        return budgetRepository.findById(id);
    }

    public Budget saveBudget(Budget budget) {
        return budgetRepository.save(budget);
    }

    public void deleteBudget(Long id) {
        budgetRepository.deleteById(id);
    }

    public Budget updateProgress(Long id, Double amount) {
        Budget budget = budgetRepository.findById(id).orElseThrow();
        budget.setCurrentAmount(amount);
        if (amount >= budget.getGoalAmount()) {
            budget.setAlertTriggered(true);
        } else {
            budget.setAlertTriggered(false);
        }
        return budgetRepository.save(budget);
    }
}
