package com.example.project1.repository;

import com.example.project1.model.Income;
import com.example.project1.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface IncomeRepository extends JpaRepository<Income, Long> {
    List<Income> findByUser(User user);
    Optional<Income> findByIdAndUser(Long id, User user);
}
