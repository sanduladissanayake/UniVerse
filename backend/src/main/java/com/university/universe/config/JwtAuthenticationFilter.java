package com.university.universe.config;

import com.university.universe.service.JwtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.lang.NonNull;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;

/**
 * JWT Authentication Filter
 * Validates JWT tokens from the Authorization header and sets up Spring
 * Security context
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtService jwtService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        try {
            // Get the Authorization header
            String authHeader = request.getHeader("Authorization");

            // If no auth header, continue to the next filter
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                logger.debug("No JWT token found in request: {}", request.getRequestURI());
                filterChain.doFilter(request, response);
                return;
            }

            // Extract JWT token
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            logger.debug("JWT token found for request: {}", request.getRequestURI());

            try {
                // Extract claims from token
                String email = jwtService.extractEmail(token);
                Long userId = jwtService.extractUserId(token);
                String role = jwtService.extractRole(token);

                logger.debug("JWT validated for user: {} (ID: {})", email, userId);

                // Create authorities from role
                Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
                if (role != null && !role.isEmpty()) {
                    authorities.add(new SimpleGrantedAuthority("ROLE_" + role));
                }
                authorities.add(new SimpleGrantedAuthority("ROLE_USER")); // Default role

                // Create authentication token
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                        email,
                        null,
                        authorities);
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Set authentication in SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                logger.debug("SecurityContext set for user: {} with roles: {}", email, authorities);

            } catch (Exception e) {
                logger.warn("JWT validation failed: {}", e.getMessage());
                SecurityContextHolder.clearContext();
            }

        } catch (Exception e) {
            logger.error("Error in JWT authentication filter: {}", e.getMessage(), e);
        }

        filterChain.doFilter(request, response);
    }
}
