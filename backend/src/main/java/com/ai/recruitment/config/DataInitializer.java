package com.ai.recruitment.config;

import com.ai.recruitment.dto.MatchResultDto;
import com.ai.recruitment.entity.*;
import com.ai.recruitment.repository.*;
import com.ai.recruitment.service.MatchingEngineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CandidateProfileRepository candidateProfileRepository;

    @Autowired
    private RecruiterProfileRepository recruiterProfileRepository;

    @Autowired
    private JobPostingRepository jobPostingRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private MatchingEngineService matchingEngineService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return; // Already initialized
        }

        System.out.println(">>> Initializing TalentFlow Enterprise ATS Database with Enterprise Seed Data...");

        // 1. Seed Common Skills
        List<String> skills = List.of(
                "Java", "Spring Boot", "React", "JavaScript", "TypeScript", "Python", "Machine Learning",
                "Docker", "Kubernetes", "AWS", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Kafka",
                "REST API", "Microservices", "Git", "CI/CD", "Tailwind CSS", "PyTorch", "NLP"
        );
        for (String s : skills) {
            skillRepository.save(new Skill(s, "Technical"));
        }

        // 2. Seed Admin User
        User admin = new User("System Administrator", "admin@talentflow.io", passwordEncoder.encode("admin123"), Role.ADMIN);
        userRepository.save(admin);

        // 3. Seed Recruiters
        User rec1User = new User("Sarah Jenkins", "recruiter@google.com", passwordEncoder.encode("recruiter123"), Role.RECRUITER);
        userRepository.save(rec1User);
        RecruiterProfile rec1Profile = new RecruiterProfile(rec1User, "Google Cloud Solutions");
        rec1Profile.setCompanyDescription("Leading global tech provider of scalable enterprise cloud infrastructure and developer tooling.");
        rec1Profile.setCompanyWebsite("https://cloud.google.com");
        rec1Profile.setIndustry("Information Technology & Cloud");
        rec1Profile.setLocation("San Francisco, CA / Remote");
        rec1Profile.setCompanySize("10,000+ employees");
        recruiterProfileRepository.save(rec1Profile);

        User rec2User = new User("Michael Vance", "recruiter@amazon.com", passwordEncoder.encode("recruiter123"), Role.RECRUITER);
        userRepository.save(rec2User);
        RecruiterProfile rec2Profile = new RecruiterProfile(rec2User, "Amazon Web Services");
        rec2Profile.setCompanyDescription("Building next generation cloud architecture, serverless applications and distributed platforms.");
        rec2Profile.setCompanyWebsite("https://aws.amazon.com");
        rec2Profile.setIndustry("Cloud Computing & Enterprise Software");
        rec2Profile.setLocation("Seattle, WA / Remote");
        rec2Profile.setCompanySize("10,000+ employees");
        recruiterProfileRepository.save(rec2Profile);

        // 4. Seed Candidates
        // Candidate 1: Full Stack Java Dev
        User cand1User = new User("Alex Morgan", "candidate1@gmail.com", passwordEncoder.encode("candidate123"), Role.CANDIDATE);
        userRepository.save(cand1User);
        CandidateProfile cand1Profile = new CandidateProfile(cand1User);
        cand1Profile.setHeadline("Senior Full-Stack Java & Spring Boot Developer");
        cand1Profile.setPhone("+1 (555) 234-5678");
        cand1Profile.setLocation("San Jose, CA");
        cand1Profile.setEducation("B.S. in Computer Science - University of California, Berkeley");
        cand1Profile.setExperienceYears(5.5);
        cand1Profile.setSummary("Experienced Software Engineer with 5+ years specializing in enterprise Spring Boot backend architectures, microservices, REST APIs, and modern React user interfaces.");
        cand1Profile.setSkills(Arrays.asList("Java", "Spring Boot", "React", "JavaScript", "MySQL", "REST API", "Docker", "Git", "Microservices", "Redis"));
        cand1Profile.setResumeFileName("Alex_Morgan_Resume_2026.pdf");
        cand1Profile.setRawResumeText("Alex Morgan. Senior Full Stack Java Developer. 5.5 years experience in building high-throughput microservices using Spring Boot, Hibernate, JPA, and React.js. Proficient with MySQL, Redis caching, Docker containerization, RESTful API architecture, Git version control, and CI/CD pipelines.");
        candidateProfileRepository.save(cand1Profile);

        // Candidate 2: AI / ML Engineer
        User cand2User = new User("Dr. Sarah Chen", "candidate2@gmail.com", passwordEncoder.encode("candidate123"), Role.CANDIDATE);
        userRepository.save(cand2User);
        CandidateProfile cand2Profile = new CandidateProfile(cand2User);
        cand2Profile.setHeadline("AI / Machine Learning Engineer & NLP Specialist");
        cand2Profile.setPhone("+1 (555) 876-5432");
        cand2Profile.setLocation("Boston, MA / Remote");
        cand2Profile.setEducation("Ph.D. in Computer Science & Artificial Intelligence - MIT");
        cand2Profile.setExperienceYears(4.0);
        cand2Profile.setSummary("Machine Learning researcher and applied engineer focusing on Natural Language Processing (NLP), Large Language Models (LLMs), and PyTorch model fine-tuning.");
        cand2Profile.setSkills(Arrays.asList("Python", "Machine Learning", "PyTorch", "NLP", "TensorFlow", "Docker", "AWS", "REST API", "Git"));
        cand2Profile.setResumeFileName("Sarah_Chen_AI_Resume.pdf");
        cand2Profile.setRawResumeText("Sarah Chen, Ph.D. Applied Machine Learning Specialist with 4 years experience deploying deep learning models in production. Deep expertise in Python, PyTorch, Natural Language Processing, TF-IDF vectorizers, Transformer architectures, AWS SageMaker, and Docker.");
        candidateProfileRepository.save(cand2Profile);

        // Candidate 3: Frontend Dev
        User cand3User = new User("David Kumar", "candidate3@gmail.com", passwordEncoder.encode("candidate123"), Role.CANDIDATE);
        userRepository.save(cand3User);
        CandidateProfile cand3Profile = new CandidateProfile(cand3User);
        cand3Profile.setHeadline("Frontend & UI/UX Engineer (React / TypeScript)");
        cand3Profile.setPhone("+1 (555) 432-8765");
        cand3Profile.setLocation("Austin, TX");
        cand3Profile.setEducation("B.Tech in Information Technology");
        cand3Profile.setExperienceYears(3.0);
        cand3Profile.setSummary("Frontend engineer passionate about building sleek, accessible web applications with React, TypeScript, Tailwind CSS, and state management.");
        cand3Profile.setSkills(Arrays.asList("React", "TypeScript", "JavaScript", "Tailwind CSS", "HTML", "CSS", "Git", "REST API"));
        cand3Profile.setResumeFileName("David_Kumar_Frontend_CV.pdf");
        cand3Profile.setRawResumeText("David Kumar. Frontend Engineer with 3 years building responsive, accessible Single Page Applications using React 18, TypeScript, Tailwind CSS, Redux Toolkit, and RESTful API integrations.");
        candidateProfileRepository.save(cand3Profile);

        // Candidate 4: Cloud DevOps Specialist
        User cand4User = new User("Elena Rostova", "candidate4@gmail.com", passwordEncoder.encode("candidate123"), Role.CANDIDATE);
        userRepository.save(cand4User);
        CandidateProfile cand4Profile = new CandidateProfile(cand4User);
        cand4Profile.setHeadline("Cloud Solutions & DevOps Engineer");
        cand4Profile.setPhone("+1 (555) 998-1122");
        cand4Profile.setLocation("Seattle, WA");
        cand4Profile.setEducation("B.S. in Software Engineering");
        cand4Profile.setExperienceYears(4.5);
        cand4Profile.setSummary("DevOps specialist experienced in multi-cloud infrastructure, Kubernetes orchestration, Docker pipelines, CI/CD automation, and infrastructure as code.");
        cand4Profile.setSkills(Arrays.asList("AWS", "Docker", "Kubernetes", "CI/CD", "Git", "Python", "Linux", "Microservices"));
        cand4Profile.setResumeFileName("Elena_Rostova_DevOps.pdf");
        cand4Profile.setRawResumeText("Elena Rostova. Cloud DevOps Engineer with 4.5 years managing AWS cloud infrastructure, Kubernetes clusters, Docker image builds, CI/CD automation with GitHub Actions, Linux administration, and Python scripting.");
        candidateProfileRepository.save(cand4Profile);

        // 5. Seed Job Postings
        JobPosting job1 = new JobPosting();
        job1.setRecruiter(rec1Profile);
        job1.setTitle("Senior Full Stack Java Engineer");
        job1.setDepartment("Core Platforms");
        job1.setDescription("We are seeking a seasoned Full Stack Java Engineer to design, develop, and scale high-concurrency cloud services. You will collaborate with cross-functional teams to build resilient microservices with Spring Boot and dynamic user dashboards in React.");
        job1.setResponsibilities("- Architect and implement robust RESTful APIs and Spring Boot microservices.\n- Build dynamic frontend components in React and TypeScript.\n- Optimize relational database queries in MySQL/PostgreSQL.\n- Participate in code reviews and CI/CD automated deployments.");
        job1.setRequiredSkills(Arrays.asList("Java", "Spring Boot", "React", "MySQL", "Docker", "REST API", "Microservices"));
        job1.setExperienceRequired(4.0);
        job1.setLocation("San Francisco, CA / Remote");
        job1.setJobType("Full-time");
        job1.setSalaryRange("$140,000 - $175,000 / year");
        job1.setStatus(JobStatus.ACTIVE);
        job1.setCreatedAt(LocalDateTime.now().minusDays(5));
        jobPostingRepository.save(job1);

        JobPosting job2 = new JobPosting();
        job2.setRecruiter(rec1Profile);
        job2.setTitle("AI / Machine Learning Applied Scientist");
        job2.setDepartment("Artificial Intelligence Research");
        job2.setDescription("Join our AI research team to build and optimize state-of-the-art NLP models, semantic matching systems, and conversational AI services deployed at enterprise scale.");
        job2.setResponsibilities("- Research, train, and fine-tune NLP and Large Language Models.\n- Implement similarity scoring algorithms (TF-IDF, vector embeddings, cosine distance).\n- Build automated model evaluation pipelines using PyTorch and Python.\n- Collaborate on production deployment with Docker & AWS.");
        job2.setRequiredSkills(Arrays.asList("Python", "Machine Learning", "PyTorch", "NLP", "TensorFlow", "Docker", "AWS"));
        job2.setExperienceRequired(3.0);
        job2.setLocation("Remote");
        job2.setJobType("Full-time");
        job2.setSalaryRange("$155,000 - $190,000 / year");
        job2.setStatus(JobStatus.ACTIVE);
        job2.setCreatedAt(LocalDateTime.now().minusDays(3));
        jobPostingRepository.save(job2);

        JobPosting job3 = new JobPosting();
        job3.setRecruiter(rec2Profile);
        job3.setTitle("Cloud Infrastructure & DevOps Engineer");
        job3.setDepartment("AWS Cloud Operations");
        job3.setDescription("We are looking for a DevOps Engineer to automate and scale our multi-region Kubernetes clusters and streamline CI/CD delivery pipelines.");
        job3.setResponsibilities("- Deploy and manage containerized microservices across AWS EKS.\n- Configure automated CI/CD pipelines.\n- Monitor infrastructure health and implement automated alerting.\n- Maintain high reliability and security standards.");
        job3.setRequiredSkills(Arrays.asList("AWS", "Docker", "Kubernetes", "CI/CD", "Linux", "Microservices", "Python"));
        job3.setExperienceRequired(3.5);
        job3.setLocation("Seattle, WA / Hybrid");
        job3.setJobType("Full-time");
        job3.setSalaryRange("$135,000 - $165,000 / year");
        job3.setStatus(JobStatus.ACTIVE);
        job3.setCreatedAt(LocalDateTime.now().minusDays(2));
        jobPostingRepository.save(job3);

        JobPosting job4 = new JobPosting();
        job4.setRecruiter(rec2Profile);
        job4.setTitle("Senior React & Frontend UI Engineer");
        job4.setDepartment("Frontend Experience");
        job4.setDescription("Develop beautiful, accessible, and ultra-fast user experiences for millions of enterprise users worldwide using modern React and TypeScript.");
        job4.setResponsibilities("- Build reusable component libraries in React and Tailwind CSS.\n- Integrate with GraphQL and REST backend services.\n- Drive frontend performance tuning and accessibility compliance.\n- Mentor junior developers.");
        job4.setRequiredSkills(Arrays.asList("React", "TypeScript", "JavaScript", "Tailwind CSS", "REST API", "Git"));
        job4.setExperienceRequired(3.0);
        job4.setLocation("Remote");
        job4.setJobType("Full-time");
        job4.setSalaryRange("$125,000 - $155,000 / year");
        job4.setStatus(JobStatus.ACTIVE);
        job4.setCreatedAt(LocalDateTime.now().minusDays(1));
        jobPostingRepository.save(job4);

        // 6. Seed Applications & Calculate Match Scores
        // Application 1: Alex -> Job 1 (High Match)
        MatchResultDto match1 = matchingEngineService.calculateMatch(cand1Profile, job1);
        Application app1 = new Application(cand1Profile, job1);
        app1.setMatchScore(match1.getOverallMatchScore());
        app1.setSkillScore(match1.getSkillMatchScore());
        app1.setTextSimilarityScore(match1.getTfidfSimilarityScore());
        app1.setExperienceScore(match1.getExperienceMatchScore());
        app1.setMatchExplanation(match1.getQualitativeExplanation());
        app1.setStatus(ApplicationStatus.SHORTLISTED);
        app1.setRecruiterNotes("Top candidate with strong Java and Spring Boot experience. Recommended for technical round.");
        app1.setAppliedDate(LocalDateTime.now().minusDays(4));
        applicationRepository.save(app1);

        // Application 2: Sarah Chen -> Job 2 (High Match)
        MatchResultDto match2 = matchingEngineService.calculateMatch(cand2Profile, job2);
        Application app2 = new Application(cand2Profile, job2);
        app2.setMatchScore(match2.getOverallMatchScore());
        app2.setSkillScore(match2.getSkillMatchScore());
        app2.setTextSimilarityScore(match2.getTfidfSimilarityScore());
        app2.setExperienceScore(match2.getExperienceMatchScore());
        app2.setMatchExplanation(match2.getQualitativeExplanation());
        app2.setStatus(ApplicationStatus.INTERVIEW_SCHEDULED);
        app2.setRecruiterNotes("Exceptional research background in NLP and deep learning. Technical interview scheduled.");
        app2.setAppliedDate(LocalDateTime.now().minusDays(2));
        applicationRepository.save(app2);

        // Application 3: David Kumar -> Job 4 (High Match)
        MatchResultDto match3 = matchingEngineService.calculateMatch(cand3Profile, job4);
        Application app3 = new Application(cand3Profile, job4);
        app3.setMatchScore(match3.getOverallMatchScore());
        app3.setSkillScore(match3.getSkillMatchScore());
        app3.setTextSimilarityScore(match3.getTfidfSimilarityScore());
        app3.setExperienceScore(match3.getExperienceMatchScore());
        app3.setMatchExplanation(match3.getQualitativeExplanation());
        app3.setStatus(ApplicationStatus.APPLIED);
        app3.setAppliedDate(LocalDateTime.now().minusDays(1));
        applicationRepository.save(app3);

        // Application 4: Elena -> Job 3 (High Match)
        MatchResultDto match4 = matchingEngineService.calculateMatch(cand4Profile, job3);
        Application app4 = new Application(cand4Profile, job3);
        app4.setMatchScore(match4.getOverallMatchScore());
        app4.setSkillScore(match4.getSkillMatchScore());
        app4.setTextSimilarityScore(match4.getTfidfSimilarityScore());
        app4.setExperienceScore(match4.getExperienceMatchScore());
        app4.setMatchExplanation(match4.getQualitativeExplanation());
        app4.setStatus(ApplicationStatus.HIRED);
        app4.setRecruiterNotes("Accepted offer letter. Start date set for next month.");
        app4.setAppliedDate(LocalDateTime.now().minusDays(5));
        applicationRepository.save(app4);

        // Application 5: David Kumar -> Job 1 (Moderate/Low Match for ranking contrast)
        MatchResultDto match5 = matchingEngineService.calculateMatch(cand3Profile, job1);
        Application app5 = new Application(cand3Profile, job1);
        app5.setMatchScore(match5.getOverallMatchScore());
        app5.setSkillScore(match5.getSkillMatchScore());
        app5.setTextSimilarityScore(match5.getTfidfSimilarityScore());
        app5.setExperienceScore(match5.getExperienceMatchScore());
        app5.setMatchExplanation(match5.getQualitativeExplanation());
        app5.setStatus(ApplicationStatus.APPLIED);
        app5.setAppliedDate(LocalDateTime.now().minusHours(8));
        applicationRepository.save(app5);

        // 7. Seed Notifications
        notificationRepository.save(new Notification(cand1User, "Application Shortlisted! ✨",
                "Congratulations Alex! Your application for Senior Full Stack Java Engineer has been shortlisted by Google Cloud Solutions.",
                "STATUS_CHANGE", "/candidate/applications"));

        notificationRepository.save(new Notification(cand2User, "Interview Scheduled 📅",
                "Interview invitation sent for AI / Machine Learning Applied Scientist position.",
                "STATUS_CHANGE", "/candidate/applications"));

        // 8. Seed Chat Messages
        chatMessageRepository.save(new ChatMessage(rec1User, cand1User, job1,
                "Hi Alex, we reviewed your profile and were very impressed with your Spring Boot and microservices background!"));
        chatMessageRepository.save(new ChatMessage(cand1User, rec1User, job1,
                "Thank you Sarah! I'm very excited about this role and look forward to discussing how I can contribute."));

        System.out.println(">>> Database Seed Completed Successfully!");
    }
}
