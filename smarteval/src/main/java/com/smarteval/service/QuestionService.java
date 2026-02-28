package com.smarteval.service;

import com.smarteval.dto.QuestionRequest;
import com.smarteval.dto.QuestionResponse;
import java.util.List;

public interface QuestionService {

    QuestionResponse createQuestion(QuestionRequest request, String facultyEmail);

    List<QuestionResponse> getAllQuestions();

    void deleteQuestion(Long id);
}