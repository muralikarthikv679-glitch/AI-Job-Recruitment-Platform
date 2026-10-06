package com.ai.recruitment.service;

import com.ai.recruitment.dto.CandidateProfileDto;
import com.ai.recruitment.dto.ResumeParseResponseDto;
import com.ai.recruitment.entity.*;
import com.ai.recruitment.repository.CandidateProfileRepository;
import com.ai.recruitment.repository.CandidateSkillRepository;
import com.ai.recruitment.repository.SkillRepository;
import com.ai.recruitment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class CandidateService {

    @Autowired
    private CandidateProfileRepository candidateProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private CandidateSkillRepository candidateSkillRepository;

    @Autowired
    private ResumeParserService resumeParserService;

    public CandidateProfileDto getProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        CandidateProfile profile = candidateProfileRepository.findByUser(user)
                .orElseGet(() -> {
                    CandidateProfile newProfile = new CandidateProfile(user);
                    return candidateProfileRepository.save(newProfile);
                });

        return mapToDto(profile);
    }

    public CandidateProfileDto getProfileById(Long id) {
        CandidateProfile profile = candidateProfileRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Candidate profile not found with id: " + id));
        return mapToDto(profile);
    }

    @Transactional
    public CandidateProfileDto updateProfile(String email, CandidateProfileDto dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        if (dto.getName() != null && !dto.getName().isBlank()) {
            user.setName(dto.getName());
            userRepository.save(user);
        }

        CandidateProfile profile = candidateProfileRepository.findByUser(user)
                .orElseGet(() -> new CandidateProfile(user));

        if (dto.getHeadline() != null) profile.setHeadline(dto.getHeadline());
        if (dto.getSummary() != null) profile.setSummary(dto.getSummary());
        if (dto.getPhone() != null) profile.setPhone(dto.getPhone());
        if (dto.getLocation() != null) profile.setLocation(dto.getLocation());
        if (dto.getEducation() != null) profile.setEducation(dto.getEducation());
        if (dto.getExperienceYears() != null) profile.setExperienceYears(dto.getExperienceYears());

        if (dto.getSkills() != null) {
            profile.setSkills(new ArrayList<>(dto.getSkills()));
            syncSkillsInDatabase(profile, dto.getSkills());
        }

        CandidateProfile saved = candidateProfileRepository.save(profile);
        return mapToDto(saved);
    }

    @Transactional
    public ResumeParseResponseDto uploadAndParseResume(String email, MultipartFile file) throws IOException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        CandidateProfile profile = candidateProfileRepository.findByUser(user)
                .orElseGet(() -> new CandidateProfile(user));

        ResumeParseResponseDto parsedData = resumeParserService.parseUploadedResume(file);

        // Update profile with extracted data if currently empty or overwrite resume fields
        profile.setResumePath(parsedData.getFilePath());
        profile.setResumeFileName(parsedData.getFileName());
        profile.setRawResumeText(parsedData.getRawText());

        if (profile.getHeadline() == null || profile.getHeadline().isBlank()) {
            profile.setHeadline(parsedData.getHeadline());
        }
        if (profile.getSummary() == null || profile.getSummary().isBlank()) {
            profile.setSummary(parsedData.getSummary());
        }
        if (profile.getEducation() == null || profile.getEducation().isBlank()) {
            profile.setEducation(parsedData.getEducation());
        }
        if (profile.getPhone() == null || profile.getPhone().isBlank()) {
            profile.setPhone(parsedData.getPhone());
        }
        if (parsedData.getExperienceYears() != null && parsedData.getExperienceYears() > 0) {
            profile.setExperienceYears(parsedData.getExperienceYears());
        }

        if (parsedData.getExtractedSkills() != null && !parsedData.getExtractedSkills().isEmpty()) {
            List<String> combinedSkills = new ArrayList<>(profile.getSkills());
            for (String s : parsedData.getExtractedSkills()) {
                if (!combinedSkills.stream().anyMatch(existing -> existing.equalsIgnoreCase(s))) {
                    combinedSkills.add(s);
                }
            }
            profile.setSkills(combinedSkills);
            syncSkillsInDatabase(profile, combinedSkills);
        }

        candidateProfileRepository.save(profile);
        return parsedData;
    }

    private void syncSkillsInDatabase(CandidateProfile profile, List<String> skillNames) {
        for (String skillName : skillNames) {
            String trimmed = skillName.trim();
            if (!trimmed.isEmpty()) {
                Skill skill = skillRepository.findByNameIgnoreCase(trimmed)
                        .orElseGet(() -> skillRepository.save(new Skill(trimmed, "Technical")));
            }
        }
    }

    public CandidateProfileDto mapToDto(CandidateProfile profile) {
        CandidateProfileDto dto = new CandidateProfileDto();
        dto.setId(profile.getId());
        dto.setUserId(profile.getUser().getId());
        dto.setName(profile.getUser().getName());
        dto.setEmail(profile.getUser().getEmail());
        dto.setHeadline(profile.getHeadline());
        dto.setSummary(profile.getSummary());
        dto.setPhone(profile.getPhone());
        dto.setLocation(profile.getLocation());
        dto.setEducation(profile.getEducation());
        dto.setExperienceYears(profile.getExperienceYears());
        dto.setResumePath(profile.getResumePath());
        dto.setResumeFileName(profile.getResumeFileName());
        dto.setRawResumeText(profile.getRawResumeText());
        dto.setSkills(profile.getSkills() != null ? new ArrayList<>(profile.getSkills()) : new ArrayList<>());
        return dto;
    }
}
