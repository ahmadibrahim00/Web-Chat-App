package com.inf5190.chat.messages.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

import com.google.cloud.Timestamp;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;
import com.inf5190.chat.messages.model.Message;
import com.inf5190.chat.messages.repository.FirestoreMessage;
import org.springframework.stereotype.Repository;

import java.util.concurrent.ExecutionException;
import com.inf5190.chat.messages.model.Message;

/**
 * Classe qui gère la persistence des messages.
 *
 * En mémoire pour le moment.
 */
@Repository
public class MessageRepository {

    private final Firestore firestore;
    private final List<Message> messages = new ArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(-1);

    public MessageRepository(){
        this.firestore = FirestoreClient.getFirestore();
    }

    public List<Message> getMessages(Long fromId) {
        if (fromId == null) {
            return new ArrayList<>(messages);
        } else {
            return messages.stream()
                    .filter(message -> message.id() > fromId)
                    .toList();
        }
    }

    public Message createMessage(Message message) throws InterruptedException, ExecutionException{
        // référence vers la collection messages dans firestore
        CollectionReference collectionMessage = firestore.collection("messages");
        FirestoreMessage firestoreMessage = new FirestoreMessage(
            messages.username(),
            Timestamp.now(),
            message.text()
        );

        DocumentReference docRef = messagesCollection.document();
        WriteResult writeResult = docRef.set(firestoreMessage).get();

        return new Message(
            docRef.getId(),
            firestoreMessage.text(),
            firestoreMessage.username(),
            firestoreMessage.timestamp()
        );
    }

}
