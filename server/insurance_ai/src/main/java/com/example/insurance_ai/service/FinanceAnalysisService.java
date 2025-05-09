package com.example.insurance_ai.service;

@Service
public class FinanceAnalysisService {
    @Value("${python.script.path}")
    private String pythonScriptPath;

    @Value("${python.executable.path}")
    private String pythonExecutablePath;

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
            JSONObject jsonResult = new JSONObject(jsonStr);

            // Clean up the temporary file
            Files.deleteIfExists(tempFile);

            // Build and return the response
            return parseAnalysisResponse(jsonResult);
        } else {
            throw new RuntimeException("Could not parse JSON output from Python script");
        }
    }

    private AnalysisResponse parseAnalysisResponse(JSONObject jsonResult) {
        // Parse the JSON result into AnalysisResponse object
        // This is a simplified version - you'll need to adapt it based on the actual output
        return AnalysisResponse.builder()
                .weeklySpending(jsonResult.has("weekly_spending") ? jsonResult.getJSONObject("weekly_spending").toMap() : null)
                .monthlySpending(jsonResult.has("monthly_spending") ? jsonResult.getJSONObject("monthly_spending").toMap() : null)
                .yearlySpending(jsonResult.has("yearly_spending") ? jsonResult.getJSONObject("yearly_spending").toMap() : null)
                .categorySpending(jsonResult.has("category_spending") ? jsonResult.getJSONObject("category_spending").toMap() : null)
                .insuranceCounts(jsonResult.has("insurance_counts") ? jsonResult.getJSONObject("insurance_counts").toMap() : null)
                .insuranceSpending(jsonResult.has("insurance_spending") ? jsonResult.getJSONObject("insurance_spending").toMap() : null)
                .recommendations(jsonResult.has("recommendations") ? convertToMapOfMaps(jsonResult.getJSONObject("recommendations")) : null)
                .transactions(jsonResult.has("transactions") ? convertToList(jsonResult.getJSONArray("transactions")) : null)
                .categoryInsights(jsonResult.has("category_insights") ? convertToList(jsonResult.getJSONArray("category_insights")) : null)
                .financialAdvice(jsonResult.has("financial_advice") ? jsonResult.getJSONObject("financial_advice").toMap() : null)
                .build();
    }

    private Map<String, Map<String, Object>> convertToMapOfMaps(JSONObject jsonObject) {
        Map<String, Map<String, Object>> result = new HashMap<>();
        for (String key : jsonObject.keySet()) {
            JSONObject innerJson = jsonObject.getJSONObject(key);
            Map<String, Object> innerMap = new HashMap<>();
            for (String innerKey : innerJson.keySet()) {
                innerMap.put(innerKey, innerJson.get(innerKey));
            }
            result.put(key, innerMap);
        }
        return result;
    }

    private List<Map<String, Object>> convertToList(org.json.JSONArray jsonArray) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (int i = 0; i < jsonArray.length(); i++) {
            result.add(jsonArray.getJSONObject(i).toMap());
        }
        return result;
    }
}

