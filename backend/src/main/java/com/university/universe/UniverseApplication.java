package com.university.universe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class UniverseApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(UniverseApplication.class, args);
        System.out.println("UniVerse Backend is running on http://localhost:8080");
    }
}
