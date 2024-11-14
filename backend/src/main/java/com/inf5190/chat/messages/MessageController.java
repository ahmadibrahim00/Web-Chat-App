package com.inf5190.chat.messages;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.inf5190.chat.auth.AuthController;
import com.inf5190.chat.auth.session.SessionData;
import com.inf5190.chat.auth.session.SessionManager;
import com.inf5190.chat.messages.model.Message;
import com.inf5190.chat.messages.model.NewMessageRequest;
import com.inf5190.chat.messages.repository.MessageRepository;
import com.inf5190.chat.websocket.WebSocketManager;

/**
 * Contrôleur qui gère l'API de messages.
 */
@RestController
public class MessageController {

    public static final String MESSAGES_PATH = "/messages";
    private static final Logger LOGGER = LoggerFactory.getLogger(MessageController.class);

    private final MessageRepository messageRepository;
    private final WebSocketManager webSocketManager;
    private final SessionManager sessionManager;

    public MessageController(MessageRepository messageRepository,
            WebSocketManager webSocketManager, SessionManager sessionManager) {
        this.messageRepository = messageRepository;
        this.webSocketManager = webSocketManager;
        this.sessionManager = sessionManager;
    }

    @GetMapping(MESSAGES_PATH)
    public ResponseEntity<List<Message>> getMessages(@RequestParam Optional<String> fromId)
            throws InterruptedException, ExecutionException {
        try {
            return ResponseEntity.ok().body(messageRepository.getMessages(fromId.orElse(null)));
        } catch (ResponseStatusException e) {
            throw e;
        } catch (InterruptedException | ExecutionException e) {
            LOGGER.warn("Unexpected error during logout.", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected error on logout");
        }
    }

    @PostMapping(MESSAGES_PATH)
    public Message createMessage(
            @CookieValue(AuthController.SESSION_ID_COOKIE_NAME) String sessionCookie,
            @RequestBody NewMessageRequest message)
            throws InterruptedException, ExecutionException {

        if (sessionCookie == null || sessionCookie.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        SessionData sessionData = this.sessionManager.getSession(sessionCookie);
        if (sessionData == null || !sessionData.username().equals(message.username())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        try {
            Message newMessage = this.messageRepository.createMessage(message);
            this.webSocketManager.notifySessions();
            return newMessage;
        } catch (ResponseStatusException e) {
            throw e;
        } catch (InterruptedException | ExecutionException e) {
            LOGGER.warn("Unexpected error during logout.", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected error on logout");
        }
    }
}
