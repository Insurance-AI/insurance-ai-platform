package com.example.insurance_ai.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlanRecommendation {
    private String plan;
    private double confidence;
}
