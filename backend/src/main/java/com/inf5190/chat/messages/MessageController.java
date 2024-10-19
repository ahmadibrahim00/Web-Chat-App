package com.inf5190.chat.messages;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.inf5190.chat.messages.model.Message;
import com.inf5190.chat.messages.repository.MessageRepository;
import com.inf5190.chat.websocket.WebSocketManager;

/**
 * Contrôleur qui gère l'API de messages.
 */
@RestController
public class MessageController {

    public static final String MESSAGES_PATH = "/messages";

    private final MessageRepository messageRepository;
    private final WebSocketManager webSocketManager;

    public MessageController(MessageRepository messageRepository,
            WebSocketManager webSocketManager) {
        this.messageRepository = messageRepository;
        this.webSocketManager = webSocketManager;
    }

    @GetMapping(MESSAGES_PATH)
    public ResponseEntity<List<Message>> getMessages(@RequestParam Long id) {
        return ResponseEntity.ok().body(messageRepository.getMessages(id));
    }

    @PostMapping(MESSAGES_PATH)
    public ResponseEntity<String> createMessage(@RequestBody Message newMessage) {
        Message message = messageRepository.createMessage(newMessage);
        if (message != null) {
            webSocketManager.notifySessions();
            return ResponseEntity.status(HttpStatus.CREATED).build();
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}
