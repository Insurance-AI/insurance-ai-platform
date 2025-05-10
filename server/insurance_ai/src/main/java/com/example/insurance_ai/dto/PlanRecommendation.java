package com.example.insurance_ai.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlanRecommendation {
    private String plan;
    private double confidence;
    private String type;
    private String features;
    private String CSR;
    private String sum_assured_range;
    private String premium_range;
    private String medical_required;
    private String return_of_premium;
    private String policy_term_range;
    private String life_cover_till_age;
    private String payout_type;
    private String riders_available;
    private String income_criteria;
    private String payment_option;
    private String death_benefit_option;
}
