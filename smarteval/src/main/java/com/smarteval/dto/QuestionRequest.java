package com.smarteval.dto;

import jdk.jfr.DataAmount;
import lombok.Data;
import java.util.List;

@Data
public class QuestionRequest {

    private String title;
    private String description;
    private String subject;
    private String difficulty;

    private List<QuestionOptionRequest> options;
}