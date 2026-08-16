package com.minimart.exception;

/**
 * Thrown when a requested resource (user, product, cart item, order, etc.) is not found.
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
