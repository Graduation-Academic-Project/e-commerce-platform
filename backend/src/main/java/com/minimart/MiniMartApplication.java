package com.minimart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the MiniMart Spring Boot application.
 * Run this class (or use "mvn spring-boot:run") to start the backend server.
 */
@SpringBootApplication
public class MiniMartApplication {

    public static void main(String[] args) {
        SpringApplication.run(MiniMartApplication.class, args);
        System.out.println("=================================================");
        System.out.println(" MiniMart Backend started successfully!");
        System.out.println(" API Base URL: http://localhost:8080/api");
        System.out.println("=================================================");
    }
}
