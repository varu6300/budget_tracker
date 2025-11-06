package com.example.project1.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class IncomeRequest {
    private BigDecimal amount;
    private String category;
    private LocalDate date;
    private String description;
}
