package com.ai.recruitment.service;

import com.ai.recruitment.dto.RecruiterAnalyticsDto;
import com.ai.recruitment.entity.*;
import com.ai.recruitment.repository.ApplicationRepository;
import com.ai.recruitment.repository.JobPostingRepository;
import com.ai.recruitment.repository.RecruiterProfileRepository;
import com.ai.recruitment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private JobPostingRepository jobPostingRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private RecruiterProfileRepository recruiterProfileRepository;

    @Autowired
    private UserRepository userRepository;

    public RecruiterAnalyticsDto getRecruiterAnalytics(String recruiterEmail) {
        User user = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + recruiterEmail));

        RecruiterProfile recruiter = recruiterProfileRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Recruiter profile not found"));

        List<JobPosting> jobs = jobPostingRepository.findByRecruiter(recruiter);
        List<Application> allApplications = applicationRepository.findByRecruiterId(recruiter.getId());

        RecruiterAnalyticsDto dto = new RecruiterAnalyticsDto();
        dto.setTotalJobsPosted(jobs.size());
        dto.setActiveJobsCount(jobs.stream().filter(j -> j.getStatus() == JobStatus.ACTIVE).count());
        dto.setTotalApplicationsReceived(allApplications.size());

        long shortlisted = allApplications.stream().filter(a -> a.getStatus() == ApplicationStatus.SHORTLISTED).count();
        long interview = allApplications.stream().filter(a -> a.getStatus() == ApplicationStatus.INTERVIEW_SCHEDULED).count();
        long hired = allApplications.stream().filter(a -> a.getStatus() == ApplicationStatus.HIRED).count();
        long rejected = allApplications.stream().filter(a -> a.getStatus() == ApplicationStatus.REJECTED).count();

        dto.setShortlistedCount(shortlisted);
        dto.setInterviewScheduledCount(interview);
        dto.setHiredCount(hired);
        dto.setRejectedCount(rejected);

        double avgScore = allApplications.stream()
                .filter(a -> a.getMatchScore() != null)
                .mapToDouble(Application::getMatchScore)
                .average()
                .orElse(0.0);
        dto.setAverageMatchScore(Math.round(avgScore * 10.0) / 10.0);

        // Applications by status
        Map<String, Long> statusMap = new LinkedHashMap<>();
        for (ApplicationStatus status : ApplicationStatus.values()) {
            long count = allApplications.stream().filter(a -> a.getStatus() == status).count();
            statusMap.put(status.name(), count);
        }
        dto.setApplicationsByStatus(statusMap);

        // Applications per job
        Map<String, Long> perJob = new HashMap<>();
        Map<String, Double> avgScorePerJob = new HashMap<>();
        for (JobPosting job : jobs) {
            List<Application> jobApps = allApplications.stream()
                    .filter(a -> a.getJob().getId().equals(job.getId()))
                    .collect(Collectors.toList());
            perJob.put(job.getTitle(), (long) jobApps.size());

            double jobAvg = jobApps.stream()
                    .filter(a -> a.getMatchScore() != null)
                    .mapToDouble(Application::getMatchScore)
                    .average()
                    .orElse(0.0);
            avgScorePerJob.put(job.getTitle(), Math.round(jobAvg * 10.0) / 10.0);
        }
        dto.setApplicationsPerJob(perJob);
        dto.setAverageScorePerJob(avgScorePerJob);

        // Top required skills demand across recruiter's jobs
        Map<String, Long> skillDemand = new HashMap<>();
        for (JobPosting job : jobs) {
            if (job.getRequiredSkills() != null) {
                for (String skill : job.getRequiredSkills()) {
                    skillDemand.put(skill, skillDemand.getOrDefault(skill, 0L) + 1);
                }
            }
        }
        dto.setTopRequiredSkillsDemand(skillDemand);

        return dto;
    }
}
