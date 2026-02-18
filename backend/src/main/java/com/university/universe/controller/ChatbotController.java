package com.university.universe.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "*")
public class ChatbotController {
    
    @PostMapping("/chat")
    public ChatResponse chat(@RequestBody ChatRequest request) {
        String userMessage = request.getMessage();
        String response = generateResponse(userMessage);
        return new ChatResponse(response);
    }
    
    private String generateResponse(String message) {
        String lower = message.toLowerCase();
        
        // Greeting responses
        if (lower.contains("hello") || lower.contains("hi") || lower.contains("hey")) {
            return "Hello! Welcome to UniVerse. I'm here to help you explore clubs, events, and more at our university. What can I help you with?";
        }
        
        // Course/Program queries
        if (lower.contains("course") || lower.contains("program") || lower.contains("study")) {
            return "We have many educational programs available! Visit our Clubs page to explore different academic and interest-based clubs that align with your field of study.";
        }
        
        // Fee/Membership queries
        if (lower.contains("fee") || lower.contains("price") || lower.contains("cost") || lower.contains("membership")) {
            return "Club membership fees vary by club. You can check the specific fee for each club on our Clubs page when you click on a club you're interested in.";
        }
        
        // Event queries
        if (lower.contains("event") || lower.contains("happening") || lower.contains("schedule")) {
            return "We have exciting events happening regularly! Check out our Events page to see all upcoming events, dates, and detailed information. You won't miss out!";
        }
        
        // Club queries
        if (lower.contains("club") || lower.contains("join") || lower.contains("activity")) {
            return "UniVerse has a diverse range of clubs covering academics, sports, arts, culture, and more! Visit our Clubs page to browse and join clubs that match your interests.";
        }
        
        // How to use
        if (lower.contains("how") || lower.contains("help") || lower.contains("what can you")) {
            return "I can help you with questions about clubs, events, memberships, and how to get involved. You can also explore our Clubs and Events pages directly. What would you like to know?";
        }
        
        // Contact queries
        if (lower.contains("contact") || lower.contains("support") || lower.contains("email")) {
            return "For detailed support, please visit our Contact page. Our team is ready to assist you with any questions!";
        }
        
        // About queries
        if (lower.contains("about") || lower.contains("what is") || lower.contains("universe")) {
            return "UniVerse is your university's comprehensive club and event management platform. Connect with thousands of students, discover clubs, attend events, and build lasting friendships!";
        }
        
        // Thank you/Goodbye
        if (lower.contains("thanks") || lower.contains("thank you") || lower.contains("goodbye") || lower.contains("bye")) {
            return "You're welcome! Feel free to explore our platform anytime. Have a great day!";
        }
        
        // Default response
        return "That's a great question! I didn't quite catch that. You can ask me about clubs, events, memberships, or how to get involved. Or visit our main pages to explore more!";
    }
}

class ChatRequest {
    private String message;
    
    public ChatRequest() {}
    public ChatRequest(String message) { this.message = message; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}

class ChatResponse {
    private String response;
    
    public ChatResponse(String response) { this.response = response; }
    public String getResponse() { return response; }
    public void setResponse(String response) { this.response = response; }
}
