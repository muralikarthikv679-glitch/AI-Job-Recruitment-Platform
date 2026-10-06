package com.ai.recruitment.controller;

import com.ai.recruitment.dto.RecruiterProfileDto;
import com.ai.recruitment.service.RecruiterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recruiter")
@Tag(name = "Recruiter", description = "Recruiter company profile management")
public class RecruiterController {

    @Autowired
    private RecruiterService recruiterService;

    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Get current recruiter profile")
    public ResponseEntity<RecruiterProfileDto> getProfile(Authentication auth) {
        RecruiterProfileDto profile = recruiterService.getProfileByEmail(auth.getName());
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/profile/{id}")
    @Operation(summary = "Get recruiter profile by ID")
    public ResponseEntity<RecruiterProfileDto> getProfileById(@PathVariable Long id) {
        RecruiterProfileDto profile = recruiterService.getProfileById(id);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Update current recruiter profile")
    public ResponseEntity<RecruiterProfileDto> updateProfile(
            Authentication auth,
            @RequestBody RecruiterProfileDto dto) {
        RecruiterProfileDto updated = recruiterService.updateProfile(auth.getName(), dto);
        return ResponseEntity.ok(updated);
    }
}
