package com.ai.recruitment.controller;

import com.ai.recruitment.dto.MatchResultDto;
import com.ai.recruitment.entity.CandidateProfile;
import com.ai.recruitment.entity.JobPosting;
import com.ai.recruitment.repository.CandidateProfileRepository;
import com.ai.recruitment.repository.JobPostingRepository;
import com.ai.recruitment.service.MatchingEngineService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/matching")
@Tag(name = "Matching Engine", description = "TF-IDF + Cosine similarity skill matching and fit analysis")
public class MatchingController {

    @Autowired
    private MatchingEngineService matchingEngineService;

    @Autowired
    private CandidateProfileRepository candidateProfileRepository;

    @Autowired
    private JobPostingRepository jobPostingRepository;

    @GetMapping("/preview")
    @Operation(summary = "Calculate real-time AI match score between any candidate and job")
    public ResponseEntity<MatchResultDto> previewMatch(
            @RequestParam Long candidateId,
            @RequestParam Long jobId) {

        CandidateProfile candidate = candidateProfileRepository.findById(candidateId)
                .orElseThrow(() -> new IllegalArgumentException("Candidate not found: " + candidateId));

        JobPosting job = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found: " + jobId));

        MatchResultDto result = matchingEngineService.calculateMatch(candidate, job);
        return ResponseEntity.ok(result);
    }
}
