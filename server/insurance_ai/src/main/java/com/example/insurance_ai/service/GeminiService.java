package com.example.insurance_ai.service;

import okhttp3.*;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Objects;
import java.util.concurrent.TimeUnit;

@Service
public class GeminiService {

    // Reading the Gemini API URL and API Key from the application.properties
    @Value("${gemini.api.url}")
    private String GEMINI_API_URL;

    @Value("${gemini.api.key}")
    private String API_KEY;

    private final OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(120, TimeUnit.SECONDS)
            .readTimeout(120, TimeUnit.SECONDS)
            .writeTimeout(120, TimeUnit.SECONDS)
            .build();

    public String getInsuranceComparisonJson(String userPrompt) throws IOException {

        System.out.println("GEMINI_API_URL: " + GEMINI_API_URL);
        System.out.println("API_KEY: " + API_KEY);

        JSONObject content = new JSONObject();
        content.put("parts", new org.json.JSONArray().put(new JSONObject().put("text", userPrompt)));

        JSONObject payload = new JSONObject();
        payload.put("contents", new org.json.JSONArray().put(new JSONObject().put("role", "user").put("parts", content.getJSONArray("parts"))));

        Request request = new Request.Builder()
                .url(GEMINI_API_URL + "?key=" + API_KEY)
                .post(RequestBody.create(payload.toString(), MediaType.parse("application/json")))
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Unexpected response: " + response);
            }

            String responseBody = Objects.requireNonNull(response.body()).string();

            // Extract and clean JSON from Markdown
            JSONObject result = new JSONObject(responseBody);
            String markdown = result.getJSONArray("candidates")
                    .getJSONObject(0)
                    .getJSONObject("content")
                    .getJSONArray("parts")
                    .getJSONObject(0)
                    .getString("text");

            // Remove markdown backticks if any
            String cleanedJson = markdown.replaceAll("(?s)```json|```", "").trim();

            // Optional: validate it's proper JSON
            new JSONObject(cleanedJson); // throws if not valid

            return cleanedJson;
        }
    }
}
