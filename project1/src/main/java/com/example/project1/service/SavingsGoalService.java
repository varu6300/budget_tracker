package com.example.project1.service;

import com.example.project1.model.SavingsGoal;
import com.example.project1.repository.SavingsGoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SavingsGoalService {
    @Autowired
    private SavingsGoalRepository savingsGoalRepository;

    public List<SavingsGoal> getAllGoals() {
        return savingsGoalRepository.findAll();
    }

    public Optional<SavingsGoal> getGoal(Long id) {
        return savingsGoalRepository.findById(id);
    }

    public SavingsGoal saveGoal(SavingsGoal goal) {
        return savingsGoalRepository.save(goal);
    }

    public void deleteGoal(Long id) {
        savingsGoalRepository.deleteById(id);
    }

    public SavingsGoal updateGoal(Long id, SavingsGoal updatedGoal) {
        SavingsGoal goal = savingsGoalRepository.findById(id).orElseThrow();
        goal.setName(updatedGoal.getName());
        goal.setTargetAmount(updatedGoal.getTargetAmount());
        goal.setSavedAmount(updatedGoal.getSavedAmount());
        goal.setDeadline(updatedGoal.getDeadline());
        return savingsGoalRepository.save(goal);
    }
}
