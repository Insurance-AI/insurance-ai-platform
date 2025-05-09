package com.example.insurance_ai.service;

import com.example.insurance_ai.dto.AnalysisResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

@Service
public class FinanceAnalysisService {
    @Value("${fastapi.url:http://127.0.0.1:8000/analyze}")
    private String fastApiUrl;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();

    public AnalysisResponse analyzeData(MultipartFile file) throws Exception {
        try {
            // Create headers for multipart request
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            // Create multipart request body
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

            // Add file part
            body.add("file", createFileResource(file));

            // Create the HTTP entity
            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            // Make the request to FastAPI
            ResponseEntity<String> response = restTemplate.postForEntity(
                    fastApiUrl,
                    requestEntity,
                    String.class
            );

            // Process the response
            String jsonResponse = response.getBody();
            if (jsonResponse != null) {
                JsonNode jsonResult = objectMapper.readTree(jsonResponse);
                return parseAnalysisResponse(jsonResult);
            } else {
                throw new RuntimeException("Empty response from FastAPI endpoint");
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to analyze data: " + e.getMessage(), e);
        }
    }

    private org.springframework.core.io.Resource createFileResource(MultipartFile file) throws IOException {
        return new org.springframework.core.io.ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        };
    }

    private AnalysisResponse parseAnalysisResponse(JsonNode jsonResult) {
        return AnalysisResponse.builder()
                .weeklySpending(jsonResult.has("spending_patterns") && jsonResult.get("spending_patterns").has("weekly_trend") ?
                        convertToMap(jsonResult.get("spending_patterns").get("weekly_trend")) : null)
                .monthlySpending(jsonResult.has("spending_patterns") && jsonResult.get("spending_patterns").has("monthly_trend") ?
                        convertToMap(jsonResult.get("spending_patterns").get("monthly_trend")) : null)
                .yearlySpending(jsonResult.has("yearly_spending") ?
                        convertToMap(jsonResult.get("yearly_spending")) : null)
                .categorySpending(jsonResult.has("spending_patterns") && jsonResult.get("spending_patterns").has("top_categories") ?
                        convertToMap(jsonResult.get("spending_patterns").get("top_categories")) : null)
                .insuranceCounts(jsonResult.has("spending_patterns") && jsonResult.get("spending_patterns").has("top_insurance_labels") ?
                        convertToMap(jsonResult.get("spending_patterns").get("top_insurance_labels")) : null)
                .insuranceSpending(jsonResult.has("insurance_spending") ?
                        convertToMap(jsonResult.get("insurance_spending")) : null)
                .recommendations(jsonResult.has("insurance_recommendations") ?
                        convertToMapOfMaps(jsonResult.get("insurance_recommendations")) : null)
                .transactions(jsonResult.has("transactions") ?
                        convertToList(jsonResult.get("transactions")) : null)
                .categoryInsights(convertCategoryInsights(jsonResult))
                .financialAdvice(jsonResult.has("financial_advice") ?
                        convertToMap(jsonResult.get("financial_advice")) : null)
                .build();
    }

    private List<Map<String, Object>> convertCategoryInsights(JsonNode jsonResult) {
        if (!jsonResult.has("category_insights")) {
            return null;
        }

        List<Map<String, Object>> insights = new ArrayList<>();
        JsonNode categoryInsights = jsonResult.get("category_insights");
        Iterator<String> fieldNames = categoryInsights.fieldNames();

        while (fieldNames.hasNext()) {
            String category = fieldNames.next();
            JsonNode categoryData = categoryInsights.get(category);

            Map<String, Object> insight = convertToMap(categoryData);
            insight.put("category", category);
            insights.add(insight);
        }

        return insights;
    }

    private Map<String, Object> convertToMap(JsonNode jsonNode) {
        Map<String, Object> result = new HashMap<>();
        Iterator<String> fieldNames = jsonNode.fieldNames();

        while (fieldNames.hasNext()) {
            String fieldName = fieldNames.next();
            JsonNode fieldValue = jsonNode.get(fieldName);

            if (fieldValue.isTextual()) {
                result.put(fieldName, fieldValue.asText());
            } else if (fieldValue.isInt()) {
                result.put(fieldName, fieldValue.asInt());
            } else if (fieldValue.isLong()) {
                result.put(fieldName, fieldValue.asLong());
            } else if (fieldValue.isDouble()) {
                result.put(fieldName, fieldValue.asDouble());
            } else if (fieldValue.isBoolean()) {
                result.put(fieldName, fieldValue.asBoolean());
            } else if (fieldValue.isObject()) {
                result.put(fieldName, convertToMap(fieldValue));
            } else if (fieldValue.isArray()) {
                result.put(fieldName, convertToList(fieldValue));
            } else if (fieldValue.isNull()) {
                result.put(fieldName, null);
            }
        }

        return result;
    }

    private Map<String, Map<String, Object>> convertToMapOfMaps(JsonNode jsonNode) {
        Map<String, Map<String, Object>> result = new HashMap<>();
        Iterator<String> fieldNames = jsonNode.fieldNames();

        while (fieldNames.hasNext()) {
            String fieldName = fieldNames.next();
            JsonNode fieldValue = jsonNode.get(fieldName);
            result.put(fieldName, convertToMap(fieldValue));
        }

        return result;
    }

    private List<Map<String, Object>> convertToList(JsonNode jsonArray) {
        List<Map<String, Object>> result = new ArrayList<>();

        for (JsonNode item : jsonArray) {
            if (item.isObject()) {
                result.add(convertToMap(item));
            }
        }

        return result;
    }
}