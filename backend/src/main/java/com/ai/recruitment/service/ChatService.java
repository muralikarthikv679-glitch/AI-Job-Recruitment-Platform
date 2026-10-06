package com.ai.recruitment.service;

import com.ai.recruitment.dto.ChatMessageDto;
import com.ai.recruitment.entity.ChatMessage;
import com.ai.recruitment.entity.JobPosting;
import com.ai.recruitment.entity.User;
import com.ai.recruitment.repository.ChatMessageRepository;
import com.ai.recruitment.repository.JobPostingRepository;
import com.ai.recruitment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobPostingRepository jobPostingRepository;

    @Autowired(required = false)
    private SimpMessagingTemplate messagingTemplate;

    @Transactional
    public ChatMessageDto sendMessage(String senderEmail, ChatMessageDto dto) {
        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new IllegalArgumentException("Sender not found: " + senderEmail));

        User recipient = userRepository.findById(dto.getRecipientId())
                .orElseThrow(() -> new IllegalArgumentException("Recipient not found with id: " + dto.getRecipientId()));

        JobPosting job = null;
        if (dto.getJobId() != null) {
            job = jobPostingRepository.findById(dto.getJobId()).orElse(null);
        }

        ChatMessage message = new ChatMessage(sender, recipient, job, dto.getContent());
        message.setTimestamp(LocalDateTime.now());
        message.setRead(false);

        ChatMessage saved = chatMessageRepository.save(message);
        ChatMessageDto resultDto = mapToDto(saved);

        if (messagingTemplate != null) {
            try {
                // Send to recipient
                messagingTemplate.convertAndSendToUser(
                        recipient.getEmail(),
                        "/queue/messages",
                        resultDto
                );
            } catch (Exception ignored) {}
        }

        return resultDto;
    }

    public List<ChatMessageDto> getConversation(String currentUserEmail, Long otherUserId, Long jobId) {
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + currentUserEmail));

        List<ChatMessage> messages;
        if (jobId != null) {
            messages = chatMessageRepository.findConversationForJob(currentUser.getId(), otherUserId, jobId);
        } else {
            messages = chatMessageRepository.findConversationBetweenUsers(currentUser.getId(), otherUserId);
        }

        return messages.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public ChatMessageDto mapToDto(ChatMessage m) {
        ChatMessageDto dto = new ChatMessageDto();
        dto.setId(m.getId());
        dto.setSenderId(m.getSender().getId());
        dto.setSenderName(m.getSender().getName());
        dto.setRecipientId(m.getRecipient().getId());
        dto.setRecipientName(m.getRecipient().getName());
        if (m.getJob() != null) {
            dto.setJobId(m.getJob().getId());
            dto.setJobTitle(m.getJob().getTitle());
        }
        dto.setContent(m.getContent());
        dto.setRead(m.isRead());
        dto.setTimestamp(m.getTimestamp());
        return dto;
    }
}
