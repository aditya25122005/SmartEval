package com.smarteval.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class QuestionResponse {

    private Long id;
    private String title;
    private String description;
    private String subject;
    private String difficulty;

    private List<String> options;
}