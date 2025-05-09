package com.example.insurance_ai.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class InsuranceRequest {
    private int age;
    private String gender;
    private String smokingStatus;
    private double annualIncome;
    private int existingLoansDebts;
    private int existingInsurancePolicies;
    private double desiredSumAssured;
    private int policyTermYears;
    private String premiumPaymentOption;
    private String deathBenefitOption;
    private String payoutType;
    private String medicalHistory;
    private String lifestyleHabits;
    private boolean interestInOptionalRiders;
    private boolean interestInTaxSaving;
}
