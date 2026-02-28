package com.smarteval.service;

import com.smarteval.dto.QuizRequest;
import com.smarteval.dto.QuizResponse;
import com.smarteval.dto.QuizSubmissionRequest;
import com.smarteval.entity.QuizAttempt;

import java.util.List;

public interface QuizService {

    QuizResponse createQuiz(QuizRequest request, String facultyEmail);

    List<QuizResponse> getAllQuizzes();

    QuizResponse getQuizById(Long quizId);

    int submitQuiz(QuizSubmissionRequest request, String studentEmail);

    // NEW: Result history
    List<QuizAttempt> getStudentAttempts(String studentEmail);

    // NEW: Leaderboard
    List<QuizAttempt> getLeaderboard(Long quizId);
}