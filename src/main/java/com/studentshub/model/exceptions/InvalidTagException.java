package com.studentshub.model.exceptions;

public class InvalidTagException extends RuntimeException {
    public InvalidTagException(String tagName) {
        super("Tag '" + tagName + "' is invalid or does not exist.");
    }
}

