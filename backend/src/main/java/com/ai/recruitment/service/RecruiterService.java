package com.ai.recruitment.service;

import com.ai.recruitment.dto.RecruiterProfileDto;
import com.ai.recruitment.entity.RecruiterProfile;
import com.ai.recruitment.entity.User;
import com.ai.recruitment.repository.RecruiterProfileRepository;
import com.ai.recruitment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RecruiterService {

    @Autowired
    private RecruiterProfileRepository recruiterProfileRepository;

    @Autowired
    private UserRepository userRepository;

    public RecruiterProfileDto getProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        RecruiterProfile profile = recruiterProfileRepository.findByUser(user)
                .orElseGet(() -> {
                    RecruiterProfile newProfile = new RecruiterProfile(user, "Company");
                    return recruiterProfileRepository.save(newProfile);
                });

        return mapToDto(profile);
    }

    public RecruiterProfileDto getProfileById(Long id) {
        RecruiterProfile profile = recruiterProfileRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Recruiter profile not found with id: " + id));
        return mapToDto(profile);
    }

    @Transactional
    public RecruiterProfileDto updateProfile(String email, RecruiterProfileDto dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        if (dto.getName() != null && !dto.getName().isBlank()) {
            user.setName(dto.getName());
            userRepository.save(user);
        }

        RecruiterProfile profile = recruiterProfileRepository.findByUser(user)
                .orElseGet(() -> new RecruiterProfile(user, dto.getCompanyName()));

        if (dto.getCompanyName() != null) profile.setCompanyName(dto.getCompanyName());
        if (dto.getCompanyDescription() != null) profile.setCompanyDescription(dto.getCompanyDescription());
        if (dto.getCompanyWebsite() != null) profile.setCompanyWebsite(dto.getCompanyWebsite());
        if (dto.getIndustry() != null) profile.setIndustry(dto.getIndustry());
        if (dto.getLocation() != null) profile.setLocation(dto.getLocation());
        if (dto.getCompanySize() != null) profile.setCompanySize(dto.getCompanySize());

        RecruiterProfile saved = recruiterProfileRepository.save(profile);
        return mapToDto(saved);
    }

    public RecruiterProfileDto mapToDto(RecruiterProfile profile) {
        RecruiterProfileDto dto = new RecruiterProfileDto();
        dto.setId(profile.getId());
        dto.setUserId(profile.getUser().getId());
        dto.setName(profile.getUser().getName());
        dto.setEmail(profile.getUser().getEmail());
        dto.setCompanyName(profile.getCompanyName());
        dto.setCompanyDescription(profile.getCompanyDescription());
        dto.setCompanyWebsite(profile.getCompanyWebsite());
        dto.setIndustry(profile.getIndustry());
        dto.setLocation(profile.getLocation());
        dto.setCompanySize(profile.getCompanySize());
        return dto;
    }
}
