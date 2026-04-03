package com.smarteval.service;

import com.smarteval.dto.AuthResponse;
import com.smarteval.dto.LoginRequest;
import com.smarteval.dto.RegisterRequest;

public interface AuthService {

    String register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}