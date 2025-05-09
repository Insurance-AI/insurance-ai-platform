package com.example.insurance_ai.controller;
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
