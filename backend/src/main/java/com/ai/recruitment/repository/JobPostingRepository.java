package com.ai.recruitment.repository;

import com.ai.recruitment.entity.JobPosting;
import com.ai.recruitment.entity.JobStatus;
import com.ai.recruitment.entity.RecruiterProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobPostingRepository extends JpaRepository<JobPosting, Long> {
    List<JobPosting> findByStatus(JobStatus status);
    List<JobPosting> findByRecruiter(RecruiterProfile recruiter);
    List<JobPosting> findByRecruiterId(Long recruiterId);

    @Query("SELECT j FROM JobPosting j WHERE j.status = :status AND " +
           "(:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(j.department) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:jobType IS NULL OR j.jobType = :jobType) AND " +
           "(:maxExp IS NULL OR j.experienceRequired <= :maxExp)")
    List<JobPosting> searchJobs(
            @Param("status") JobStatus status,
            @Param("keyword") String keyword,
            @Param("location") String location,
            @Param("jobType") String jobType,
            @Param("maxExp") Double maxExp
    );

    long countByStatus(JobStatus status);
}
