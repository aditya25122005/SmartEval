package com.smarteval.controller;

import com.smarteval.dto.QuizAnalyticsResponse;
import com.smarteval.dto.QuizRequest;
import com.smarteval.dto.QuizResponse;
import com.smarteval.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faculty/quizzes")
@RequiredArgsConstructor
public class FacultyQuizController {

    private final QuizService quizService;

    @PostMapping
    public QuizResponse createQuiz(@RequestBody QuizRequest request,
                                   Authentication authentication) {

        String email = authentication.getName();
        return quizService.createQuiz(request, email);
    }

    @GetMapping
    public List<QuizResponse> getAllQuizzes() {
        return quizService.getAllQuizzes();
    }

    @GetMapping("/{quizId}/stats")
    public ResponseEntity<QuizAnalyticsResponse> getQuizStats(@PathVariable Long quizId) {
        return ResponseEntity.ok(quizService.getQuizAnalytics(quizId));
    }
}