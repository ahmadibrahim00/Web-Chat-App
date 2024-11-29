package com.inf5190.chat.auth.repository;

import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Repository;

import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;

@Repository
public class UserAccountRepository {

    private static final String COLLECTION_NAME = "userAccounts";
    private final Firestore firestore;

    public UserAccountRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    public FirestoreUserAccount getUserAccount(String username) throws InterruptedException, ExecutionException {
        DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(username);
        DocumentSnapshot documentSnapshot = docRef.get().get();

        if (!documentSnapshot.exists()) {
            return null;
        }
        return documentSnapshot.toObject(FirestoreUserAccount.class);
    }

    public void createUserAccount(FirestoreUserAccount userAccount) throws InterruptedException, ExecutionException {
        DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(userAccount.getUsername());
        docRef.set(userAccount).get();
    }
}
