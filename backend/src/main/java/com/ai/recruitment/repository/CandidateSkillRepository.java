package com.ai.recruitment.repository;

import com.ai.recruitment.entity.CandidateProfile;
import com.ai.recruitment.entity.CandidateSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidateSkillRepository extends JpaRepository<CandidateSkill, Long> {
    List<CandidateSkill> findByCandidateProfile(CandidateProfile candidateProfile);
    List<CandidateSkill> findByCandidateProfileId(Long candidateProfileId);
    void deleteByCandidateProfile(CandidateProfile candidateProfile);
}
