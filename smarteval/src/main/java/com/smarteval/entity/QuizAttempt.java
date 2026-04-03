package com.smarteval.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long quizId;
    private Long studentId;
    private String quizTitle;

    private int score; // Now stores percentage (e.g., 85)
    private int totalQuestions;
    private int cheatCount = 0;

    private LocalDateTime startTime;
    private LocalDateTime submittedAt;
    private LocalDateTime createdAt;


}