package com.studentshub.model.exceptions;

public class MessageNotFoundException extends RuntimeException {
    public MessageNotFoundException(Long messageId) {
        super("Message with id " + messageId + " not found.");
    }
}
