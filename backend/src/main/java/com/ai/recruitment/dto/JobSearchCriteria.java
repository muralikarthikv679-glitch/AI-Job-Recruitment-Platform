package com.ai.recruitment.dto;

public class JobSearchCriteria {
    private String keyword;
    private String location;
    private String jobType;
    private Double maxExp;
    private Double minMatchScore;

    public JobSearchCriteria() {}

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getJobType() {
        return jobType;
    }

    public void setJobType(String jobType) {
        this.jobType = jobType;
    }

    public Double getMaxExp() {
        return maxExp;
    }

    public void setMaxExp(Double maxExp) {
        this.maxExp = maxExp;
    }

    public Double getMinMatchScore() {
        return minMatchScore;
    }

    public void setMinMatchScore(Double minMatchScore) {
        this.minMatchScore = minMatchScore;
    }
}
