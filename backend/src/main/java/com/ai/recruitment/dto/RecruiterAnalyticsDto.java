package com.ai.recruitment.dto;

import java.util.Map;

public class RecruiterAnalyticsDto {
    private long totalJobsPosted;
    private long activeJobsCount;
    private long totalApplicationsReceived;
    private long shortlistedCount;
    private long interviewScheduledCount;
    private long hiredCount;
    private long rejectedCount;
    private double averageMatchScore;
    private Map<String, Long> applicationsByStatus;
    private Map<String, Long> applicationsPerJob;
    private Map<String, Long> topRequiredSkillsDemand;
    private Map<String, Double> averageScorePerJob;

    public RecruiterAnalyticsDto() {}

    public long getTotalJobsPosted() {
        return totalJobsPosted;
    }

    public void setTotalJobsPosted(long totalJobsPosted) {
        this.totalJobsPosted = totalJobsPosted;
    }

    public long getActiveJobsCount() {
        return activeJobsCount;
    }

    public void setActiveJobsCount(long activeJobsCount) {
        this.activeJobsCount = activeJobsCount;
    }

    public long getTotalApplicationsReceived() {
        return totalApplicationsReceived;
    }

    public void setTotalApplicationsReceived(long totalApplicationsReceived) {
        this.totalApplicationsReceived = totalApplicationsReceived;
    }

    public long getShortlistedCount() {
        return shortlistedCount;
    }

    public void setShortlistedCount(long shortlistedCount) {
        this.shortlistedCount = shortlistedCount;
    }

    public long getInterviewScheduledCount() {
        return interviewScheduledCount;
    }

    public void setInterviewScheduledCount(long interviewScheduledCount) {
        this.interviewScheduledCount = interviewScheduledCount;
    }

    public long getHiredCount() {
        return hiredCount;
    }

    public void setHiredCount(long hiredCount) {
        this.hiredCount = hiredCount;
    }

    public long getRejectedCount() {
        return rejectedCount;
    }

    public void setRejectedCount(long rejectedCount) {
        this.rejectedCount = rejectedCount;
    }

    public double getAverageMatchScore() {
        return averageMatchScore;
    }

    public void setAverageMatchScore(double averageMatchScore) {
        this.averageMatchScore = averageMatchScore;
    }

    public Map<String, Long> getApplicationsByStatus() {
        return applicationsByStatus;
    }

    public void setApplicationsByStatus(Map<String, Long> applicationsByStatus) {
        this.applicationsByStatus = applicationsByStatus;
    }

    public Map<String, Long> getApplicationsPerJob() {
        return applicationsPerJob;
    }

    public void setApplicationsPerJob(Map<String, Long> applicationsPerJob) {
        this.applicationsPerJob = applicationsPerJob;
    }

    public Map<String, Long> getTopRequiredSkillsDemand() {
        return topRequiredSkillsDemand;
    }

    public void setTopRequiredSkillsDemand(Map<String, Long> topRequiredSkillsDemand) {
        this.topRequiredSkillsDemand = topRequiredSkillsDemand;
    }

    public Map<String, Double> getAverageScorePerJob() {
        return averageScorePerJob;
    }

    public void setAverageScorePerJob(Map<String, Double> averageScorePerJob) {
        this.averageScorePerJob = averageScorePerJob;
    }
}
