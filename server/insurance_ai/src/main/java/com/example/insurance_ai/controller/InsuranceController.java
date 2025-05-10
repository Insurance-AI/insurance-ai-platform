package com.example.insurance_ai.controller;

import com.example.insurance_ai.dto.InsuranceRequest;
import com.example.insurance_ai.dto.InsuranceResponse;
import com.example.insurance_ai.service.InsuranceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class InsuranceController {
    private final InsuranceService insuranceService;

    public InsuranceController(InsuranceService insuranceService) {
        this.insuranceService = insuranceService;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/recommend")
    public ResponseEntity<InsuranceResponse> recommend(@RequestBody InsuranceRequest request) {
        InsuranceResponse response = insuranceService.getRecommendations(request);
        return ResponseEntity.ok(response);
    }
}
