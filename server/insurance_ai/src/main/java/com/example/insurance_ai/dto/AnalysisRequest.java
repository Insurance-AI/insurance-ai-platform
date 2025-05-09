package com.example.insurance_ai.dto;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class AnalysisRequest {
    private MultipartFile file;
}
