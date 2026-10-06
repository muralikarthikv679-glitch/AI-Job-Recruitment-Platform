package com.ai.recruitment.repository;

import com.ai.recruitment.entity.Application;
import com.ai.recruitment.entity.ApplicationStatus;
import com.ai.recruitment.entity.CandidateProfile;
import com.ai.recruitment.entity.JobPosting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByCandidate(CandidateProfile candidate);
    List<Application> findByCandidateId(Long candidateId);
    List<Application> findByJob(JobPosting job);
    List<Application> findByJobId(Long jobId);
    List<Application> findByJobIdOrderByMatchScoreDesc(Long jobId);
    Optional<Application> findByCandidateAndJob(CandidateProfile candidate, JobPosting job);
    Optional<Application> findByCandidateIdAndJobId(Long candidateId, Long jobId);
    boolean existsByCandidateIdAndJobId(Long candidateId, Long jobId);

    @Query("SELECT a FROM Application a WHERE a.job.recruiter.id = :recruiterId")
    List<Application> findByRecruiterId(@Param("recruiterId") Long recruiterId);

    @Query("SELECT a FROM Application a WHERE a.job.recruiter.id = :recruiterId AND a.status = :status")
    List<Application> findByRecruiterIdAndStatus(@Param("recruiterId") Long recruiterId, @Param("status") ApplicationStatus status);

    long countByJobId(Long jobId);
    long countByJobIdAndStatus(Long jobId, ApplicationStatus status);
}
