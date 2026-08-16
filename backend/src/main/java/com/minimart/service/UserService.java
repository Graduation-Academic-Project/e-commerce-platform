package com.minimart.service;

import com.minimart.dto.AuthResponse;
import com.minimart.dto.LoginRequest;
import com.minimart.dto.RegisterRequest;
import com.minimart.entity.Role;
import com.minimart.entity.User;
import com.minimart.exception.BadRequestException;
import com.minimart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Handles user registration and login business logic.
 * NOTE: For simplicity (as per project requirements) this stores passwords
 * in plain text and does NOT implement JWT authentication.
 * In a real production app, passwords must always be hashed (e.g. with BCrypt).
 */
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        // Default role is USER unless explicitly set to ADMIN
        if (request.getRole() != null && request.getRole().equalsIgnoreCase("ADMIN")) {
            user.setRole(Role.ADMIN);
        } else {
            user.setRole(Role.USER);
        }

        User saved = userRepository.save(user);

        return new AuthResponse(saved.getId(), saved.getName(), saved.getEmail(),
                saved.getRole().name(), "Registration successful");
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        return new AuthResponse(user.getId(), user.getName(), user.getEmail(),
                user.getRole().name(), "Login successful");
    }
}
