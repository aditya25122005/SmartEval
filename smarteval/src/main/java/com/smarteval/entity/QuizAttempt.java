package com.smarteval.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class QuizAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long quizId;

    private Long studentId;

    private int score;

    private int totalQuestions;

    private LocalDateTime startTime;     // NEW

    private LocalDateTime submittedAt;
}