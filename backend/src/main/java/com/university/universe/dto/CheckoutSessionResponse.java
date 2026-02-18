package com.university.universe.dto;

/**
 * DTO for checkout session response
 */
public class CheckoutSessionResponse {
    private String sessionId;
    private String sessionUrl;
    private String clientSecret;
    private Long paymentId;
    private String message;

    // Default constructor
    public CheckoutSessionResponse() {
    }

    // Constructor with parameters
    public CheckoutSessionResponse(String sessionId, String sessionUrl, String clientSecret, Long paymentId) {
        this.sessionId = sessionId;
        this.sessionUrl = sessionUrl;
        this.clientSecret = clientSecret;
        this.paymentId = paymentId;
    }

    // Getters and Setters
    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getSessionUrl() {
        return sessionUrl;
    }

    public void setSessionUrl(String sessionUrl) {
        this.sessionUrl = sessionUrl;
    }

    public String getClientSecret() {
        return clientSecret;
    }

    public void setClientSecret(String clientSecret) {
        this.clientSecret = clientSecret;
    }

    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
