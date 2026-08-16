package com.minimart.exception;

/**
 * Thrown for invalid input, such as wrong login credentials or duplicate email at registration.
 */
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}
