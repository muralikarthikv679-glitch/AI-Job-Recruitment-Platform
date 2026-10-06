package com.ai.recruitment.controller;

import com.ai.recruitment.dto.JobPostingDto;
import com.ai.recruitment.dto.JobSearchCriteria;
import com.ai.recruitment.service.JobService;
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
@RequestMapping("/api/jobs")
@Tag(name = "Jobs", description = "Job postings management and search with dynamic AI match scores")
public class JobController {

    @Autowired
    private JobService jobService;

    @GetMapping
    @Operation(summary = "Search and list jobs with filters and personalized match scores")
    public ResponseEntity<List<JobPostingDto>> listJobs(
            Authentication auth,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String jobType,
            @RequestParam(required = false) Double maxExp,
            @RequestParam(required = false) Double minMatchScore) {

        JobSearchCriteria criteria = new JobSearchCriteria();
        criteria.setKeyword(keyword);
        criteria.setLocation(location);
        criteria.setJobType(jobType);
        criteria.setMaxExp(maxExp);
        criteria.setMinMatchScore(minMatchScore);

        String candidateEmail = (auth != null) ? auth.getName() : null;
        List<JobPostingDto> jobs = jobService.getAllActiveJobs(candidateEmail, criteria);
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single job details by ID")
    public ResponseEntity<JobPostingDto> getJobById(@PathVariable Long id, Authentication auth) {
        String candidateEmail = (auth != null) ? auth.getName() : null;
        JobPostingDto job = jobService.getJobById(id, candidateEmail);
        return ResponseEntity.ok(job);
    }

    @GetMapping("/recruiter/my-jobs")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Get all jobs posted by the logged-in recruiter")
    public ResponseEntity<List<JobPostingDto>> getMyJobs(Authentication auth) {
        List<JobPostingDto> jobs = jobService.getJobsByRecruiter(auth.getName());
        return ResponseEntity.ok(jobs);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Create a new job posting")
    public ResponseEntity<JobPostingDto> createJob(
            Authentication auth,
            @Valid @RequestBody JobPostingDto dto) {
        JobPostingDto created = jobService.createJob(auth.getName(), dto);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Update an existing job posting")
    public ResponseEntity<JobPostingDto> updateJob(
            @PathVariable Long id,
            Authentication auth,
            @Valid @RequestBody JobPostingDto dto) {
        JobPostingDto updated = jobService.updateJob(id, auth.getName(), dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Delete a job posting")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id, Authentication auth) {
        jobService.deleteJob(id, auth.getName());
        return ResponseEntity.noContent().build();
    }
}
