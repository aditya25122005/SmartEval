package com.smarteval.controller;

import com.smarteval.dto.QuestionRequest;
import com.smarteval.dto.QuestionResponse;
import com.smarteval.service.QuestionService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faculty/questions")
public class FacultyQuestionController {

    private final QuestionService questionService;

    public FacultyQuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @PostMapping
    public QuestionResponse createQuestion(
            @RequestBody QuestionRequest request,
            Authentication authentication
    ) {
        String email = authentication.getName();
        return questionService.createQuestion(request, email);
    }

    @GetMapping
    public List<QuestionResponse> getAllQuestions() {
        return questionService.getAllQuestions();
    }

    @DeleteMapping("/{id}")
    public void deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
    }
}