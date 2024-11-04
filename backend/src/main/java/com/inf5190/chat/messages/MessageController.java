package com.inf5190.chat.messages;

import java.util.List;
import java.util.concurrent.ExecutionException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CookieValue;

import com.inf5190.chat.messages.model.Message;
import com.inf5190.chat.messages.repository.MessageRepository;
import com.inf5190.chat.websocket.WebSocketManager;
import com.inf5190.chat.auth.session.SessionData;
import com.inf5190.chat.auth.session.SessionManager;
import com.inf5190.chat.auth.AuthController;

/**
 * Contrôleur qui gère l'API de messages.
 */
@RestController
public class MessageController {

    public static final String MESSAGES_PATH = "/messages";

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
    public ResponseEntity<List<Message>> getMessages(@RequestParam(required = false) String id) 
        throws InterruptedException, ExecutionException {
        return ResponseEntity.ok().body(messageRepository.getMessages(id));
    }


    @PostMapping(MESSAGES_PATH)
    public Message createMessage(@RequestBody Message newMessage, @CookieValue(AuthController.SESSION_ID_COOKIE_NAME) String sessionId) throws InterruptedException, ExecutionException {
    SessionData sessionData = this.sessionManager.getSession(sessionId);
    return this.messageRepository.createMessage(newMessage, sessionData.username());
    }
}
