package com.inf5190.chat.messages.repository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ExecutionException;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;
import org.springframework.web.server.ResponseStatusException;

import com.google.cloud.Timestamp;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;
import com.inf5190.chat.messages.model.Message;

/**
 * Classe qui gère la persistence des messages.
 *
 */
@Repository
public class MessageRepository {

    private final Firestore firestore;

    public MessageRepository() {
        this.firestore = FirestoreClient.getFirestore();
    }

    public List<Message> getMessages(String fromId) throws InterruptedException, ExecutionException {
        // Commencer par une requête qui ordonne les messages par timestamp de manière croissante ou décroissante
        Query query;

        if (fromId == null || fromId.isEmpty()) {
            // Si fromId est null, on récupère les 20 derniers messages en ordre décroissant
            query = firestore.collection("messages")
                    .orderBy("timestamp", Query.Direction.DESCENDING)
                    .limit(20);
        } else {
            // Si fromId est spécifié, on commence après ce message en ordre croissant
            DocumentSnapshot fromDoc = firestore.collection("messages")
                    .document(fromId)
                    .get()
                    .get();

            if (fromDoc.exists()) {
                // Commence après le message trouvé avec fromId
                query = firestore.collection("messages")
                        .orderBy("timestamp", Query.Direction.ASCENDING)
                        .startAfter(fromDoc)
                        .limit(20);
            } else {
                // Si fromId n'est pas trouvé, on peut gérer cela comme une erreur ou un retour vide
                throw new IllegalArgumentException("Le message avec l'id " + fromId + " n'a pas été trouvé.");
            }
        }

        // Exécution de la requête et récupération des résultats
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

        // Si on est dans le cas de la première récupération (fromId == null), les messages sont déjà triés du plus récent au plus ancien
        if (fromId == null || fromId.isEmpty()) {
            // On inverse les messages pour avoir les plus anciens en haut
            Collections.reverse(messages);
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
        docRef.set(firestoreMessage).get();

        return new Message(
                docRef.getId(),
                firestoreMessage.getText(),
                firestoreMessage.getUsername(),
                firestoreMessage.getTimestamp().getSeconds() * 1000
        );
    }
}
