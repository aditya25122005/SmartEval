package com.smarteval.service.impl;

import com.smarteval.dto.AuthResponse;
import com.smarteval.dto.LoginRequest;
import com.smarteval.dto.RegisterRequest;
import com.smarteval.entity.Role;
import com.smarteval.entity.User;
import com.smarteval.repository.UserRepository;
import com.smarteval.security.JwtUtil;
import com.smarteval.service.AuthService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // ✅ Proper Constructor Injection
    public AuthServiceImpl(UserRepository userRepository,
                           BCryptPasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public String register(RegisterRequest request) {

        User user = new User(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                Role.valueOf(request.getRole())
        );

        userRepository.save(user);

        return "User Registered Successfully";
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        // Return BOTH the token and the role name (e.g., "FACULTY" or "STUDENT")
        return new AuthResponse(token, user.getRole().name());
    }
}