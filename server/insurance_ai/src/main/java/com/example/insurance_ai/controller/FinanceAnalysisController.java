package com.example.insurance_ai.controller;

import com.example.insurance_ai.dto.AnalysisResponse;
import com.example.insurance_ai.service.FinanceAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/finance")
@CrossOrigin(origins = "*")
public class FinanceAnalysisController {
    @Autowired
    private FinanceAnalysisService financeAnalysisService;

    @PostMapping("/analyze")
    public ResponseEntity<AnalysisResponse> analyzeFinanceData(@RequestParam("file") MultipartFile file) {
        try {
            AnalysisResponse response = financeAnalysisService.analyzeData(file);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        return ResponseEntity.ok("Finance Analysis API is working!");
    }
}
