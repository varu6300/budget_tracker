package com.example.project1.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount; // always positive

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private TransactionType type; // INCOME or EXPENSE

    @Column(length = 120)
    private String description;

    @Column(length = 60)
    private String category;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist(){
        if(createdAt == null) createdAt = LocalDateTime.now();
    }
}
