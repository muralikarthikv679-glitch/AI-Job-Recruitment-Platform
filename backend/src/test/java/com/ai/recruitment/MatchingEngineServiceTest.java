package com.ai.recruitment;

import com.ai.recruitment.dto.MatchResultDto;
import com.ai.recruitment.entity.CandidateProfile;
import com.ai.recruitment.entity.JobPosting;
import com.ai.recruitment.service.MatchingEngineService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;

public class MatchingEngineServiceTest {

    private MatchingEngineService matchingEngineService;

    @BeforeEach
    void setUp() {
        matchingEngineService = new MatchingEngineService();
    }

    @Test
    void testCosineSimilarityIdenticalText() {
        String text1 = "Full Stack Java Spring Boot Microservices React MySQL";
        String text2 = "Full Stack Java Spring Boot Microservices React MySQL";

        double sim = matchingEngineService.computeCosineSimilarity(text1, text2);
        assertTrue(sim > 0.95, "Identical texts should have cosine similarity near 1.0, got: " + sim);
    }

    @Test
    void testCosineSimilarityCompletelyDifferentText() {
        String text1 = "Java Spring Boot microservices database SQL architecture";
        String text2 = "Digital marketing social media SEO content writing photography";

        double sim = matchingEngineService.computeCosineSimilarity(text1, text2);
        assertTrue(sim < 0.15, "Disjoint texts should have very low cosine similarity, got: " + sim);
    }

    @Test
    void testCalculateMatchHighCompatibility() {
        CandidateProfile candidate = new CandidateProfile();
        candidate.setHeadline("Senior Java Developer");
        candidate.setSummary("5 years building Spring Boot applications and React interfaces.");
        candidate.setSkills(Arrays.asList("Java", "Spring Boot", "React", "MySQL", "Docker", "REST API"));
        candidate.setExperienceYears(5.0);
        candidate.setRawResumeText("Expert in Java, Spring Boot, React, MySQL database design, REST APIs, and Docker containerization.");

        JobPosting job = new JobPosting();
        job.setTitle("Senior Java Engineer");
        job.setDescription("Looking for a Java developer experienced with Spring Boot, React, MySQL, and Docker.");
        job.setRequiredSkills(Arrays.asList("Java", "Spring Boot", "React", "MySQL", "Docker"));
        job.setExperienceRequired(4.0);

        MatchResultDto result = matchingEngineService.calculateMatch(candidate, job);

        assertNotNull(result);
        assertTrue(result.getOverallMatchScore() >= 80.0, "Expected high match score >= 80, got: " + result.getOverallMatchScore());
        assertEquals("High Match", result.getFitCategory());
        assertEquals(5, result.getMatchedSkills().size());
        assertTrue(result.getMissingSkills().isEmpty());
    }

    @Test
    void testCalculateMatchPartialCompatibility() {
        CandidateProfile candidate = new CandidateProfile();
        candidate.setHeadline("Junior React Developer");
        candidate.setSkills(Arrays.asList("React", "JavaScript", "HTML", "CSS"));
        candidate.setExperienceYears(1.0);
        candidate.setRawResumeText("React frontend developer with 1 year experience.");

        JobPosting job = new JobPosting();
        job.setTitle("Senior Java & Cloud Architect");
        job.setDescription("Senior architect needed with deep Java, Spring Boot, AWS, and Kubernetes experience.");
        job.setRequiredSkills(Arrays.asList("Java", "Spring Boot", "AWS", "Kubernetes", "Docker"));
        job.setExperienceRequired(6.0);

        MatchResultDto result = matchingEngineService.calculateMatch(candidate, job);

        assertNotNull(result);
        assertTrue(result.getOverallMatchScore() < 50.0, "Expected low match score < 50, got: " + result.getOverallMatchScore());
        assertEquals("Low Match", result.getFitCategory());
        assertEquals(5, result.getMissingSkills().size());
    }
}
