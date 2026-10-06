package com.ai.recruitment.controller;

import com.ai.recruitment.dto.ApplicationDto;
import com.ai.recruitment.dto.MatchResultDto;
import com.ai.recruitment.dto.StatusUpdateRequest;
import com.ai.recruitment.service.ApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@Tag(name = "Applications", description = "Job applications and workflow pipeline")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @PostMapping("/apply/{jobId}")
    @PreAuthorize("hasAnyRole('CANDIDATE', 'ADMIN')")
    @Operation(summary = "Candidate applies to a job, automatically computing match scores")
    public ResponseEntity<ApplicationDto> applyForJob(@PathVariable Long jobId, Authentication auth) {
        ApplicationDto dto = applicationService.applyForJob(auth.getName(), jobId);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/my-applications")
    @PreAuthorize("hasAnyRole('CANDIDATE', 'ADMIN')")
    @Operation(summary = "Candidate views their applications with status tracking")
    public ResponseEntity<List<ApplicationDto>> getMyApplications(Authentication auth) {
        List<ApplicationDto> list = applicationService.getCandidateApplications(auth.getName());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Recruiter views candidates ranked by AI Match Score for a job")
    public ResponseEntity<List<ApplicationDto>> getApplicantsForJob(@PathVariable Long jobId, Authentication auth) {
        List<ApplicationDto> ranked = applicationService.getRankedApplicantsForJob(jobId, auth.getName());
        return ResponseEntity.ok(ranked);
    }

    @GetMapping("/recruiter/all")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Recruiter views all applications received across all postings")
    public ResponseEntity<List<ApplicationDto>> getAllRecruiterApplications(Authentication auth) {
        List<ApplicationDto> all = applicationService.getAllApplicationsForRecruiter(auth.getName());
        return ResponseEntity.ok(all);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Recruiter updates candidate application status in pipeline")
    public ResponseEntity<ApplicationDto> updateStatus(
            @PathVariable Long id,
            Authentication auth,
            @Valid @RequestBody StatusUpdateRequest request) {
        ApplicationDto updated = applicationService.updateApplicationStatus(id, auth.getName(), request);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}/match-score")
    @Operation(summary = "Get detailed match score breakdown for an application")
    public ResponseEntity<MatchResultDto> getMatchDetails(@PathVariable Long id) {
        MatchResultDto match = applicationService.getMatchDetails(id);
        return ResponseEntity.ok(match);
    }
}
