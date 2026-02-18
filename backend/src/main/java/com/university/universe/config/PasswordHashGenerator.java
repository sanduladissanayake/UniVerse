package com.university.universe.config;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Utility class to generate BCrypt hashes for passwords
 * Run main() method to generate hashes for any password
 */
public class PasswordHashGenerator {
    
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // Generate hashes for common passwords
        String password1 = "admin123";
        String password2 = "password123";
        String password3 = "admin@123";
        
        System.out.println("=== BCrypt Password Hashes ===");
        System.out.println("\nPassword: " + password1);
        System.out.println("Hash: " + encoder.encode(password1));
        
        System.out.println("\nPassword: " + password2);
        System.out.println("Hash: " + encoder.encode(password2));
        
        System.out.println("\nPassword: " + password3);
        System.out.println("Hash: " + encoder.encode(password3));
        
        System.out.println("\n=== For manual testing ===");
        System.out.println("Copy the hash and use it in your schema.sql");
    }
}
