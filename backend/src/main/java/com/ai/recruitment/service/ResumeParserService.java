package com.ai.recruitment.service;

import com.ai.recruitment.dto.ResumeParseResponseDto;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ResumeParserService {

    @Value("${app.upload.dir:./uploads/resumes}")
    private String uploadDir;

    private static final Set<String> KNOWN_SKILLS = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);

    static {
        // Programming Languages
        Collections.addAll(KNOWN_SKILLS,
            "Java", "Python", "JavaScript", "TypeScript", "C++", "C#", "Go", "Golang", "Rust", "Kotlin", "Swift", "PHP", "Ruby", "Scala", "R", "SQL", "HTML", "CSS", "Bash", "Shell",
            // Frameworks & Libraries
            "Spring Boot", "Spring", "Spring MVC", "Spring Security", "Hibernate", "JPA", "React", "React.js", "Angular", "Vue", "Vue.js", "Next.js", "Node.js", "Express", "Django", "Flask", "FastAPI", "ASP.NET", "Tailwind CSS", "Bootstrap", "Redux",
            // Cloud & DevOps
            "AWS", "Amazon Web Services", "Azure", "Google Cloud", "GCP", "Docker", "Kubernetes", "Jenkins", "GitLab CI", "GitHub Actions", "Terraform", "Ansible", "CI/CD", "Linux", "Nginx",
            // Databases & Messaging
            "MySQL", "PostgreSQL", "MongoDB", "Redis", "Oracle", "Elasticsearch", "Kafka", "RabbitMQ", "Cassandra", "DynamoDB", "SQLite",
            // AI & Data Science
            "Machine Learning", "Deep Learning", "NLP", "Natural Language Processing", "TensorFlow", "PyTorch", "Scikit-Learn", "Pandas", "NumPy", "LLM", "Generative AI", "Computer Vision",
            // Architecture & Practices
            "Microservices", "REST API", "GraphQL", "SOAP", "WebSockets", "TDD", "Agile", "Scrum", "Git", "Maven", "Gradle", "JUnit", "Mockito", "Swagger", "OpenAPI", "Jira"
        );
    }

    public ResumeParseResponseDto parseUploadedResume(MultipartFile file) throws IOException {
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            originalFilename = "resume_" + System.currentTimeMillis();
        }

        // Ensure directory exists
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String savedFileName = UUID.randomUUID() + "_" + originalFilename.replaceAll("\\s+", "_");
        Path targetLocation = uploadPath.resolve(savedFileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        // Extract text
        String extractedText = extractText(file.getInputStream(), originalFilename);

        ResumeParseResponseDto dto = parseTextToCandidateData(extractedText);
        dto.setFileName(originalFilename);
        dto.setFilePath(targetLocation.toString());
        dto.setRawText(extractedText);

        return dto;
    }

    public String extractText(InputStream inputStream, String fileName) throws IOException {
        String lower = fileName.toLowerCase();
        if (lower.endsWith(".pdf")) {
            byte[] bytes = inputStream.readAllBytes();
            try (PDDocument document = Loader.loadPDF(bytes)) {
                PDFTextStripper stripper = new PDFTextStripper();
                return stripper.getText(document);
            }
        } else if (lower.endsWith(".docx")) {
            try (XWPFDocument doc = new XWPFDocument(inputStream);
                 XWPFWordExtractor extractor = new XWPFWordExtractor(doc)) {
                return extractor.getText();
            }
        } else {
            // Assume plain text
            return new String(inputStream.readAllBytes());
        }
    }

    public ResumeParseResponseDto parseTextToCandidateData(String text) {
        ResumeParseResponseDto dto = new ResumeParseResponseDto();
        if (text == null || text.isBlank()) {
            dto.setExtractedSkills(new ArrayList<>());
            return dto;
        }

        dto.setEmail(extractEmail(text));
        dto.setPhone(extractPhone(text));
        dto.setExtractedSkills(extractSkills(text));
        dto.setExperienceYears(extractExperienceYears(text));
        dto.setEducation(extractEducation(text));
        dto.setCandidateName(extractName(text));
        dto.setHeadline(generateHeadline(dto.getExtractedSkills(), dto.getExperienceYears()));
        dto.setSummary(extractSummary(text));

        return dto;
    }

    private String extractEmail(String text) {
        Pattern pattern = Pattern.compile("(?i)\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,6}\\b");
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            return matcher.group(0);
        }
        return null;
    }

    private String extractPhone(String text) {
        Pattern pattern = Pattern.compile("(\\+?\\d{1,3}[- .]?)?(\\(?\\d{3}\\)?[- .]?)?\\d{3}[- .]?\\d{4}");
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            return matcher.group(0);
        }
        return null;
    }

    public List<String> extractSkills(String text) {
        Set<String> foundSkills = new LinkedHashSet<>();
        String normalizedText = text.toLowerCase();

        for (String skill : KNOWN_SKILLS) {
            // Check word boundary
            String patternString = "(?i)\\b" + Pattern.quote(skill) + "\\b";
            if (Pattern.compile(patternString).matcher(text).find()) {
                foundSkills.add(skill);
            }
        }
        return new ArrayList<>(foundSkills);
    }

    private Double extractExperienceYears(String text) {
        // Look for patterns like "5+ years of experience", "3 years experience", "4.5 yrs"
        Pattern pattern = Pattern.compile("(?i)(\\d+(\\.\\d+)?)\\s*\\+?\\s*(years?|yrs?)\\b");
        Matcher matcher = pattern.matcher(text);
        double maxExp = 0.0;
        while (matcher.find()) {
            try {
                double val = Double.parseDouble(matcher.group(1));
                if (val < 40 && val > maxExp) {
                    maxExp = val;
                }
            } catch (NumberFormatException ignored) {}
        }

        if (maxExp > 0) {
            return maxExp;
        }

        // Heuristic: count year ranges e.g. 2019 - 2023
        Pattern yearRangePattern = Pattern.compile("\\b(20\\d\\d|19\\d\\d)\\s*[-–—to]+\\s*(20\\d\\d|Present|Current)\\b", Pattern.CASE_INSENSITIVE);
        Matcher yearMatcher = yearRangePattern.matcher(text);
        int distinctPeriods = 0;
        while (yearMatcher.find()) {
            distinctPeriods++;
        }
        if (distinctPeriods > 0) {
            return Math.min(distinctPeriods * 2.0, 15.0);
        }

        return 2.0; // Default reasonable baseline if not explicitly detected
    }

    private String extractEducation(String text) {
        String lower = text.toLowerCase();
        if (lower.contains("ph.d") || lower.contains("phd") || lower.contains("doctor of philosophy")) {
            return "Ph.D. in Computer Science / Engineering";
        }
        if (lower.contains("master") || lower.contains("m.s.") || lower.contains("m.tech") || lower.contains("msc") || lower.contains("mca")) {
            return "Master's Degree (Computer Science / IT / Engineering)";
        }
        if (lower.contains("bachelor") || lower.contains("b.s.") || lower.contains("b.tech") || lower.contains("b.e.") || lower.contains("bsc") || lower.contains("bca")) {
            return "Bachelor of Technology / Computer Science";
        }
        if (lower.contains("diploma")) {
            return "Diploma in Computer Engineering / IT";
        }
        return "Bachelor's Degree in Computer Science or related field";
    }

    private String extractName(String text) {
        String[] lines = text.split("\\r?\\n");
        for (String line : lines) {
            String trimmed = line.trim();
            if (!trimmed.isEmpty() && trimmed.length() < 40 && !trimmed.contains("@") && !trimmed.contains("http") && !trimmed.contains("Resume")) {
                return trimmed;
            }
        }
        return "Candidate";
    }

    private String generateHeadline(List<String> skills, Double experience) {
        String level = experience != null && experience >= 5 ? "Senior " : (experience != null && experience >= 2 ? "Mid-level " : "");
        if (skills.contains("Java") || skills.contains("Spring Boot")) {
            return level + "Full Stack Java Developer";
        } else if (skills.contains("React") || skills.contains("JavaScript") || skills.contains("TypeScript")) {
            return level + "Frontend / Full Stack Engineer";
        } else if (skills.contains("Python") || skills.contains("Machine Learning")) {
            return level + "AI / Machine Learning Engineer";
        }
        return level + "Software Engineer";
    }

    private String extractSummary(String text) {
        String[] lines = text.split("\\r?\\n");
        StringBuilder sb = new StringBuilder();
        int count = 0;
        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.length() > 30 && count < 3) {
                sb.append(trimmed).append(" ");
                count++;
            }
        }
        return sb.length() > 0 ? sb.toString().trim() : "Passionate software professional with hands-on development expertise.";
    }
}
