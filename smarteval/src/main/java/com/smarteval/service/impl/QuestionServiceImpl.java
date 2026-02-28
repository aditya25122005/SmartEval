package com.smarteval.service.impl;

import com.smarteval.dto.*;
import com.smarteval.entity.Question;
import com.smarteval.entity.QuestionOption;
import com.smarteval.entity.User;
import com.smarteval.repository.QuestionRepository;
import com.smarteval.repository.UserRepository;
import com.smarteval.service.QuestionService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;

    public QuestionServiceImpl(QuestionRepository questionRepository,
                               UserRepository userRepository) {
        this.questionRepository = questionRepository;
        this.userRepository = userRepository;
    }

    @Override
    public QuestionResponse createQuestion(QuestionRequest request, String facultyEmail) {

        User faculty = userRepository.findByEmail(facultyEmail)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));

        // 🔥 NORMAL OBJECT CREATION (NO builder)
        Question question = new Question();
        question.setTitle(request.getTitle());
        question.setDescription(request.getDescription());
        question.setSubject(request.getSubject());
        question.setDifficulty(request.getDifficulty());
        question.setCreatedBy(faculty.getId());
        question.setCreatedAt(LocalDateTime.now());

        List<QuestionOption> options = request.getOptions().stream()
                .map(opt -> {
                    QuestionOption option = new QuestionOption();
                    option.setOptionText(opt.getOptionText());
                    option.setCorrect(opt.getIsCorrect());
                    option.setQuestion(question);
                    return option;
                })
                .collect(Collectors.toList());

        question.setOptions(options);

        Question saved = questionRepository.save(question);

        return mapToResponse(saved);
    }

    @Override
    public List<QuestionResponse> getAllQuestions() {
        return questionRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }

    private QuestionResponse mapToResponse(Question question) {
        return QuestionResponse.builder()
                .id(question.getId())
                .title(question.getTitle())
                .description(question.getDescription())
                .subject(question.getSubject())
                .difficulty(question.getDifficulty())
                .options(
                        question.getOptions()
                                .stream()
                                .map(QuestionOption::getOptionText)
                                .collect(Collectors.toList())
                )
                .build();
    }
}