package com.university.universe;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class UniverseApplication {

    public static void main(String[] args) {
        // Load environment variables from .env file if it exists
        loadEnvFile();
        
        SpringApplication.run(UniverseApplication.class, args);
        System.out.println("UniVerse Backend is running on http://localhost:8081");
    }
    
    /**
     * Load environment variables from .env file in the current working directory
     */
    private static void loadEnvFile() {
        try {
            String envPath = ".env";
            File envFile = new File(envPath);
            
            if (envFile.exists()) {
                Files.lines(Paths.get(envPath))
                    .filter(line -> !line.trim().isEmpty() && !line.trim().startsWith("#"))
                    .forEach(line -> {
                        String[] parts = line.split("=", 2);
                        if (parts.length == 2) {
                            String key = parts[0].trim();
                            String value = parts[1].trim();
                            System.setProperty(key, value);
                            
                            // Log sensitive keys partially
                            if (key.equals("STRIPE_API_KEY") || key.equals("STRIPE_WEBHOOK_SECRET")) {
                                String masked = value.length() > 20 ? 
                                    value.substring(0, 10) + "..." + value.substring(value.length() - 10) : 
                                    "***";
                                System.out.println("✓ Loaded " + key + " from .env file");
                            }
                        }
                    });
            } else {
                System.out.println("⚠ .env file not found - ensure environment variables are set");
            }
        } catch (Exception e) {
            System.err.println("⚠ Could not load .env file: " + e.getMessage());
        }
    }
}
