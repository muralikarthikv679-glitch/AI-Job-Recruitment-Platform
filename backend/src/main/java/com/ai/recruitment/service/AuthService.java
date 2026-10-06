package com.ai.recruitment.service;

import com.ai.recruitment.config.JwtUtils;
import com.ai.recruitment.dto.AuthRequest;
import com.ai.recruitment.dto.AuthResponse;
import com.ai.recruitment.dto.RegisterRequest;
import com.ai.recruitment.entity.*;
import com.ai.recruitment.repository.CandidateProfileRepository;
import com.ai.recruitment.repository.RecruiterProfileRepository;
import com.ai.recruitment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CandidateProfileRepository candidateProfileRepository;

    @Autowired
    private RecruiterProfileRepository recruiterProfileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered: " + request.getEmail());
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail().toLowerCase().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setEnabled(true);

        User savedUser = userRepository.save(user);
        Long profileId = null;

        if (savedUser.getRole() == Role.CANDIDATE) {
            CandidateProfile candidateProfile = new CandidateProfile(savedUser);
            candidateProfile.setHeadline(request.getHeadline() != null ? request.getHeadline() : "Software Professional");
            candidateProfile.setPhone(request.getPhone());
            candidateProfile.setLocation(request.getLocation());
            CandidateProfile savedProfile = candidateProfileRepository.save(candidateProfile);
            profileId = savedProfile.getId();
        } else if (savedUser.getRole() == Role.RECRUITER) {
            RecruiterProfile recruiterProfile = new RecruiterProfile(savedUser,
                    request.getCompanyName() != null ? request.getCompanyName() : "Tech Solutions Inc.");
            recruiterProfile.setLocation(request.getLocation());
            RecruiterProfile savedProfile = recruiterProfileRepository.save(recruiterProfile);
            profileId = savedProfile.getId();
        }

        String token = jwtUtils.generateToken(savedUser.getEmail(), savedUser.getRole().name(), savedUser.getId());

        return new AuthResponse(token, savedUser.getId(), savedUser.getName(), savedUser.getEmail(), savedUser.getRole(), profileId);
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new UsernameNotFoundException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        if (!user.isEnabled()) {
            throw new IllegalStateException("Your account has been deactivated. Please contact support.");
        }

        Long profileId = null;
        if (user.getRole() == Role.CANDIDATE) {
            profileId = candidateProfileRepository.findByUser(user).map(CandidateProfile::getId).orElse(null);
        } else if (user.getRole() == Role.RECRUITER) {
            profileId = recruiterProfileRepository.findByUser(user).map(RecruiterProfile::getId).orElse(null);
        }

        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name(), user.getId());

        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole(), profileId);
    }

    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }
}
