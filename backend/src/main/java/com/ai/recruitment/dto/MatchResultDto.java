package com.ai.recruitment.dto;

import java.util.List;

public class MatchResultDto {
    private Double overallMatchScore;
    private Double skillMatchScore;
    private Double tfidfSimilarityScore;
    private Double experienceMatchScore;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private String qualitativeExplanation;
    private String fitCategory; // High Match (>80%), Moderate Match (50-80%), Low Match (<50%)

    public MatchResultDto() {}

    public Double getOverallMatchScore() {
        return overallMatchScore;
    }

    public void setOverallMatchScore(Double overallMatchScore) {
        this.overallMatchScore = overallMatchScore;
    }

    public Double getSkillMatchScore() {
        return skillMatchScore;
    }

    public void setSkillMatchScore(Double skillMatchScore) {
        this.skillMatchScore = skillMatchScore;
    }

    public Double getTfidfSimilarityScore() {
        return tfidfSimilarityScore;
    }

    public void setTfidfSimilarityScore(Double tfidfSimilarityScore) {
        this.tfidfSimilarityScore = tfidfSimilarityScore;
    }

    public Double getExperienceMatchScore() {
        return experienceMatchScore;
    }

    public void setExperienceMatchScore(Double experienceMatchScore) {
        this.experienceMatchScore = experienceMatchScore;
    }

    public List<String> getMatchedSkills() {
        return matchedSkills;
    }

    public void setMatchedSkills(List<String> matchedSkills) {
        this.matchedSkills = matchedSkills;
    }

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills;
    }

    public String getQualitativeExplanation() {
        return qualitativeExplanation;
    }

    public void setQualitativeExplanation(String qualitativeExplanation) {
        this.qualitativeExplanation = qualitativeExplanation;
    }

    public String getFitCategory() {
        return fitCategory;
    }

    public void setFitCategory(String fitCategory) {
        this.fitCategory = fitCategory;
    }
}
