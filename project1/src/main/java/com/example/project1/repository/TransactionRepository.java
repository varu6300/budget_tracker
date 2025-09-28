package com.example.project1.repository;

import com.example.project1.model.Transaction;
import com.example.project1.model.TransactionType;
import com.example.project1.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findTop10ByUserOrderByCreatedAtDesc(User user);

    @Query("select coalesce(sum(t.amount),0) from Transaction t where t.user=:user and t.type=:type")
    BigDecimal sumByType(@Param("user") User user, @Param("type") TransactionType type);

    void deleteByUser(User user);
}
