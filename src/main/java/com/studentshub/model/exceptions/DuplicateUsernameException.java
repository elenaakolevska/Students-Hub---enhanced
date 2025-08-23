package com.studentshub.model.exceptions;

public class DuplicateUsernameException extends RuntimeException {
    public DuplicateUsernameException(String username) {
        super("Username '" + username + "' already exists.");
    }
}

