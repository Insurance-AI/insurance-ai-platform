package com.example.insurance_ai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class InsuranceRequest {

    @JsonProperty("Age")
    private int age;

    @JsonProperty("Gender")
    private String gender;

    @JsonProperty("Smoking_Status")
    private String smokingStatus;

    @JsonProperty("Annual_Income")
    private double annualIncome;

    @JsonProperty("Existing_Loans_Debts")
    private int existingLoansDebts;

    @JsonProperty("Existing_Insurance_Policies")
    private int existingInsurancePolicies;

    @JsonProperty("Desired_Sum_Assured")
    private double desiredSumAssured;

    @JsonProperty("Policy_Term_Years")
    private int policyTermYears;

    @JsonProperty("Premium_Payment_Option")
    private String premiumPaymentOption;

    @JsonProperty("Death_Benefit_Option")
    private String deathBenefitOption;

    @JsonProperty("Payout_Type")
    private String payoutType;

    @JsonProperty("Medical_History")
    private String medicalHistory;

    @JsonProperty("Lifestyle_Habits")
    private String lifestyleHabits;

    @JsonProperty("Interest_in_Optional_Riders")
    private boolean interestInOptionalRiders;

    @JsonProperty("Interest_in_Tax_Saving")
    private boolean interestInTaxSaving;
}
