package com.minimart.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response returned after a successful login/register.
 * No JWT is used - frontend stores this info in localStorage to track the logged-in user.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private Long userId;
    private String name;
    private String email;
    private String role;
    private String message;
}
