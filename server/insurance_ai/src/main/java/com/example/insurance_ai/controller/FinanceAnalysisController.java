package com.example.insurance_ai.controller;

import com.example.insurance_ai.dto.AnalysisResponse;
import com.example.insurance_ai.dto.ErrorResponse;
import com.example.insurance_ai.service.FinanceAnalysisService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/insurance")
@CrossOrigin(origins = "*")
public class FinanceAnalysisController {
    private static final Logger logger = LoggerFactory.getLogger(FinanceAnalysisController.class);

    @Autowired
    private FinanceAnalysisService financeAnalysisService;

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeFinanceData(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity
                        .badRequest()
                        .body(new ErrorResponse("File is empty", "Please provide a valid CSV file"));
            }

            logger.info("Received file: {} of size: {}", file.getOriginalFilename(), file.getSize());
            AnalysisResponse response = financeAnalysisService.analyzeData(file);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error analyzing file: {}", e.getMessage(), e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Analysis failed", e.getMessage()));
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        return ResponseEntity.ok("Insurance Finance Analysis API is working!");
    }
}