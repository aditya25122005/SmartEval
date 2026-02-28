package com.smarteval.dto;

import com.smarteval.entity.Question;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class QuizResponse {

    private Long id;
    private String title;
    private String description;
    private Integer duration;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private List<Long> questionIds;
    private List<Question> questions;
}