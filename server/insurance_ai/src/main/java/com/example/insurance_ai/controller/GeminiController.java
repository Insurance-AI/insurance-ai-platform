package com.example.insurance_ai.controller;

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
    public String compareInsurancePolicies(@RequestBody List<String> insurancePolicies) throws IOException, IOException {

        // Construct the prompt by appending the insurance policies to it
        String prompt = "Please generate a JSON output comparing insurance policies. I will provide the policy data as a list of comma-separated strings, where each string represents one policy and contains 10 specific fields in the following order:\n" +
                "\n" +
                "Insurance Name (String)\n" +
                "\n" +
                "Insurance Type (String)\n" +
                "\n" +
                "Entry Age Min (Number)\n" +
                "\n" +
                "Entry Age Max (Number)\n" +
                "\n" +
                "Sum Assured Min (Number)\n" +
                "\n" +
                "Key Benefits/Riders (String - if multiple benefits are within quotes and comma-separated, parse them into an array of strings; e.g., \"Life Cover, Disability\" becomes [\"Life Cover\", \"Disability\"]. If a single benefit, it should also be in an array, e.g., \"Education Benefit\" becomes [\"Education Benefit\"].)\n" +
                "\n" +
                "Medical Considerations (String)\n" +
                "\n" +
                "Premium Payment Option (String)\n" +
                "\n" +
                "Features Description (String)\n" +
                "\n" +
                "Sample Premium (Number)\n" +
                "\n" +
                "Key Assumptions to Apply:\n" +
                "\n" +
                "Sum Assured Min: Interpret this as the direct numerical value (e.g., 1200 means 1200 currency units). Assume the currency is Rupees (₹) unless specified otherwise.\n" +
                "\n" +
                "Sample Premium: Interpret this as an illustrative premium amount, likely for the sum_assured_min under specific but unstated conditions (like a base policy term and entry age). It is not an absolute minimum or maximum premium.\n" +
                "\n" +
                "Currency: Assume Rupees (₹) for all monetary values (sum_assured_min, sample_premium).\n" +
                "\n" +
                "Desired JSON Output Structure:\n" +
                "\n" +
                "The top-level JSON object must contain two keys: insurance_plans and comparison_summary.\n" +
                "\n" +
                "insurance_plans (Array of Objects):\n" +
                "Each object in this array represents one policy and must contain the following keys only, in this order, and with the specified data types:\n" +
                "\n" +
                "insurance_name (String)\n" +
                "\n" +
                "insurance_type (String)\n" +
                "\n" +
                "entry_age_min (Number)\n" +
                "\n" +
                "entry_age_max (Number)\n" +
                "\n" +
                "sum_assured_min (Number)\n" +
                "\n" +
                "key_benefits_or_riders (Array of Strings)\n" +
                "\n" +
                "medical_considerations (String)\n" +
                "\n" +
                "premium_payment_option (String)\n" +
                "\n" +
                "features_description (String)\n" +
                "\n" +
                "sample_premium (Number)\n" +
                "(There should be NO 'note' fields like sum_assured_unit_note or sample_premium_note within these individual policy objects.)\n" +
                "\n" +
                "comparison_summary (Object):\n" +
                "This object must not contain a top-level \"notes\" array. It must contain the following keys, with their values providing comparative insights based on the processed policy data. Integrate any necessary clarifications or interpretations directly into the descriptive text of these summary points:\n" +
                "\n" +
                "insurance_types (String: e.g., \"All X plans are 'Endowment Plan' type.\")\n" +
                "\n" +
                "entry_age_range (Object: with sub-keys like overall_min_age, overall_max_age, adult_focused_start, common_max_entry_age_bracket)\n" +
                "\n" +
                "minimum_sum_assured_comparison (Object: with sub-keys like lowest, highest, range, and implication - the implication text should reflect the understanding of low sum assured values and assume currency as Rupees.)\n" +
                "\n" +
                "key_benefit_focus (Object: with sub-keys categorizing benefits like life_protection_core, health_and_event_riders, specific_goal)\n" +
                "\n" +
                "medical_considerations_patterns (Object: with sub-keys like specific_conditions, event_based, none_specified)\n" +
                "\n" +
                "premium_payment_options (Object: with sub-keys for frequencies like yearly, quarterly, half_yearly. If data contradictions exist, like the Single Premium plan example, mention it concisely within the text, e.g., \"Single Premium Endowment (note: description suggests single pay, data shows yearly)...\")\n" +
                "\n" +
                "distinctive_features (Object: with sub-keys highlighting unique aspects like single_premium_intent, combination_cover, education_focus)\n" +
                "\n" +
                "sample_premium_observations (Object: with sub-keys like range and relative_to_sum_assured. The relative_to_sum_assured text should note if premiums appear high relative to the sum assured and suggest clarification of data for practical understanding.)\n" +
                "\n" +
                "Example of how I will provide the policy data:\n" +
                "\n" +
                "I want to compare the  policies from the following list:\n" +
                "\n" +
                "[\n" +
                "LIC's Single Premium Endowment Plan,Endowment Plan,8,65,1500,\"Hospitalization, Critical Illness\",Accidents,Yearly,Single premium payment option,5000\n" +
                "LIC's New Endowment Plan,Endowment Plan,8,60,1200,\"Life Cover, Disability\",Chronic Illness,Yearly,Endowment with life cover,4000\n" +
                "LIC's New Jeevan Anand,Endowment Plan,18,50,1800,\"Life Cover, Accident\",Pre-existing conditions,Quarterly,Combination of endowment and life cover,4500\n" +
                "LIC's Jeevan Lakshya,Endowment Plan,18,50,1700,Education Benefit,Lifestyle diseases,Quarterly,Supports education expenses,4000\n" +
                "LIC's Jeevan Labh Plan,Endowment Plan,8,59,1600,Death Benefit,None,Half-yearly,Limited premium payment,4200\n" +
                "LIC's Amritbaal,Child Plan,0,13,800,Child Education,Age restriction,Yearly,Secure child's future,3000\n" +
                "]\n" +
                "\n" +
                "\n" +
                "Ensure the output JSON strictly adheres to this structure and incorporates the interpretations as defined.\n" +
                "\n" +
                "\n\n";
        prompt += String.join("\n", insurancePolicies);  // Join the list into a string with line breaks

        // Call the GeminiService to get the comparison JSON response
        return geminiService.getInsuranceComparisonJson(prompt);
    }
}
