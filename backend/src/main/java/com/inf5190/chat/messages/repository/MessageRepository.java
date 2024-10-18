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
    private final AtomicLong idGenerator = new AtomicLong(0);

    public List<Message> getMessages(Long fromId) {
      // si id est null, on retourne les messages déjà loader
      if (fromId == null) {
         return new ArrayList<>(messages);
      }
      
      List<Message> filtreMessage = new ArrayList<>();
       for (Message message : messages) {
         // on vas récupérer les nouveaux message, donc ceux suivant le id
         if (message.id() > fromId) {  
            filtreMessage.add(message);
         }
       }
      return filtreMessage;
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
