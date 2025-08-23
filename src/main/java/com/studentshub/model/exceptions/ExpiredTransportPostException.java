package com.studentshub.model.exceptions;

public class ExpiredTransportPostException extends RuntimeException {
    public ExpiredTransportPostException(Long postId) {
        super("Transport post with id " + postId + " is expired and no longer available.");
    }
}

