package com.smarteval.controller;

import com.smarteval.dto.QuizResponse;
import com.smarteval.dto.QuizSubmissionRequest;
import com.smarteval.entity.QuizAttempt;
import com.smarteval.service.QuizService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/quizzes")
public class StudentQuizController {

    private final QuizService quizService;

    public StudentQuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    // ✅ Get all quizzes
    @GetMapping
    public List<QuizResponse> getAllQuizzes() {
        return quizService.getAllQuizzes();
    }

    // ✅ Get quiz by ID
    @GetMapping("/{quizId}")
    public QuizResponse getQuizById(@PathVariable Long quizId) {
        return quizService.getQuizById(quizId);
    }

    // ✅ Submit quiz
    @PostMapping("/submit")
    public ResponseEntity<Integer> submitQuiz(
            @RequestBody QuizSubmissionRequest request,
            Authentication authentication) {

        int score = quizService.submitQuiz(request, authentication.getName());
        return ResponseEntity.ok(score);
    }

    // ✅ Result history
    @GetMapping("/history")
    public ResponseEntity<List<QuizAttempt>> getHistory(
            Authentication authentication) {

        return ResponseEntity.ok(
                quizService.getStudentAttempts(authentication.getName())
        );
    }

    // ✅ Leaderboard
    @GetMapping("/{quizId}/leaderboard")
    public ResponseEntity<List<QuizAttempt>> getLeaderboard(
            @PathVariable Long quizId) {

        return ResponseEntity.ok(
                quizService.getLeaderboard(quizId)
        );
    }
}