package com.example.insurance_ai.controller;

import com.example.insurance_ai.dto.InsuranceResponse;
import com.example.insurance_ai.dto.PlanRecommendation;
import com.example.insurance_ai.service.GeminiService;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/gemini")
@CrossOrigin("*")
public class GeminiController {
    private final GeminiService geminiService;

    public GeminiController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/compare")
    public String compareInsurancePolicies(@RequestBody InsuranceResponse request) throws IOException {
        List<PlanRecommendation> plans = request.getRecommendations();

        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append("Please generate a JSON output comparing insurance policies. I will provide the policy data as a list of comma-separated strings, where each string represents one policy and contains 10 specific fields in the following order:\n\n")
                .append("Insurance Name (String)\nInsurance Type (String)\nPolicy Term Min (Number)\nPolicy Term Max (Number)\nSum Assured Min (Number)\nKey Benefits/Riders (Array in quotes)\nMedical Considerations (String)\nPremium Payment Option (String)\nFeatures Description (String)\nSample Premium (Number)\n\n")
                .append("Ensure the output JSON strictly adheres to the expected structure.\n\n")
                .append("I want to compare the policies from the following list:\n[\n");

        for (PlanRecommendation plan : plans) {
            String line = String.format(
                    "\"%s\",\"%s\",%d,%d,%d,[\"%s\"],\"%s\",\"%s\",\"%s\",%d",
                    plan.getPlan(),
                    plan.getType(),
                    getMinPolicyTerm(plan.getPolicy_term_range()),
                    getMaxPolicyTerm(plan.getPolicy_term_range()),
                    getMinSumAssured(plan.getSum_assured_range()),
                    formatRiders(plan.getRiders_available()),
                    plan.getMedical_required() != null ? plan.getMedical_required() : "Unknown",
                    plan.getPayment_option() != null ? plan.getPayment_option() : "Unknown",
                    plan.getFeatures() != null ? plan.getFeatures() : "No description",
                    getSamplePremium(plan.getPremium_range())
            );
            promptBuilder.append(line).append(",\n");
        }

        promptBuilder.append("]");

        return geminiService.getInsuranceComparisonJson(promptBuilder.toString());
    }

    private int getMinPolicyTerm(String range) {
        try {
            return Integer.parseInt(range.split("-")[0].trim());
        } catch (Exception e) {
            return 0;
        }
    }

    private int getMaxPolicyTerm(String range) {
        try {
            return Integer.parseInt(range.split("-")[1].trim());
        } catch (Exception e) {
            return 100;
        }
    }

    private int getMinSumAssured(String range) {
        try {
            return Integer.parseInt(range.split("-")[0].trim().replaceAll("[^\\d]", ""));
        } catch (Exception e) {
            return 0;
        }
    }

    private int getSamplePremium(String range) {
        try {
            return Integer.parseInt(range.split("-")[0].trim().replaceAll("[^\\d]", ""));
        } catch (Exception e) {
            return 0;
        }
    }

    private String formatRiders(String riders) {
        if (riders == null || riders.isEmpty()) return "";
        return riders.replace(",", "\",\"");
    }
}
