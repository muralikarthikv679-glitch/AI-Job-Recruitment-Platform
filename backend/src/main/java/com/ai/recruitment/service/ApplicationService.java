package com.ai.recruitment.service;

import com.ai.recruitment.dto.ApplicationDto;
import com.ai.recruitment.dto.MatchResultDto;
import com.ai.recruitment.dto.StatusUpdateRequest;
import com.ai.recruitment.entity.*;
import com.ai.recruitment.repository.ApplicationRepository;
import com.ai.recruitment.repository.CandidateProfileRepository;
import com.ai.recruitment.repository.JobPostingRepository;
import com.ai.recruitment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private CandidateProfileRepository candidateProfileRepository;

    @Autowired
    private JobPostingRepository jobPostingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MatchingEngineService matchingEngineService;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public ApplicationDto applyForJob(String candidateEmail, Long jobId) {
        User user = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + candidateEmail));

        CandidateProfile candidate = candidateProfileRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Candidate profile not found. Please create your profile first."));

        JobPosting job = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job posting not found with id: " + jobId));

        if (job.getStatus() != JobStatus.ACTIVE) {
            throw new IllegalStateException("This job posting is no longer active.");
        }

        if (applicationRepository.existsByCandidateIdAndJobId(candidate.getId(), job.getId())) {
            throw new IllegalStateException("You have already applied for this position.");
        }

        // Calculate AI Match Score Breakdown
        MatchResultDto matchResult = matchingEngineService.calculateMatch(candidate, job);

        Application application = new Application(candidate, job);
        application.setMatchScore(matchResult.getOverallMatchScore());
        application.setSkillScore(matchResult.getSkillMatchScore());
        application.setTextSimilarityScore(matchResult.getTfidfSimilarityScore());
        application.setExperienceScore(matchResult.getExperienceMatchScore());
        application.setMatchExplanation(matchResult.getQualitativeExplanation());
        application.setStatus(ApplicationStatus.APPLIED);
        application.setAppliedDate(LocalDateTime.now());

        Application saved = applicationRepository.save(application);

        // Notify Recruiter
        User recruiterUser = job.getRecruiter().getUser();
        notificationService.sendNotification(
                recruiterUser,
                "New Application Received",
                user.getName() + " applied for " + job.getTitle() + " (Fit: " + matchResult.getOverallMatchScore() + "% - " + matchResult.getFitCategory() + ")",
                "APPLICATION_RECEIVED",
                "/recruiter/jobs/" + job.getId() + "/applicants"
        );

        // Notify Candidate
        notificationService.sendNotification(
                user,
                "Application Submitted Successfully",
                "Your application for " + job.getTitle() + " at " + job.getRecruiter().getCompanyName() + " has been submitted.",
                "STATUS_CHANGE",
                "/candidate/applications"
        );

        return mapToDto(saved);
    }

    public List<ApplicationDto> getCandidateApplications(String candidateEmail) {
        User user = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + candidateEmail));

        CandidateProfile candidate = candidateProfileRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Candidate profile not found"));

        return applicationRepository.findByCandidate(candidate)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ApplicationDto> getRankedApplicantsForJob(Long jobId, String recruiterEmail) {
        JobPosting job = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found: " + jobId));

        User user = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + recruiterEmail));

        if (user.getRole() != Role.ADMIN && !job.getRecruiter().getUser().getId().equals(user.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("Access denied to view applicants for this job");
        }

        // Return candidates ranked automatically by match score descending
        return applicationRepository.findByJobIdOrderByMatchScoreDesc(jobId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ApplicationDto> getAllApplicationsForRecruiter(String recruiterEmail) {
        User user = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + recruiterEmail));

        return applicationRepository.findByRecruiterId(user.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApplicationDto updateApplicationStatus(Long applicationId, String recruiterEmail, StatusUpdateRequest request) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found: " + applicationId));

        User user = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + recruiterEmail));

        JobPosting job = application.getJob();
        if (user.getRole() != Role.ADMIN && !job.getRecruiter().getUser().getId().equals(user.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("You are not authorized to update this application");
        }

        ApplicationStatus previousStatus = application.getStatus();
        application.setStatus(request.getStatus());
        if (request.getRecruiterNotes() != null) {
            application.setRecruiterNotes(request.getRecruiterNotes());
        }
        application.setUpdatedDate(LocalDateTime.now());

        Application saved = applicationRepository.save(application);

        // Send notification to candidate if status changed
        if (previousStatus != request.getStatus()) {
            User candidateUser = application.getCandidate().getUser();
            String statusFormatted = formatStatus(request.getStatus());
            String message = String.format("Your application for '%s' at %s has been moved to: %s",
                    job.getTitle(), job.getRecruiter().getCompanyName(), statusFormatted);

            notificationService.sendNotification(
                    candidateUser,
                    "Application Status Update: " + statusFormatted,
                    message,
                    "STATUS_CHANGE",
                    "/candidate/applications"
            );
        }

        return mapToDto(saved);
    }

    private String formatStatus(ApplicationStatus status) {
        switch (status) {
            case SHORTLISTED: return "Shortlisted ✨";
            case INTERVIEW_SCHEDULED: return "Interview Scheduled 📅";
            case HIRED: return "Offer / Hired 🎉";
            case REJECTED: return "Application Closed";
            default: return status.name();
        }
    }

    public MatchResultDto getMatchDetails(Long applicationId) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found: " + applicationId));

        return matchingEngineService.calculateMatch(app.getCandidate(), app.getJob());
    }

    public ApplicationDto mapToDto(Application app) {
        ApplicationDto dto = new ApplicationDto();
        dto.setId(app.getId());

        CandidateProfile c = app.getCandidate();
        if (c != null) {
            dto.setCandidateId(c.getId());
            dto.setCandidateUserId(c.getUser().getId());
            dto.setCandidateName(c.getUser().getName());
            dto.setCandidateEmail(c.getUser().getEmail());
            dto.setCandidateHeadline(c.getHeadline());
            dto.setCandidateEducation(c.getEducation());
            dto.setCandidateExperienceYears(c.getExperienceYears());
            dto.setCandidateSkills(c.getSkills() != null ? new ArrayList<>(c.getSkills()) : new ArrayList<>());
            dto.setResumeFileName(c.getResumeFileName());
            dto.setResumePath(c.getResumePath());
        }

        JobPosting j = app.getJob();
        if (j != null) {
            dto.setJobId(j.getId());
            dto.setJobTitle(j.getTitle());
            dto.setCompanyName(j.getRecruiter().getCompanyName());
            dto.setJobLocation(j.getLocation());
            dto.setJobType(j.getJobType());
            dto.setJobRequiredSkills(j.getRequiredSkills() != null ? new ArrayList<>(j.getRequiredSkills()) : new ArrayList<>());
        }

        dto.setMatchScore(app.getMatchScore());
        dto.setSkillScore(app.getSkillScore());
        dto.setTextSimilarityScore(app.getTextSimilarityScore());
        dto.setExperienceScore(app.getExperienceScore());
        dto.setMatchExplanation(app.getMatchExplanation());
        dto.setStatus(app.getStatus());
        dto.setRecruiterNotes(app.getRecruiterNotes());
        dto.setAppliedDate(app.getAppliedDate());
        dto.setUpdatedDate(app.getUpdatedDate());

        return dto;
    }
}
