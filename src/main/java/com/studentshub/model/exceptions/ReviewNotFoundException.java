package com.studentshub.model.exceptions;

public class ReviewNotFoundException extends RuntimeException {
    public ReviewNotFoundException(Long reviewId) {
        super("Review with id " + reviewId + " not found.");
    }
}
