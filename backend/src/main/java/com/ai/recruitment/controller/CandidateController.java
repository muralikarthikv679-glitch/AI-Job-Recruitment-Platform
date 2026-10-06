package com.ai.recruitment.controller;

import com.ai.recruitment.dto.CandidateProfileDto;
import com.ai.recruitment.dto.ResumeParseResponseDto;
import com.ai.recruitment.service.CandidateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/candidate")
@Tag(name = "Candidate", description = "Candidate profile management and resume upload/parsing")
public class CandidateController {

    @Autowired
    private CandidateService candidateService;

    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('CANDIDATE', 'ADMIN')")
    @Operation(summary = "Get current candidate profile")
    public ResponseEntity<CandidateProfileDto> getProfile(Authentication auth) {
        CandidateProfileDto profile = candidateService.getProfileByEmail(auth.getName());
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/profile/{id}")
    @Operation(summary = "Get candidate profile by ID")
    public ResponseEntity<CandidateProfileDto> getProfileById(@PathVariable Long id) {
        CandidateProfileDto profile = candidateService.getProfileById(id);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    @PreAuthorize("hasAnyRole('CANDIDATE', 'ADMIN')")
    @Operation(summary = "Update current candidate profile")
    public ResponseEntity<CandidateProfileDto> updateProfile(
            Authentication auth,
            @RequestBody CandidateProfileDto dto) {
        CandidateProfileDto updated = candidateService.updateProfile(auth.getName(), dto);
        return ResponseEntity.ok(updated);
    }

    @PostMapping(value = "/resume", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('CANDIDATE', 'ADMIN')")
    @Operation(summary = "Upload and auto-extract resume details using PDFBox/POI text parsing")
    public ResponseEntity<ResumeParseResponseDto> uploadResume(
            Authentication auth,
            @RequestParam("file") MultipartFile file) throws IOException {
        ResumeParseResponseDto response = candidateService.uploadAndParseResume(auth.getName(), file);
        return ResponseEntity.ok(response);
    }
}
