package com.university.universe.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Application configuration properties
 * Maps custom properties from application.properties
 */
@Component
@ConfigurationProperties(prefix = "app")
public class ApplicationProperties {
    private String frontendUrl;

    public String getFrontendUrl() {
        return frontendUrl;
    }

    public void setFrontendUrl(String frontendUrl) {
        this.frontendUrl = frontendUrl;
    }
}
