package com.smarteval.service.impl;

import com.smarteval.dto.*;
import com.smarteval.entity.*;
import com.smarteval.repository.*;
import com.smarteval.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
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

        LocalDateTime now = LocalDateTime.now();

        // 🚨 VALIDATION: Check if Quiz has started
        if (quiz.getStartTime() != null && now.isBefore(quiz.getStartTime())) {
            throw new RuntimeException("This quiz has not started yet. Starts at: " + quiz.getStartTime());
        }

        // 🚨 VALIDATION: Check if Quiz has expired
        if (quiz.getEndTime() != null && now.isAfter(quiz.getEndTime())) {
            throw new RuntimeException("Access Denied! This quiz expired on: " + quiz.getEndTime());
        }

        // Shuffle questions for randomization
        List<Question> shuffledQuestions = quiz.getQuestions();
        Collections.shuffle(shuffledQuestions);

        return QuizResponse.builder()
                .id(quiz.getId())
                .title(quiz.getTitle())
                .description(quiz.getDescription())
                .duration(quiz.getDuration())
                .startTime(quiz.getStartTime())
                .endTime(quiz.getEndTime())
                .questions(shuffledQuestions)
                .build();
    }

    @Override
    public int submitQuiz(QuizSubmissionRequest request, String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Quiz quiz = quizRepository.findById(request.getQuizId())
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        LocalDateTime now = LocalDateTime.now();

        // 🚨 VALIDATION: Block submission if quiz window is closed (+2 min grace)
        if (quiz.getEndTime() != null && now.isAfter(quiz.getEndTime().plusMinutes(2))) {
            throw new RuntimeException("Submission window closed! Late submissions are not accepted.");
        }

        // 🔒 Attempt Control: Check if already attempted
        if (quizAttemptRepository.findByStudentIdAndQuizId(student.getId(), quiz.getId()).isPresent()) {
            throw new RuntimeException("You have already submitted this assessment.");
        }

        int correctCount = 0;
        int totalQuestions = quiz.getQuestions().size();

        for (AnswerRequest answer : request.getAnswers()) {
            Question question = questionRepository.findById(answer.getQuestionId())
                    .orElseThrow(() -> new RuntimeException("Question not found"));

            QuestionOption selected = question.getOptions().stream()
                    .filter(opt -> opt.getId().equals(answer.getSelectedOptionId()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Option not found"));

            if (Boolean.TRUE.equals(selected.getCorrect())) {
                correctCount++;
            }
        }

        // 🔥 Score Logic: Calculate Percentage
        double percentage = ((double) correctCount / totalQuestions) * 100;
        int finalScore = (int) Math.round(percentage);

        // Save Attempt Data
        QuizAttempt attempt = new QuizAttempt();
        attempt.setQuizId(quiz.getId());
        attempt.setQuizTitle(quiz.getTitle());
        attempt.setStudentId(student.getId());
        attempt.setScore(finalScore);
        attempt.setTotalQuestions(totalQuestions);
        attempt.setCheatCount(request.getCheatCount()); // Recorded from Frontend
        attempt.setSubmittedAt(now);
        attempt.setCreatedAt(now);
        attempt.setStartTime(now);

        quizAttemptRepository.save(attempt);
        return finalScore;
    }

    @Override
    public List<QuizAttempt> getStudentAttempts(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return quizAttemptRepository.findByStudentId(student.getId())
                .stream()
                .sorted((a, b) -> {
                    if (a.getCreatedAt() == null || b.getCreatedAt() == null) return 0;
                    return b.getCreatedAt().compareTo(a.getCreatedAt());
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<QuizAttempt> getLeaderboard(Long quizId) {
        return quizAttemptRepository.findByQuizIdOrderByScoreDesc(quizId);
    }

    @Override
    public QuizAnalyticsResponse getQuizAnalytics(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        List<QuizAttempt> attempts = quizAttemptRepository.findByQuizIdOrderByScoreDesc(quizId);

        if (attempts.isEmpty()) {
            return QuizAnalyticsResponse.builder()
                    .quizTitle(quiz.getTitle())
                    .students(Collections.emptyList())
                    .build();
        }

        double avg = attempts.stream().mapToInt(QuizAttempt::getScore).average().orElse(0.0);
        int top = attempts.stream().mapToInt(QuizAttempt::getScore).max().orElse(0);
        int totalCheats = attempts.stream().mapToInt(QuizAttempt::getCheatCount).sum();

        List<QuizAnalyticsResponse.StudentStat> studentStats = attempts.stream().map(a -> {
            User student = userRepository.findById(a.getStudentId()).orElse(null);
            return QuizAnalyticsResponse.StudentStat.builder()
                    .id(a.getId())
                    .studentId(a.getStudentId())
                    .name(student != null ? student.getName() : "Unknown")
                    .score(a.getScore())
                    .incidents(a.getCheatCount())
                    .submittedAt(a.getSubmittedAt())
                    .build();
        }).collect(Collectors.toList());

        return QuizAnalyticsResponse.builder()
                .quizTitle(quiz.getTitle())
                .averageScore(Math.round(avg * 100.0) / 100.0)
                .totalAttempts(attempts.size())
                .topScore(top)
                .totalIncidents(totalCheats)
                .students(studentStats)
                .build();
    }

    private QuizResponse mapToResponse(Quiz quiz) {
        return QuizResponse.builder()
                .id(quiz.getId())
                .title(quiz.getTitle())
                .description(quiz.getDescription())
                .duration(quiz.getDuration())
                .startTime(quiz.getStartTime())
                .endTime(quiz.getEndTime())
                .questionIds(quiz.getQuestions().stream().map(Question::getId).collect(Collectors.toList()))
                .build();
    }
}