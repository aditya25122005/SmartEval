package com.smarteval.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QuizAnalyticsResponse {
    private String quizTitle;
    private double averageScore;
    private int totalAttempts;
    private int topScore;
    private int totalIncidents; // For cheat tracking
    private List<StudentStat> students;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class StudentStat {
        private Long id;
        private Long studentId;
        private String name;
        private int score;
        private int incidents; // Tab switches
        private LocalDateTime submittedAt;
    }
}