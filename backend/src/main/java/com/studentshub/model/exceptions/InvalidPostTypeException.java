package com.studentshub.model.exceptions;

public class InvalidPostTypeException extends RuntimeException {
    public InvalidPostTypeException(String message) {
        super(message);
    }
}

