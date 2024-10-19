package com.inf5190.chat.messages.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Repository;

import com.inf5190.chat.messages.model.Message;

/**
 * Classe qui gère la persistence des messages.
 *
 * En mémoire pour le moment.
 */
@Repository
public class MessageRepository {

    private final List<Message> messages = new ArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(-1);

    public List<Message> getMessages(Long fromId) {
        if (fromId == null) {
            return new ArrayList<>(messages);
        } else {
            return messages.stream()
                    .filter(message -> message.id() > fromId)
                    .toList();
        }
    }

    public Message createMessage(Message message) {
        // fonctions de la classe AtomicLong
        Long newId = idGenerator.incrementAndGet();
        Message newMessage = new Message(newId, message.text(), message.username(), message.timestamp());

        //ajout du nouveau message dans la List des messages
        messages.add(newMessage);
        return newMessage;
    }

}
