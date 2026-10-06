package com.ai.recruitment.controller;

import com.ai.recruitment.dto.RecruiterAnalyticsDto;
import com.ai.recruitment.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@Tag(name = "Analytics", description = "Recruiter metrics, applicant trends and skill demand analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/recruiter")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Get recruiter dashboard analytics (funnel, skill demand, score trends)")
    public ResponseEntity<RecruiterAnalyticsDto> getRecruiterAnalytics(Authentication auth) {
        RecruiterAnalyticsDto analytics = analyticsService.getRecruiterAnalytics(auth.getName());
        return ResponseEntity.ok(analytics);
    }
}
