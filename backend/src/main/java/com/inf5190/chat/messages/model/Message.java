package com.inf5190.chat.messages.model;
import com.google.cloud.Timestamp;

/**
 * Représente un message
 */
public record Message(String id, String text, String username, Long timestamp) {
}
