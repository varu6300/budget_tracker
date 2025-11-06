package com.example.project1.repository;

import com.example.project1.model.Transaction;
import com.example.project1.model.TransactionType;
import com.example.project1.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findTop10ByUserOrderByCreatedAtDesc(User user);

    @Query("select coalesce(sum(t.amount),0) from Transaction t where t.user=:user and t.type=:type")
    BigDecimal sumByType(@Param("user") User user, @Param("type") TransactionType type);

    void deleteByUser(User user);

    // History / paging
    Page<Transaction> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    Page<Transaction> findByUserAndTypeOrderByCreatedAtDesc(User user, TransactionType type, Pageable pageable);
    Page<Transaction> findByUserAndCategoryOrderByCreatedAtDesc(User user, String category, Pageable pageable);
    Page<Transaction> findByUserAndTypeAndCategoryOrderByCreatedAtDesc(User user, TransactionType type, String category, Pageable pageable);

    // Ownership helpers
    Optional<Transaction> findByIdAndUser(Long id, User user);

    // Distinct categories for a user
    @Query("select distinct t.category from Transaction t where t.user=:user and t.category is not null and t.category <> '' order by t.category asc")
    List<String> distinctCategories(@Param("user") User user);
}
