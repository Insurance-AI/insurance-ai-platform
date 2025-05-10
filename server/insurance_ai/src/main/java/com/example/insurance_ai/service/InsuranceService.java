package com.example.insurance_ai.service;

import com.example.insurance_ai.dto.InsuranceRequest;
import com.example.insurance_ai.dto.InsuranceResponse;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class InsuranceService {
    private final RestTemplate restTemplate = new RestTemplate();
    private static final String FASTAPI_URL = "http://127.0.0.1:8000/predict";

    public InsuranceResponse getRecommendations(InsuranceRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<InsuranceRequest> requestEntity = new HttpEntity<>(request, headers);

        ResponseEntity<InsuranceResponse> response = restTemplate.postForEntity(
                FASTAPI_URL, requestEntity, InsuranceResponse.class);

        return response.getBody();
    }
}
