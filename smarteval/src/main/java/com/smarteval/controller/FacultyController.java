package com.smarteval.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/faculty")
public class FacultyController {

    @GetMapping("/dashboard")
    public String facultyDashboard() {
        return "Faculty Dashboard";
    }
}