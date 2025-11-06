package com.example.project1.controller;

import com.example.project1.model.SavingsGoal;
import com.example.project1.service.SavingsGoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
public class SavingsGoalController {
    @Autowired
    private SavingsGoalService savingsGoalService;

    @GetMapping
    public List<SavingsGoal> getAllGoals() {
        return savingsGoalService.getAllGoals();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SavingsGoal> getGoal(@PathVariable Long id) {
        return savingsGoalService.getGoal(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public SavingsGoal createGoal(@RequestBody SavingsGoal goal) {
        return savingsGoalService.saveGoal(goal);
    }

    @PutMapping("/{id}")
    public SavingsGoal updateGoal(@PathVariable Long id, @RequestBody SavingsGoal goal) {
        return savingsGoalService.updateGoal(id, goal);
    }

    @DeleteMapping("/{id}")
    public void deleteGoal(@PathVariable Long id) {
        savingsGoalService.deleteGoal(id);
    }
}
