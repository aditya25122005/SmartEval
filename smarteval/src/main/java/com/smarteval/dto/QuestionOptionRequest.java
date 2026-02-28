package com.smarteval.dto;

import lombok.Data;

@Data
public class QuestionOptionRequest {
    private String optionText;
    private Boolean isCorrect;
}