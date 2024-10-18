package com.inf5190.chat.messages;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
   //Retourne tous les messages
   public List<Message> getMessages() {
      return messageRepository.getMessages(null);
   }

   @PostMapping(MESSAGES_PATH)
   public Message createMessage(@RequestBody Message newMessage) {
      return messageRepository.createMessage(newMessage);
   }
}
