package com.inf5190.chat.messages.repository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Repository;

import com.google.cloud.Timestamp;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.storage.Bucket;
import com.google.cloud.storage.Bucket.BlobTargetOption;
import com.google.cloud.storage.Storage.PredefinedAcl;
import com.google.firebase.cloud.FirestoreClient;
import com.google.firebase.cloud.StorageClient;
import com.inf5190.chat.messages.model.Message;
import com.inf5190.chat.messages.model.NewMessageRequest;

import io.jsonwebtoken.io.Decoders;

/**
 * Classe qui gère la persistence des messages.
 *
 * En mémoire pour le moment.
 */
@Repository
public class MessageRepository {

    private static final String COLLECTION_NAME = "messages";
    private static final String BUCKET_NAME = "inf5190-chat-5893c.appspot.com"; //mettre son bucket name
    private static final int DEFAULT_LIMIT = 20;

    private final Firestore firestore = FirestoreClient.getFirestore();

    public List<Message> getMessages(String fromId) throws InterruptedException, ExecutionException {
        Query query;
        if (fromId == null || fromId.isEmpty()) {
            // Si fromId est null, on récupère les 20 derniers messages en ordre décroissant
            query = firestore.collection("messages")
                    .orderBy("timestamp", Query.Direction.DESCENDING)
                    .limit(DEFAULT_LIMIT);
        } else {
            // Si fromId est spécifié, on commence après ce message en ordre croissant
            DocumentSnapshot fromDoc = firestore.collection("messages")
                    .document(fromId)
                    .get()
                    .get();

            if (fromDoc.exists()) {
                query = firestore.collection("messages")
                        .orderBy("timestamp", Query.Direction.ASCENDING)
                        .startAfter(fromDoc)
                        .limit(20);
            } else {
                throw new IllegalArgumentException("Le message avec l'id " + fromId + " n'a pas été trouvé.");
            }
        }

        List<Message> messages = new ArrayList<>();
        QuerySnapshot querySnapshot = query.get().get();

        for (DocumentSnapshot doc : querySnapshot.getDocuments()) {
            FirestoreMessage firestoreMessage = doc.toObject(FirestoreMessage.class);
            messages.add(new Message(
                    doc.getId(),
                    firestoreMessage.getUsername(),
                    firestoreMessage.getTimestamp().getSeconds() * 1000,
                    firestoreMessage.getText(),
                    firestoreMessage.getImageUrl()
            ));
        }
        if (fromId == null || fromId.isEmpty()) {
            // On inverse les messages pour avoir les plus anciens en haut
            Collections.reverse(messages);
        }

        return messages;
    }

    public Message createMessage(NewMessageRequest message)
            throws InterruptedException, ExecutionException {
        DocumentReference ref = this.firestore.collection(COLLECTION_NAME).document();

        String imageUrl = null;
        if (message.imageData() != null) {
            Bucket b = StorageClient.getInstance().bucket(BUCKET_NAME);
            String path = String.format("images/%s.%s", ref.getId(), message.imageData().type());
            b.create(path, Decoders.BASE64.decode(message.imageData().data()),
                    BlobTargetOption.predefinedAcl(PredefinedAcl.PUBLIC_READ));
            imageUrl = String.format("https://storage.googleapis.com/%s/%s", BUCKET_NAME, path);
        }

        FirestoreMessage firestoreMessage
                = new FirestoreMessage(message.username(), Timestamp.now(), message.text(), imageUrl);

        ref.create(firestoreMessage).get();
        return this.toMessage(ref.getId(), firestoreMessage);
    }

    private Message toMessage(String id, FirestoreMessage firestoreMessage) {
        return new Message(id, firestoreMessage.getUsername(),
                firestoreMessage.getTimestamp().toDate().getTime(), firestoreMessage.getText(),
                firestoreMessage.getImageUrl());
    }
}
