package com.inf5190.chat.messages.model;

/**
 * Représente un message
 */
public record Message(Long id, String text, String username, Long timestamp) {
}
