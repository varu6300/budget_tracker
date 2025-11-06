package com.example.project1.dto;

import com.example.project1.model.Income;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class IncomeResponse {
    private Long id;
    private BigDecimal amount;
    private String category;
    private LocalDate date;
    private String description;

    public static IncomeResponse of(Income income) {
        IncomeResponse resp = new IncomeResponse();
        resp.setId(income.getId());
        resp.setAmount(income.getAmount());
        resp.setCategory(income.getCategory());
        resp.setDate(income.getDate());
        resp.setDescription(income.getDescription());
        return resp;
    }
}
