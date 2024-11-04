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
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.DocumentSnapshot;

import java.util.concurrent.ExecutionException;
import com.inf5190.chat.messages.model.Message;
import com.inf5190.chat.websocket.WebSocketManager;


/**
 * Classe qui gère la persistence des messages.
 *
 */
@Repository
public class MessageRepository {

    private final Firestore firestore;
    private final List<Message> messages = new ArrayList<>();
    private final WebSocketManager webSocketManager;

    public MessageRepository(WebSocketManager webSocketManager){
        this.firestore = FirestoreClient.getFirestore();
        this.webSocketManager = webSocketManager;
    }

public List<Message> getMessages(String fromId) throws InterruptedException, ExecutionException {
    Query query = firestore.collection("messages")
        .orderBy("timestamp", Query.Direction.DESCENDING);

    if (fromId != null && !fromId.trim().isEmpty()) {
        DocumentSnapshot fromDoc = firestore.collection("messages")
            .document(fromId)
            .get()
            .get();
        if (fromDoc.exists()) {
            query = query.startAfter(fromDoc);
        }
    }

    query = query.limit(1000);
    List<Message> messages = new ArrayList<>();
    QuerySnapshot querySnapshot = query.get().get();
    
    for (DocumentSnapshot doc : querySnapshot.getDocuments()) {
        FirestoreMessage firestoreMessage = doc.toObject(FirestoreMessage.class);
        messages.add(new Message(
            doc.getId(),
            firestoreMessage.getText(),
            firestoreMessage.getUsername(),
            firestoreMessage.getTimestamp().getSeconds() * 1000
        ));
    }

    return messages;
}

    public Message createMessage(Message message, String authenticateUser) throws InterruptedException, ExecutionException {
        if (!authenticateUser.equals(message.username())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Mauvais Utilisateur");
        }

        FirestoreMessage firestoreMessage = new FirestoreMessage(
            message.username(),
            Timestamp.now(),
            message.text()
        );

        DocumentReference docRef = firestore.collection("messages").document();
        WriteResult writeRes = docRef.set(firestoreMessage).get();

        this.webSocketManager.notifySessions();

        return new Message(
            docRef.getId(),
            firestoreMessage.getText(),
            firestoreMessage.getUsername(),
            firestoreMessage.getTimestamp().getSeconds() * 1000
        );
    }
}
