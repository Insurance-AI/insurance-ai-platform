package com.example.insurance_ai.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class InsuranceResponse {
    private List<String> recommendations;
}
