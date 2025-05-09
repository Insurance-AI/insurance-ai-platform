package com.example.insurance_ai.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class AnalysisResponse {
    private Integer transactionCount;
    private Double totalSpending;
    private Map<String, Double> weeklySpending;
    private Map<String, Double> monthlySpending;
    private Map<String, Double> yearlySpending;
    private Map<String, Double> categorySpending;
    private Map<String, Integer> insuranceCounts;
    private Map<String, Object> insuranceSpending;
    private Map<String, Map<String, Object>> recommendations;
    private List<Map<String, Object>> transactions;
    private List<Map<String, Object>> categoryInsights;
    private Map<String, Object> financialAdvice;
    private Map<String, Double> dailyAverages;
    private String summary;
}