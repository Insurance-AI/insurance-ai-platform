package com.example.insurance_ai.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class AnalysisResponse {
    private Map<String, Object> weeklySpending;
    private Map<String, Object> monthlySpending;
    private Map<String, Object> yearlySpending;
    private Map<String, Object> categorySpending;
    private Map<String, Object> insuranceCounts;
    private Map<String, Object> insuranceSpending;
    private Map<String, Map<String, Object>> recommendations;
    private List<Map<String, Object>> transactions;
    private List<Map<String, Object>> categoryInsights;
    private Map<String, Object> financialAdvice;
}
