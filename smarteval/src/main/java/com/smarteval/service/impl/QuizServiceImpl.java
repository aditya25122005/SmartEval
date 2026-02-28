package com.smarteval.service.impl;

import com.smarteval.dto.*;
import com.smarteval.entity.*;
import com.smarteval.repository.*;
import com.smarteval.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizServiceImpl implements QuizService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final QuizAttemptRepository quizAttemptRepository;

    @Override
    public QuizResponse createQuiz(QuizRequest request, String facultyEmail) {

        User faculty = userRepository.findByEmail(facultyEmail)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));

        List<Question> questions = questionRepository.findAllById(request.getQuestionIds());

        Quiz quiz = Quiz.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .duration(request.getDuration())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .createdBy(faculty.getId())
                .questions(questions)
                .build();

        Quiz saved = quizRepository.save(quiz);

        return mapToResponse(saved);
    }

    @Override
    public List<QuizResponse> getAllQuizzes() {
        return quizRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public QuizResponse getQuizById(Long quizId) {

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        return QuizResponse.builder()
                .id(quiz.getId())
                .title(quiz.getTitle())
                .description(quiz.getDescription())
                .duration(quiz.getDuration())
                .startTime(quiz.getStartTime())
                .endTime(quiz.getEndTime())
                .questions(quiz.getQuestions())  // 🔥 full questions
                .build();
    }

    @Override
    public int submitQuiz(QuizSubmissionRequest request, String studentEmail) {

        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Quiz quiz = quizRepository.findById(request.getQuizId())
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        LocalDateTime now = LocalDateTime.now();

        // 🔒 Scheduling enforcement
        if (now.isBefore(quiz.getStartTime())) {
            throw new RuntimeException("Quiz has not started yet");
        }

        if (now.isAfter(quiz.getEndTime())) {
            throw new RuntimeException("Quiz has already ended");
        }

        // 🔒 Single attempt restriction
        if (quizAttemptRepository
                .findByStudentIdAndQuizId(student.getId(), quiz.getId())
                .isPresent()) {
            throw new RuntimeException("You have already attempted this quiz");
        }

        int score = 0;

        for (AnswerRequest answer : request.getAnswers()) {

            Question question = questionRepository.findById(answer.getQuestionId())
                    .orElseThrow(() -> new RuntimeException("Question not found"));

            QuestionOption selected = question.getOptions()
                    .stream()
                    .filter(opt -> opt.getId().equals(answer.getSelectedOptionId()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Option not found"));

            if (Boolean.TRUE.equals(selected.getCorrect())) {
                score++;
            }
        }

        QuizAttempt attempt = new QuizAttempt();
        attempt.setQuizId(quiz.getId());
        attempt.setStudentId(student.getId());
        attempt.setScore(score);
        attempt.setTotalQuestions(request.getAnswers().size());
        attempt.setStartTime(now);
        attempt.setSubmittedAt(now);

        quizAttemptRepository.save(attempt);

        return score;
    }

    @Override
    public List<QuizAttempt> getStudentAttempts(String studentEmail) {

        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return quizAttemptRepository.findByStudentId(student.getId());
    }

    @Override
    public List<QuizAttempt> getLeaderboard(Long quizId) {

        return quizAttemptRepository.findByQuizIdOrderByScoreDesc(quizId);
    }

    private QuizResponse mapToResponse(Quiz quiz) {
        return QuizResponse.builder()
                .id(quiz.getId())
                .title(quiz.getTitle())
                .description(quiz.getDescription())
                .duration(quiz.getDuration())
                .startTime(quiz.getStartTime())
                .endTime(quiz.getEndTime())
                .questionIds(
                        quiz.getQuestions()
                                .stream()
                                .map(Question::getId)
                                .collect(Collectors.toList())
                )
                .build();
    }
}