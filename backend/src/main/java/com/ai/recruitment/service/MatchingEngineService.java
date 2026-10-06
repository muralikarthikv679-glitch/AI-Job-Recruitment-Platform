package com.ai.recruitment.service;

import com.ai.recruitment.dto.MatchResultDto;
import com.ai.recruitment.entity.CandidateProfile;
import com.ai.recruitment.entity.JobPosting;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class MatchingEngineService {

    // Common English stop words
    private static final Set<String> STOP_WORDS = new HashSet<>(Arrays.asList(
            "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
            "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by",
            "can", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing",
            "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't",
            "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself",
            "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is",
            "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no",
            "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves",
            "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so",
            "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then",
            "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those",
            "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're",
            "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while",
            "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll",
            "you're", "you've", "your", "yours", "yourself", "yourselves"
    ));

    public MatchResultDto calculateMatch(CandidateProfile candidate, JobPosting job) {
        MatchResultDto result = new MatchResultDto();

        // 1. Skill Overlap Calculation
        List<String> jobSkills = job.getRequiredSkills() != null ? job.getRequiredSkills() : new ArrayList<>();
        List<String> candidateSkills = candidate.getSkills() != null ? candidate.getSkills() : new ArrayList<>();

        Set<String> normalizedJobSkills = jobSkills.stream()
                .map(String::toLowerCase)
                .map(String::trim)
                .collect(Collectors.toSet());

        Set<String> normalizedCandSkills = candidateSkills.stream()
                .map(String::toLowerCase)
                .map(String::trim)
                .collect(Collectors.toSet());

        List<String> matchedSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();

        for (String skill : jobSkills) {
            String norm = skill.toLowerCase().trim();
            if (normalizedCandSkills.contains(norm) || containsPartialSkill(norm, normalizedCandSkills)) {
                matchedSkills.add(skill);
            } else {
                missingSkills.add(skill);
            }
        }

        double skillScore = 0.0;
        if (!jobSkills.isEmpty()) {
            skillScore = ((double) matchedSkills.size() / jobSkills.size()) * 100.0;
        } else {
            skillScore = 100.0;
        }

        // 2. TF-IDF & Cosine Similarity of Text
        String candidateDoc = buildCandidateDocument(candidate);
        String jobDoc = buildJobDocument(job);

        double tfidfCosineScore = computeCosineSimilarity(candidateDoc, jobDoc) * 100.0;

        // 3. Experience Alignment Calculation
        double reqExp = job.getExperienceRequired() != null ? job.getExperienceRequired() : 0.0;
        double candExp = candidate.getExperienceYears() != null ? candidate.getExperienceYears() : 0.0;
        double expScore = 100.0;

        if (reqExp > 0) {
            if (candExp >= reqExp) {
                // Meets or exceeds requirements
                expScore = 100.0;
            } else {
                // Proportionally penalized
                expScore = Math.max(20.0, (candExp / reqExp) * 100.0);
            }
        }

        // 4. Composite Match Score Formula
        // Weights: 50% Skill Match, 30% Content TF-IDF Similarity, 20% Experience Match
        double overallScore = (skillScore * 0.50) + (tfidfCosineScore * 0.30) + (expScore * 0.20);
        overallScore = Math.min(100.0, Math.max(0.0, Math.round(overallScore * 10.0) / 10.0));

        // 5. Categorization and Qualitative Fit Explanation
        String fitCategory;
        if (overallScore >= 80.0) {
            fitCategory = "High Match";
        } else if (overallScore >= 55.0) {
            fitCategory = "Moderate Match";
        } else {
            fitCategory = "Low Match";
        }

        String explanation = generateQualitativeExplanation(candidate, job, overallScore, matchedSkills, missingSkills, candExp, reqExp);

        result.setOverallMatchScore(overallScore);
        result.setSkillMatchScore(Math.round(skillScore * 10.0) / 10.0);
        result.setTfidfSimilarityScore(Math.round(tfidfCosineScore * 10.0) / 10.0);
        result.setExperienceMatchScore(Math.round(expScore * 10.0) / 10.0);
        result.setMatchedSkills(matchedSkills);
        result.setMissingSkills(missingSkills);
        result.setQualitativeExplanation(explanation);
        result.setFitCategory(fitCategory);

        return result;
    }

    private static final Map<String, Set<String>> SKILL_SYNONYMS = new HashMap<>();

    static {
        addSynonyms("react", "react.js", "reactjs");
        addSynonyms("node", "node.js", "nodejs");
        addSynonyms("vue", "vue.js", "vuejs");
        addSynonyms("aws", "amazon web services");
        addSynonyms("gcp", "google cloud", "google cloud platform");
        addSynonyms("k8s", "kubernetes");
        addSynonyms("ml", "machine learning");
        addSynonyms("nlp", "natural language processing");
        addSynonyms("ai", "artificial intelligence");
        addSynonyms("golang", "go");
        addSynonyms("postgres", "postgresql");
        addSynonyms("js", "javascript");
        addSynonyms("ts", "typescript");
    }

    private static void addSynonyms(String... terms) {
        Set<String> syns = new HashSet<>(Arrays.asList(terms));
        for (String term : terms) {
            SKILL_SYNONYMS.put(term.toLowerCase(), syns);
        }
    }

    private boolean containsPartialSkill(String targetSkill, Set<String> candidateSkills) {
        String norm = targetSkill.toLowerCase().trim();
        if (SKILL_SYNONYMS.containsKey(norm)) {
            Set<String> syns = SKILL_SYNONYMS.get(norm);
            for (String cSkill : candidateSkills) {
                if (syns.contains(cSkill.toLowerCase().trim())) {
                    return true;
                }
            }
        }
        return false;
    }

    private String buildCandidateDocument(CandidateProfile c) {
        StringBuilder sb = new StringBuilder();
        if (c.getHeadline() != null) sb.append(c.getHeadline()).append(" ");
        if (c.getSummary() != null) sb.append(c.getSummary()).append(" ");
        if (c.getEducation() != null) sb.append(c.getEducation()).append(" ");
        if (c.getSkills() != null) sb.append(String.join(" ", c.getSkills())).append(" ");
        if (c.getRawResumeText() != null) sb.append(c.getRawResumeText());
        return sb.toString();
    }

    private String buildJobDocument(JobPosting j) {
        StringBuilder sb = new StringBuilder();
        if (j.getTitle() != null) sb.append(j.getTitle()).append(" ");
        if (j.getDepartment() != null) sb.append(j.getDepartment()).append(" ");
        if (j.getDescription() != null) sb.append(j.getDescription()).append(" ");
        if (j.getResponsibilities() != null) sb.append(j.getResponsibilities()).append(" ");
        if (j.getRequiredSkills() != null) sb.append(String.join(" ", j.getRequiredSkills()));
        return sb.toString();
    }

    /**
     * Compute Cosine Similarity between two text documents using Term Frequency (TF)
     * and Inverse Document Frequency (IDF) representations.
     */
    public double computeCosineSimilarity(String doc1, String doc2) {
        List<String> tokens1 = tokenize(doc1);
        List<String> tokens2 = tokenize(doc2);

        if (tokens1.isEmpty() || tokens2.isEmpty()) {
            return 0.0;
        }

        // Build Term Frequencies (TF)
        Map<String, Double> tf1 = computeTF(tokens1);
        Map<String, Double> tf2 = computeTF(tokens2);

        // Union vocabulary
        Set<String> vocabulary = new HashSet<>(tf1.keySet());
        vocabulary.addAll(tf2.keySet());

        // Compute IDF across our 2-document mini-corpus
        // IDF(term) = log(1 + (Total Documents / Documents containing term)) + 1
        Map<String, Double> idf = new HashMap<>();
        for (String term : vocabulary) {
            int count = 0;
            if (tf1.containsKey(term)) count++;
            if (tf2.containsKey(term)) count++;
            double val = Math.log(1.0 + (2.0 / count)) + 1.0;
            idf.put(term, val);
        }

        // Build TF-IDF vectors
        double dotProduct = 0.0;
        double norm1 = 0.0;
        double norm2 = 0.0;

        for (String term : vocabulary) {
            double v1 = tf1.getOrDefault(term, 0.0) * idf.get(term);
            double v2 = tf2.getOrDefault(term, 0.0) * idf.get(term);

            dotProduct += v1 * v2;
            norm1 += v1 * v1;
            norm2 += v2 * v2;
        }

        if (norm1 == 0.0 || norm2 == 0.0) {
            return 0.0;
        }

        return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    }

    private Map<String, Double> computeTF(List<String> tokens) {
        Map<String, Double> tf = new HashMap<>();
        for (String token : tokens) {
            tf.put(token, tf.getOrDefault(token, 0.0) + 1.0);
        }
        int totalTokens = tokens.size();
        for (Map.Entry<String, Double> entry : tf.entrySet()) {
            entry.setValue(entry.getValue() / totalTokens);
        }
        return tf;
    }

    private List<String> tokenize(String text) {
        if (text == null) return Collections.emptyList();
        String cleaned = text.toLowerCase().replaceAll("[^a-z0-9+#.]", " ");
        String[] words = cleaned.split("\\s+");
        List<String> tokens = new ArrayList<>();
        for (String w : words) {
            String trimmed = w.trim();
            if (trimmed.length() > 1 && !STOP_WORDS.contains(trimmed)) {
                tokens.add(trimmed);
            }
        }
        return tokens;
    }

    private String generateQualitativeExplanation(
            CandidateProfile candidate,
            JobPosting job,
            double overallScore,
            List<String> matched,
            List<String> missing,
            double candExp,
            double reqExp
    ) {
        StringBuilder sb = new StringBuilder();

        if (overallScore >= 80.0) {
            sb.append("🎯 **Exceptional Fit!** Candidate demonstrates strong alignment with role requirements. ");
        } else if (overallScore >= 55.0) {
            sb.append("⚖️ **Promising Candidate with Growth Areas.** Candidate meets primary foundational requirements. ");
        } else {
            sb.append("⚠️ **Potential Skill/Experience Gap.** Candidate profile differs notably from the primary target criteria. ");
        }

        // Skills commentary
        if (!matched.isEmpty()) {
            sb.append("Strong proficiency verified in key technologies: ").append(String.join(", ", matched)).append(". ");
        }
        if (!missing.isEmpty()) {
            sb.append("Recommended upskilling or supplementary evaluation required in: ").append(String.join(", ", missing)).append(". ");
        }

        // Experience commentary
        if (reqExp > 0) {
            if (candExp >= reqExp) {
                sb.append(String.format("Experience requirement satisfied (%.1f yrs vs %.1f yrs required). ", candExp, reqExp));
            } else {
                sb.append(String.format("Experience is below specified target (%.1f yrs vs %.1f yrs required). ", candExp, reqExp));
            }
        }

        return sb.toString().trim();
    }
}
