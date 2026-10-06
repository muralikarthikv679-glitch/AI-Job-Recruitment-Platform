package com.ai.recruitment.controller;

import com.ai.recruitment.dto.ChatMessageDto;
import com.ai.recruitment.service.ChatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@Tag(name = "Chat", description = "Real-time communication between recruiters and candidates")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping("/send")
    @Operation(summary = "Send a chat message (REST endpoint)")
    public ResponseEntity<ChatMessageDto> sendMessage(
            Authentication auth,
            @RequestBody ChatMessageDto messageDto) {
        ChatMessageDto result = chatService.sendMessage(auth.getName(), messageDto);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/conversation/{userId}")
    @Operation(summary = "Get conversation history with another user")
    public ResponseEntity<List<ChatMessageDto>> getConversation(
            Authentication auth,
            @PathVariable Long userId,
            @RequestParam(required = false) Long jobId) {
        List<ChatMessageDto> list = chatService.getConversation(auth.getName(), userId, jobId);
        return ResponseEntity.ok(list);
    }

    @MessageMapping("/chat.send")
    public void processMessageFromWebSocket(@Payload ChatMessageDto chatMessage, Principal principal) {
        if (principal != null) {
            chatService.sendMessage(principal.getName(), chatMessage);
        }
    }
}
