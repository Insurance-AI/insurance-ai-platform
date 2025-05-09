package com.example.insurance_ai.service;

import com.example.insurance_ai.dto.AnalysisResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Iterator;

@Service
public class FinanceAnalysisService {
    @Value("${python.script.path}")
    private String pythonScriptPath;

    @Value("${python.executable.path}")
    private String pythonExecutablePath;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public AnalysisResponse analyzeData(MultipartFile file) throws Exception {
        // Save the uploaded file temporarily
        Path tempFile = Files.createTempFile("finance_data", ".csv");
        Files.copy(file.getInputStream(), tempFile, StandardCopyOption.REPLACE_EXISTING);

        // Execute Python script
        ProcessBuilder processBuilder = new ProcessBuilder(
                pythonExecutablePath,
                pythonScriptPath,
                tempFile.toString()
        );

        processBuilder.redirectErrorStream(true);
        Process process = processBuilder.start();

        // Read the output from the Python script
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        StringBuilder output = new StringBuilder();
        String line;

        while ((line = reader.readLine()) != null) {
            output.append(line).append("\n");
        }

        int exitCode = process.waitFor();

        if (exitCode != 0) {
            throw new RuntimeException("Python script execution failed with exit code " + exitCode + "\nOutput: " + output.toString());
        }

        // Parse the JSON output from Python script
        String jsonOutput = output.toString();

        // Get the JSON part of the output
        int jsonStartIndex = jsonOutput.indexOf("{");
        int jsonEndIndex = jsonOutput.lastIndexOf("}") + 1;

        if (jsonStartIndex >= 0 && jsonEndIndex > jsonStartIndex) {
            String jsonStr = jsonOutput.substring(jsonStartIndex, jsonEndIndex);
            JsonNode jsonResult = objectMapper.readTree(jsonStr);

            // Clean up the temporary file
            Files.deleteIfExists(tempFile);

            // Build and return the response
            return parseAnalysisResponse(jsonResult);
        } else {
            throw new RuntimeException("Could not parse JSON output from Python script");
        }
    }

    private AnalysisResponse parseAnalysisResponse(JsonNode jsonResult) {
        return AnalysisResponse.builder()
                .weeklySpending(jsonResult.has("weekly_spending") ? convertToMap(jsonResult.get("weekly_spending")) : null)
                .monthlySpending(jsonResult.has("monthly_spending") ? convertToMap(jsonResult.get("monthly_spending")) : null)
                .yearlySpending(jsonResult.has("yearly_spending") ? convertToMap(jsonResult.get("yearly_spending")) : null)
                .categorySpending(jsonResult.has("category_spending") ? convertToMap(jsonResult.get("category_spending")) : null)
                .insuranceCounts(jsonResult.has("insurance_counts") ? convertToMap(jsonResult.get("insurance_counts")) : null)
                .insuranceSpending(jsonResult.has("insurance_spending") ? convertToMap(jsonResult.get("insurance_spending")) : null)
                .recommendations(jsonResult.has("recommendations") ? convertToMapOfMaps(jsonResult.get("recommendations")) : null)
                .transactions(jsonResult.has("transactions") ? convertToList(jsonResult.get("transactions")) : null)
                .categoryInsights(jsonResult.has("category_insights") ? convertToList(jsonResult.get("category_insights")) : null)
                .financialAdvice(jsonResult.has("financial_advice") ? convertToMap(jsonResult.get("financial_advice")) : null)
                .build();
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