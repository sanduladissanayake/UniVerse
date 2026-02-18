package com.university.universe.controller;

import com.stripe.exception.StripeException;
import com.university.universe.dto.CheckoutSessionRequest;
import com.university.universe.dto.CheckoutSessionResponse;
import com.university.universe.model.Payment;
import com.university.universe.service.PaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.Map;

/**
 * Payment Controller
 * Handles payment-related endpoints including checkout session creation and
 * webhook handling
 */
@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    @Autowired
    private PaymentService paymentService;

    /**
     * Create a Stripe checkout session
     * POST /api/payments/create-checkout-session
     * 
     * Request body:
     * {
     * "userId": 1,
     * "clubId": 1,
     * "amount": 5.00,
     * "currency": "LKR",
     * "successUrl": "/payment-success",
     * "cancelUrl": "/payment-cancel"
     * }
     * 
     * Response:
     * {
     * "sessionId": "cs_test_...",
     * "sessionUrl": "https://checkout.stripe.com/...",
     * "paymentId": 1,
     * "message": "Checkout session created successfully"
     * }
     */
    @PostMapping("/create-checkout-session")
    public ResponseEntity<?> createCheckoutSession(@Valid @RequestBody CheckoutSessionRequest request) {
        try {
            logger.info("🔵 Received payment request: {}", request.toString());
            logger.info("Creating checkout session for user: {} club: {}", request.getUserId(), request.getClubId());

            CheckoutSessionResponse response = paymentService.createCheckoutSession(request);

            return ResponseEntity.ok(response);

        } catch (com.stripe.exception.InvalidRequestException e) {
            logger.error("Stripe Invalid Request - {}: {}", e.getCode(), e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Invalid request to Stripe: " + e.getMessage());
            errorResponse.put("stripeError", e.getCode());
            errorResponse.put("stripeParam", e.getParam());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);

        } catch (com.stripe.exception.AuthenticationException e) {
            logger.error("Stripe Authentication Error - API key issue: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Stripe authentication failed. Please check your API key configuration.");
            errorResponse.put("stripeError", "authentication_error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);

        } catch (com.stripe.exception.CardException e) {
            logger.error("Stripe Card Error: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Card error: " + e.getMessage());
            errorResponse.put("stripeError", e.getCode());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);

        } catch (com.stripe.exception.StripeException e) {
            // Handles all StripeException subclasses including RateLimitException
            logger.error("Stripe Exception - Status: {} Message: {}", e.getStatusCode(), e.getMessage());

            // Special handling for rate limit
            if (e instanceof com.stripe.exception.RateLimitException) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Too many requests to Stripe. Please try again in a few moments.");
                return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(errorResponse);
            }

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Stripe error: " + e.getMessage());
            errorResponse.put("stripeStatusCode", e.getStatusCode());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);

        } catch (IllegalArgumentException e) {
            logger.warn("Invalid request: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);

        } catch (Exception e) {
            logger.error("Unexpected error creating checkout session: {}", e.getMessage(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "An error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Handle Stripe webhook events
     * POST /api/payments/webhook
     * 
     * This endpoint receives webhook events from Stripe
     * Events handled:
     * - checkout.session.completed
     * - payment_intent.succeeded
     * - payment_intent.payment_failed
     * - charge.refunded
     */
    @PostMapping("/webhook")
    public ResponseEntity<?> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {

        try {
            logger.info("Received webhook event from Stripe");

            Map<String, Object> response = paymentService.handleWebhookEvent(payload, sigHeader);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Webhook processing error: {}", e.getMessage(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Webhook processing failed");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    /**
     * Get payment details by payment ID
     * GET /api/payments/{paymentId}
     */
    @GetMapping("/{paymentId}")
    public ResponseEntity<?> getPayment(@PathVariable Long paymentId) {
        try {
            Payment payment = paymentService.getPaymentById(paymentId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("payment", payment);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error fetching payment: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    /**
     * Get payment details by Stripe session ID
     * GET /api/payments/session/{sessionId}
     * 
     * This endpoint is called from the success page to fetch the current payment
     * status.
     * Returns the full payment object including status, amount, currency, dates,
     * etc.
     */
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<?> getPaymentBySession(@PathVariable String sessionId) {
        try {
            logger.info("═══════════════════════════════════════════════");
            logger.info("🔵 GET PAYMENT BY SESSION - Session ID: {}", sessionId);
            logger.info("═══════════════════════════════════════════════");

            Payment payment = paymentService.getPaymentBySessionId(sessionId);

            logger.info("✓ Payment retrieved from database:");
            logger.info("   ID: {}", payment.getId());
            logger.info("   Status: {}", payment.getStatus());
            logger.info("   Amount: {}", payment.getAmount());
            logger.info("   Currency: {}", payment.getCurrency());
            logger.info("   SessionID: {}", payment.getStripeSessionId());
            logger.info("   PaymentIntentID: {}", payment.getStripePaymentIntentId());
            logger.info("   PaidAt: {}", payment.getPaidAt());
            logger.info("   CreatedAt: {}", payment.getCreatedAt());
            logger.info("   UpdatedAt: {}", payment.getUpdatedAt());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("payment", payment);

            logger.info("═══════════════════════════════════════════════");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("═══════════════════════════════════════════════");
            logger.error("❌ ERROR FETCHING PAYMENT BY SESSION");
            logger.error("   Session ID: {}", sessionId);
            logger.error("   Error: {}", e.getMessage());
            logger.error("   Exception Type: {}", e.getClass().getName());
            logger.error("═══════════════════════════════════════════════");

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    /**
     * Verify if payment is successful
     * GET /api/payments/{paymentId}/verify
     */
    @GetMapping("/{paymentId}/verify")
    public ResponseEntity<?> verifyPayment(@PathVariable Long paymentId) {
        try {
            Payment payment = paymentService.getPaymentById(paymentId);
            boolean isSuccessful = paymentService.isPaymentSuccessful(paymentId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("isSuccessful", isSuccessful);
            response.put("status", payment.getStatus());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error verifying payment: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    /**
     * Confirm payment by checking with Stripe API
     * POST /api/payments/{paymentId}/confirm
     * 
     * This endpoint retrieves the PaymentIntent status from Stripe and updates
     * the database if payment has been confirmed as SUCCEEDED.
     * Call this immediately from the success page to avoid waiting for webhooks.
     * 
     * Response Success:
     * {
     * "success": true,
     * "payment": { ... updated payment object ... },
     * "message": "Payment confirmed as SUCCEEDED",
     * "status": "SUCCEEDED"
     * }
     * 
     * Response Error:
     * {
     * "success": false,
     * "message": "Error description",
     * "status": "FAILED" (or other status)
     * }
     */
    @PostMapping("/{paymentId}/confirm")
    public ResponseEntity<?> confirmPayment(@PathVariable Long paymentId) {
        try {
            logger.info("═══════════════════════════════════════════════");
            logger.info("🔵 CONFIRM PAYMENT ENDPOINT - Payment ID: {}", paymentId);
            logger.info("═══════════════════════════════════════════════");

            Payment payment = paymentService.confirmPayment(paymentId);

            logger.info("📤 Returning payment confirmation response:");
            logger.info("    Status: {}", payment.getStatus());
            logger.info("    Payment ID: {}", payment.getId());
            logger.info("    PaidAt: {}", payment.getPaidAt());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("payment", payment);
            response.put("status", payment.getStatus());

            if ("SUCCEEDED".equals(payment.getStatus())) {
                response.put("message", "Payment confirmed as SUCCEEDED");
                logger.info("✅ RESPONSE: Payment SUCCEEDED");
            } else if ("PENDING".equals(payment.getStatus())) {
                response.put("message", "Payment is still pending - please wait or check your Stripe dashboard");
                logger.warn("⏳ RESPONSE: Payment still PENDING");
            } else if ("FAILED".equals(payment.getStatus())) {
                response.put("message", "Payment has been marked as FAILED");
                logger.warn("❌ RESPONSE: Payment FAILED");
            } else if ("PROCESSING".equals(payment.getStatus())) {
                response.put("message", "Payment is processing - please wait");
                logger.info("🔄 RESPONSE: Payment PROCESSING");
            } else {
                response.put("message", "Payment status: " + payment.getStatus());
                logger.warn("❓ RESPONSE: Unknown status - {}", payment.getStatus());
            }

            logger.info("═══════════════════════════════════════════════");
            return ResponseEntity.ok(response);

        } catch (com.stripe.exception.InvalidRequestException e) {
            logger.error("═══════════════════════════════════════════════");
            logger.error("❌ STRIPE INVALID REQUEST ERROR");
            logger.error("   Code: {}", e.getCode());
            logger.error("   Message: {}", e.getMessage());
            logger.error("   Payment ID: {}", paymentId);
            logger.error("═══════════════════════════════════════════════");

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Invalid request to Stripe API: " + e.getMessage());
            errorResponse.put("stripeError", e.getCode());
            errorResponse.put("status", "ERROR");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);

        } catch (com.stripe.exception.AuthenticationException e) {
            logger.error("═══════════════════════════════════════════════");
            logger.error("❌ STRIPE AUTHENTICATION ERROR");
            logger.error("   Message: {}", e.getMessage());
            logger.error("   This usually means Stripe API key is invalid");
            logger.error("═══════════════════════════════════════════════");

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Stripe authentication failed - check API key configuration");
            errorResponse.put("status", "ERROR");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);

        } catch (com.stripe.exception.StripeException e) {
            logger.error("═══════════════════════════════════════════════");
            logger.error("❌ STRIPE EXCEPTION");
            logger.error("   Status Code: {}", e.getStatusCode());
            logger.error("   Message: {}", e.getMessage());
            logger.error("   Payment ID: {}", paymentId);
            logger.error("═══════════════════════════════════════════════");

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Stripe error: " + e.getMessage());
            errorResponse.put("stripeStatusCode", e.getStatusCode());
            errorResponse.put("status", "ERROR");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);

        } catch (Exception e) {
            logger.error("═══════════════════════════════════════════════");
            logger.error("❌ UNEXPECTED ERROR CONFIRMING PAYMENT");
            logger.error("   Exception Type: {}", e.getClass().getName());
            logger.error("   Message: {}", e.getMessage());
            logger.error("   Payment ID: {}", paymentId);
            logger.error("   Stack Trace:", e);
            logger.error("═══════════════════════════════════════════════");

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error: " + e.getMessage());
            errorResponse.put("status", "ERROR");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
