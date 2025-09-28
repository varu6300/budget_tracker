package com.example.project1.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class TransactionRequest {
    private BigDecimal amount; // positive
    private String type; // INCOME or EXPENSE
    private String description;
    private String category;
}
