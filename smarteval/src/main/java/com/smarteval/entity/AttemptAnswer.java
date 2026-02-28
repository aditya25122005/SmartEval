package com.smarteval.entity;

import jakarta.persistence.*;

@Entity
public class AttemptAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long quizAttemptId;

    private Long questionId;

    private Long selectedOptionId;

    private boolean correct;

    // getters + setters
}