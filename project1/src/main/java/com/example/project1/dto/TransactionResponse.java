package com.example.project1.dto;

import com.example.project1.model.Transaction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class TransactionResponse {
    private Long id;
    private BigDecimal amount;
    private String type;
    private String description;
    private String category;
    private LocalDateTime createdAt;

    public static TransactionResponse of(Transaction t){
        return TransactionResponse.builder()
                .id(t.getId())
                .amount(t.getAmount())
                .type(t.getType().name())
                .description(t.getDescription())
                .category(t.getCategory())
                .createdAt(t.getCreatedAt())
                .build();
    }
}
