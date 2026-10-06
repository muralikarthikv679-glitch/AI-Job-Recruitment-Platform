package com.ai.recruitment.service;

import com.ai.recruitment.dto.JobPostingDto;
import com.ai.recruitment.dto.JobSearchCriteria;
import com.ai.recruitment.dto.MatchResultDto;
import com.ai.recruitment.entity.*;
import com.ai.recruitment.repository.ApplicationRepository;
import com.ai.recruitment.repository.CandidateProfileRepository;
import com.ai.recruitment.repository.JobPostingRepository;
import com.ai.recruitment.repository.RecruiterProfileRepository;
import com.ai.recruitment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class JobService {

    @Autowired
    private JobPostingRepository jobPostingRepository;

    @Autowired
    private RecruiterProfileRepository recruiterProfileRepository;

    @Autowired
    private CandidateProfileRepository candidateProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private MatchingEngineService matchingEngineService;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public JobPostingDto createJob(String recruiterEmail, JobPostingDto dto) {
        User user = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + recruiterEmail));

        RecruiterProfile recruiter = recruiterProfileRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Recruiter profile not found for user: " + recruiterEmail));

        JobPosting job = new JobPosting();
        job.setRecruiter(recruiter);
        job.setTitle(dto.getTitle());
        job.setDepartment(dto.getDepartment());
        job.setDescription(dto.getDescription());
        job.setResponsibilities(dto.getResponsibilities());
        job.setRequiredSkills(dto.getRequiredSkills() != null ? new ArrayList<>(dto.getRequiredSkills()) : new ArrayList<>());
        job.setExperienceRequired(dto.getExperienceRequired());
        job.setLocation(dto.getLocation());
        job.setJobType(dto.getJobType() != null ? dto.getJobType() : "Full-time");
        job.setSalaryRange(dto.getSalaryRange());
        job.setStatus(dto.getStatus() != null ? dto.getStatus() : JobStatus.ACTIVE);
        job.setCreatedAt(LocalDateTime.now());

        JobPosting saved = jobPostingRepository.save(job);
        return mapToDto(saved, null);
    }

    @Transactional
    public JobPostingDto updateJob(Long jobId, String recruiterEmail, JobPostingDto dto) {
        JobPosting job = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found: " + jobId));

        User user = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + recruiterEmail));

        if (user.getRole() != Role.ADMIN && !job.getRecruiter().getUser().getId().equals(user.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("You cannot edit this job posting");
        }

        if (dto.getTitle() != null) job.setTitle(dto.getTitle());
        if (dto.getDepartment() != null) job.setDepartment(dto.getDepartment());
        if (dto.getDescription() != null) job.setDescription(dto.getDescription());
        if (dto.getResponsibilities() != null) job.setResponsibilities(dto.getResponsibilities());
        if (dto.getRequiredSkills() != null) job.setRequiredSkills(new ArrayList<>(dto.getRequiredSkills()));
        if (dto.getExperienceRequired() != null) job.setExperienceRequired(dto.getExperienceRequired());
        if (dto.getLocation() != null) job.setLocation(dto.getLocation());
        if (dto.getJobType() != null) job.setJobType(dto.getJobType());
        if (dto.getSalaryRange() != null) job.setSalaryRange(dto.getSalaryRange());
        if (dto.getStatus() != null) job.setStatus(dto.getStatus());
        job.setUpdatedAt(LocalDateTime.now());

        JobPosting saved = jobPostingRepository.save(job);
        return mapToDto(saved, null);
    }

    @Transactional
    public void deleteJob(Long jobId, String recruiterEmail) {
        JobPosting job = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found: " + jobId));

        User user = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + recruiterEmail));

        if (user.getRole() != Role.ADMIN && !job.getRecruiter().getUser().getId().equals(user.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("You cannot delete this job posting");
        }

        jobPostingRepository.delete(job);
    }

    public List<JobPostingDto> getAllActiveJobs(String candidateEmail, JobSearchCriteria criteria) {
        CandidateProfile candidateProfile = null;
        if (candidateEmail != null) {
            Optional<User> candUser = userRepository.findByEmail(candidateEmail);
            if (candUser.isPresent() && candUser.get().getRole() == Role.CANDIDATE) {
                candidateProfile = candidateProfileRepository.findByUser(candUser.get()).orElse(null);
            }
        }

        List<JobPosting> jobs;
        if (criteria != null && (criteria.getKeyword() != null || criteria.getLocation() != null || criteria.getJobType() != null || criteria.getMaxExp() != null)) {
            jobs = jobPostingRepository.searchJobs(
                    JobStatus.ACTIVE,
                    criteria.getKeyword(),
                    criteria.getLocation(),
                    criteria.getJobType(),
                    criteria.getMaxExp()
            );
        } else {
            jobs = jobPostingRepository.findByStatus(JobStatus.ACTIVE);
        }

        final CandidateProfile finalCandidate = candidateProfile;
        List<JobPostingDto> dtoList = jobs.stream()
                .map(j -> mapToDto(j, finalCandidate))
                .collect(Collectors.toList());

        if (criteria != null && criteria.getMinMatchScore() != null && finalCandidate != null) {
            dtoList = dtoList.stream()
                    .filter(dto -> dto.getMatchScore() != null && dto.getMatchScore() >= criteria.getMinMatchScore())
                    .collect(Collectors.toList());
        }

        // Sort by match score if candidate is logged in
        if (finalCandidate != null) {
            dtoList.sort((a, b) -> Double.compare(
                    b.getMatchScore() != null ? b.getMatchScore() : 0.0,
                    a.getMatchScore() != null ? a.getMatchScore() : 0.0
            ));
        }

        return dtoList;
    }

    public JobPostingDto getJobById(Long id, String candidateEmail) {
        JobPosting job = jobPostingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Job not found: " + id));

        CandidateProfile candidateProfile = null;
        if (candidateEmail != null) {
            Optional<User> candUser = userRepository.findByEmail(candidateEmail);
            if (candUser.isPresent() && candUser.get().getRole() == Role.CANDIDATE) {
                candidateProfile = candidateProfileRepository.findByUser(candUser.get()).orElse(null);
            }
        }

        return mapToDto(job, candidateProfile);
    }

    public List<JobPostingDto> getJobsByRecruiter(String recruiterEmail) {
        User user = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + recruiterEmail));

        RecruiterProfile recruiter = recruiterProfileRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Recruiter profile not found"));

        return jobPostingRepository.findByRecruiter(recruiter)
                .stream()
                .map(j -> mapToDto(j, null))
                .collect(Collectors.toList());
    }

    public JobPostingDto mapToDto(JobPosting job, CandidateProfile candidate) {
        JobPostingDto dto = new JobPostingDto();
        dto.setId(job.getId());
        dto.setRecruiterId(job.getRecruiter().getId());
        dto.setRecruiterName(job.getRecruiter().getUser().getName());
        dto.setCompanyName(job.getRecruiter().getCompanyName());
        dto.setCompanyWebsite(job.getRecruiter().getCompanyWebsite());
        dto.setTitle(job.getTitle());
        dto.setDepartment(job.getDepartment());
        dto.setDescription(job.getDescription());
        dto.setResponsibilities(job.getResponsibilities());
        dto.setRequiredSkills(job.getRequiredSkills() != null ? new ArrayList<>(job.getRequiredSkills()) : new ArrayList<>());
        dto.setExperienceRequired(job.getExperienceRequired());
        dto.setLocation(job.getLocation());
        dto.setJobType(job.getJobType());
        dto.setSalaryRange(job.getSalaryRange());
        dto.setStatus(job.getStatus());
        dto.setCreatedAt(job.getCreatedAt());
        dto.setUpdatedAt(job.getUpdatedAt());

        dto.setApplicantCount(applicationRepository.countByJobId(job.getId()));

        if (candidate != null) {
            MatchResultDto matchResult = matchingEngineService.calculateMatch(candidate, job);
            dto.setMatchScore(matchResult.getOverallMatchScore());
        }

        return dto;
    }
}
