package com.inf5190.chat.auth.repository;

import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Repository;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.WriteResult;

@Repository
public class UserAccountRepository {

    private static final String COLLECTION_NAME = "userAccounts";
    private final Firestore firestore = FirestoreClient.getFirestore();

    public FirestoreUserAccount getUserAccount(String username) throws
            InterruptedException, ExecutionException {
        throw new UnsupportedOperationException("A faire");
    }

    public void createUserAccount(FirestoreUserAccount userAccount) throws
            InterruptedException, ExecutionException {
               DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(userAccount.getUsername());
               WriteResult result = docRef.set(userAccount).get();
               System.out.println("Compte crée avec succès");
    }
}
