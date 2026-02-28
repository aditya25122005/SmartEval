package com.smarteval.repository;

import com.smarteval.entity.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {

    Optional<QuizAttempt> findByStudentIdAndQuizId(Long studentId, Long quizId);

    List<QuizAttempt> findByStudentId(Long studentId);

    List<QuizAttempt> findByQuizIdOrderByScoreDesc(Long quizId);
}