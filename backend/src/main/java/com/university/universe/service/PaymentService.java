package com.university.universe.service;

import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.*;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import com.university.universe.dto.CheckoutSessionRequest;
import com.university.universe.dto.CheckoutSessionResponse;
import com.university.universe.model.Club;
import com.university.universe.model.Payment;
import com.university.universe.repository.ClubRepository;
import com.university.universe.repository.PaymentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Service for handling Stripe payment operations
 * Manages checkout sessions, payment status updates, and webhook handling
 */
@Service
@SuppressWarnings("null")
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ClubRepository clubRepository;

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @Value("${stripe.webhook.secret}")
    private String webhookSecret;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    /**
     * Create a Stripe checkout session for club membership payment
     * 
     * @param request Checkout session request with payment details
     * @return Checkout session response with session URL
     */
    public CheckoutSessionResponse createCheckoutSession(CheckoutSessionRequest request) throws StripeException {
        // Initialize Stripe API key
        Stripe.apiKey = stripeApiKey;

        // Log API key initialization (without exposing the actual key)
        if (stripeApiKey == null || stripeApiKey.isEmpty() || stripeApiKey.contains("placeholder")) {
            logger.error("Stripe API key is not properly configured. Key: {}",
                    stripeApiKey != null && stripeApiKey.length() > 10 ? stripeApiKey.substring(0, 10) + "..."
                            : "NULL/EMPTY");
            throw new IllegalArgumentException("Stripe API key is not properly configured");
        }
        logger.info("Stripe API key initialized (length: {})", stripeApiKey.length());

        // Validate request
        if (request.getUserId() == null || request.getClubId() == null) {
            throw new IllegalArgumentException("User ID and Club ID are required");
        }

        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }

        try {
            // Get club info
            Optional<Club> club = clubRepository.findById(request.getClubId());
            if (club.isEmpty()) {
                throw new IllegalArgumentException("Club not found");
            }

            // Create payment record
            Payment payment = new Payment(
                    request.getUserId(),
                    request.getClubId(),
                    request.getAmount(),
                    "LKR"); // Always use LKR
            payment = paymentRepository.save(payment);

            logger.info("✓ Payment record created with ID: {}", payment.getId());

            // Build Stripe checkout session
            String successUrl = buildUrl(request.getSuccessUrl());
            String cancelUrl = buildUrl(request.getCancelUrl());

            // Add session_id as query parameter - Stripe will replace {CHECKOUT_SESSION_ID}
            // with actual session ID
            successUrl = successUrl + (successUrl.contains("?") ? "&" : "?") + "session_id={CHECKOUT_SESSION_ID}";
            cancelUrl = cancelUrl + (cancelUrl.contains("?") ? "&" : "?") + "session_id={CHECKOUT_SESSION_ID}";

            String currency = "lkr"; // Stripe supports LKR (Sri Lankan Rupees)
            Long unitAmount = convertToStripeAmount(request.getAmount());

            // Log payment details
            logger.info("💳 Stripe Checkout Session - LKR Payment:");
            logger.info("  Amount in LKR: {} LKR", request.getAmount());
            logger.info("  Stripe API Currency: {}", currency);
            logger.info("  Stripe Amount (cents): {}", unitAmount);
            logger.info("  Club: {}", club.get().getName());

            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(successUrl)
                    .setCancelUrl(cancelUrl)
                    .addLineItem(
                            SessionCreateParams.LineItem.builder()
                                    .setPriceData(
                                            SessionCreateParams.LineItem.PriceData.builder()
                                                    .setCurrency(currency)
                                                    .setUnitAmount(unitAmount)
                                                    .setProductData(
                                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                    .setName(club.get().getName() + " - Membership")
                                                                    .setDescription("Membership Fee: LKR "
                                                                            + request.getAmount().setScale(2,
                                                                                    java.math.RoundingMode.HALF_UP))
                                                                    .build())
                                                    .build())
                                    .setQuantity(1L)
                                    .build())
                    .putMetadata("payment_id", String.valueOf(payment.getId()))
                    .putMetadata("user_id", String.valueOf(request.getUserId()))
                    .putMetadata("club_id", String.valueOf(request.getClubId()))
                    .putMetadata("club_name", club.get().getName())
                    .putMetadata("amount_lkr", request.getAmount().toString())
                    .putMetadata("currency_display", "LKR")
                    .putMetadata("currency_stripe", currency)
                    .setCustomerEmail(null) // Can be set if user email is available
                    .build();

            logger.info("Attempting to create Stripe checkout session...");

            // Create Stripe session with detailed error handling
            Session session;
            try {
                session = Session.create(params);
                logger.info("✓ Stripe session created successfully: {}", session.getId());
            } catch (com.stripe.exception.InvalidRequestException e) {
                logger.error("Stripe Invalid Request Error: {}", e.getMessage());
                logger.error("Stripe Error Code: {}", e.getCode());
                logger.error("Stripe Error Param: {}", e.getParam());
                throw e;
            } catch (com.stripe.exception.AuthenticationException e) {
                logger.error("Stripe Authentication Error - API key may be invalid: {}", e.getMessage());
                throw e;
            } catch (com.stripe.exception.CardException e) {
                logger.error("Stripe Card Error: {}", e.getMessage());
                throw e;
            } catch (com.stripe.exception.StripeException e) {
                logger.error("Stripe Exception occurred: {}", e.getMessage(), e);
                logger.error("Stripe Status Code: {}", e.getStatusCode());
                logger.error("Stripe Error Type: {}", e.getClass().getSimpleName());
                throw e;
            }

            // Update payment record with Stripe session ID
            payment.setStripeSessionId(session.getId());
            if (session.getPaymentIntent() != null) {
                payment.setStripePaymentIntentId(session.getPaymentIntent());
                logger.info("💾 PaymentIntent ID saved to database: {}", session.getPaymentIntent());
            } else {
                logger.warn(
                        "⚠️ Session created but PaymentIntent ID is NULL. Session has no associated payment intent yet.");
            }
            paymentRepository.save(payment);

            logger.info("✓ Payment record updated with Stripe session ID: {}", session.getId());
            logger.info("   Payment ID: {}, Session ID: {}, PaymentIntent ID: {}",
                    payment.getId(), payment.getStripeSessionId(), payment.getStripePaymentIntentId());

            // Build response
            CheckoutSessionResponse response = new CheckoutSessionResponse();
            response.setSessionId(session.getId());
            response.setSessionUrl(session.getUrl());
            response.setPaymentId(payment.getId());
            response.setMessage("Checkout session created successfully");

            return response;

        } catch (StripeException e) {
            logger.error("Stripe Exception in createCheckoutSession: {}", e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            logger.error("Unexpected error in createCheckoutSession: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create checkout session: " + e.getMessage());
        }
    }

    /**
     * Handle Stripe webhook events
     * 
     * @param payload   Raw webhook payload
     * @param sigHeader Stripe signature header
     * @return Map with event type and status
     */
    public Map<String, Object> handleWebhookEvent(String payload, String sigHeader) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Verify webhook signature
            Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);

            logger.info("🔔 Webhook received from Stripe: Type: {}", event.getType());
            logger.debug("Webhook Event ID: {}", event.getId());
            logger.debug("Webhook Created: {}", event.getCreated());

            // Handle different event types
            switch (event.getType()) {
                case "checkout.session.completed":
                    handleCheckoutSessionCompleted(event);
                    response.put("success", true);
                    response.put("message", "Payment processed successfully");
                    break;

                case "payment_intent.succeeded":
                    handlePaymentIntentSucceeded(event);
                    response.put("success", true);
                    response.put("message", "Payment intent succeeded");
                    break;

                case "payment_intent.payment_failed":
                    handlePaymentIntentFailed(event);
                    response.put("success", false);
                    response.put("message", "Payment failed");
                    break;

                case "charge.refunded":
                    handleChargeRefunded(event);
                    response.put("success", true);
                    response.put("message", "Refund processed");
                    break;

                default:
                    logger.info("Unhandled event type: {}", event.getType());
                    response.put("success", true);
                    response.put("message", "Event received but not processed");
            }

        } catch (SignatureVerificationException e) {
            logger.error("Invalid webhook signature: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "Invalid signature");
        } catch (Exception e) {
            logger.error("Error processing webhook: {}", e.getMessage(), e);
            response.put("success", false);
            response.put("message", "Error processing webhook: " + e.getMessage());
        }

        return response;
    }

    /**
     * Handle checkout session completed event
     */
    private void handleCheckoutSessionCompleted(Event event) throws StripeException {
        EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
        StripeObject stripeObject = dataObjectDeserializer.getObject().orElse(null);

        if (stripeObject instanceof Session) {
            Session session = (Session) stripeObject;
            logger.info("✅ Processing checkout session completed: {}", session.getId());

            // Update payment record
            Optional<Payment> paymentOpt = paymentRepository.findByStripeSessionId(session.getId());
            if (paymentOpt.isPresent()) {
                Payment payment = paymentOpt.get();
                payment.setStatus("SUCCEEDED");
                payment.setPaidAt(LocalDateTime.now());
                payment.setUpdatedAt(LocalDateTime.now());
                paymentRepository.save(payment);

                logger.info("✅ Payment marked as SUCCEEDED in database - ID: {}, Status: {}", payment.getId(),
                        payment.getStatus());
            } else {
                logger.warn("⚠️ Payment not found for session: {}", session.getId());
            }
        } else {
            logger.warn("⚠️ Event object is not a Session: {}",
                    stripeObject != null ? stripeObject.getClass().getSimpleName() : "null");
        }
    }

    /**
     * Handle payment intent succeeded event
     */
    private void handlePaymentIntentSucceeded(Event event) throws StripeException {
        EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
        StripeObject stripeObject = dataObjectDeserializer.getObject().orElse(null);

        if (stripeObject instanceof PaymentIntent) {
            PaymentIntent paymentIntent = (PaymentIntent) stripeObject;
            logger.info("Processing payment intent succeeded: {}", paymentIntent.getId());

            // Update payment record
            Optional<Payment> paymentOpt = paymentRepository.findByStripePaymentIntentId(paymentIntent.getId());
            if (paymentOpt.isPresent()) {
                Payment payment = paymentOpt.get();
                payment.setStatus("SUCCEEDED");
                payment.setPaidAt(LocalDateTime.now());
                payment.setUpdatedAt(LocalDateTime.now());
                // Note: Charge information is not directly available from PaymentIntent
                // It can be retrieved separately if needed via PaymentIntent.getCharges() query
                paymentRepository.save(payment);

                logger.info("Payment marked as succeeded: {}", payment.getId());
            }
        }
    }

    /**
     * Handle payment intent failed event
     */
    private void handlePaymentIntentFailed(Event event) throws StripeException {
        EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
        StripeObject stripeObject = dataObjectDeserializer.getObject().orElse(null);

        if (stripeObject instanceof PaymentIntent) {
            PaymentIntent paymentIntent = (PaymentIntent) stripeObject;
            logger.info("Processing payment intent failed: {}", paymentIntent.getId());

            // Update payment record
            Optional<Payment> paymentOpt = paymentRepository.findByStripePaymentIntentId(paymentIntent.getId());
            if (paymentOpt.isPresent()) {
                Payment payment = paymentOpt.get();
                payment.setStatus("FAILED");
                payment.setUpdatedAt(LocalDateTime.now());
                if (paymentIntent.getLastPaymentError() != null) {
                    payment.setErrorMessage(paymentIntent.getLastPaymentError().getMessage());
                }
                paymentRepository.save(payment);

                logger.info("Payment marked as failed: {}", payment.getId());
            }
        }
    }

    /**
     * Handle charge refunded event
     */
    private void handleChargeRefunded(Event event) throws StripeException {
        EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
        StripeObject stripeObject = dataObjectDeserializer.getObject().orElse(null);

        if (stripeObject instanceof Charge) {
            Charge charge = (Charge) stripeObject;
            logger.info("Processing charge refunded: {}", charge.getId());

            // Find and update related payment
            if (charge.getPaymentIntent() != null) {
                Optional<Payment> paymentOpt = paymentRepository.findByStripePaymentIntentId(charge.getPaymentIntent());
                if (paymentOpt.isPresent()) {
                    Payment payment = paymentOpt.get();
                    payment.setStatus("REFUNDED");
                    payment.setUpdatedAt(LocalDateTime.now());
                    paymentRepository.save(payment);

                    logger.info("Payment marked as refunded: {}", payment.getId());
                }
            }
        }
    }

    /**
     * Get payment by ID
     */
    public Payment getPaymentById(Long paymentId) {
        Optional<Payment> result = paymentRepository.findById(paymentId);
        return result
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + paymentId));
    }

    /**
     * Get payment by Stripe session ID
     */
    public Payment getPaymentBySessionId(String sessionId) {
        return paymentRepository.findByStripeSessionId(sessionId)
                .orElseThrow(() -> new RuntimeException("Payment not found for session: " + sessionId));
    }

    /**
     * Check if payment is successful
     */
    public boolean isPaymentSuccessful(Long paymentId) {
        Payment payment = getPaymentById(paymentId);
        return "SUCCEEDED".equals(payment.getStatus());
    }

    /**
     * Convert BigDecimal amount to Stripe amount (in cents for LKR)
     * Stripe expects amounts in the smallest currency unit
     * For LKR: multiply by 100 to convert to cents
     */
    private long convertToStripeAmount(BigDecimal amountLkr) {
        // Stripe supports LKR natively
        // Stripe expects amounts in smallest currency unit: cents for LKR (multiply by
        // 100)
        final BigDecimal CENTS_MULTIPLIER = new BigDecimal("100");

        // Convert LKR to cents for Stripe
        long amountInCents = amountLkr.multiply(CENTS_MULTIPLIER).longValue();

        logger.debug("LKR {} = {} cents (for Stripe)", amountLkr, amountInCents);
        return amountInCents;
    }

    /**
     * Confirm payment by checking PaymentIntent status from Stripe
     * Updates database if payment has succeeded
     * 
     * @param paymentId Payment ID to confirm
     * @return Updated payment object
     */
    public Payment confirmPayment(Long paymentId) throws StripeException {
        Stripe.apiKey = stripeApiKey;

        logger.info("═══════════════════════════════════════════════");
        logger.info("🔄 PAYMENT CONFIRMATION STARTED - Payment ID: {}", paymentId);
        logger.info("═══════════════════════════════════════════════");

        // Get payment from database
        Payment payment = getPaymentById(paymentId);

        logger.info("📋 Current payment state in database:");
        logger.info("   ID: {}", payment.getId());
        logger.info("   Status: {}", payment.getStatus());
        logger.info("   SessionID: {}", payment.getStripeSessionId());
        logger.info("   PaymentIntentID: {}", payment.getStripePaymentIntentId());
        logger.info("   Amount: {}", payment.getAmount());
        logger.info("   Currency: {}", payment.getCurrency());

        // If already marked as succeeded, return it
        if ("SUCCEEDED".equals(payment.getStatus())) {
            logger.info("✓ Payment {} is already marked as SUCCEEDED", paymentId);
            return payment;
        }

        try {
            String sessionId = payment.getStripeSessionId();
            String paymentIntentId = payment.getStripePaymentIntentId();

            // If PaymentIntent ID is missing, retrieve it from the session
            if (paymentIntentId == null || paymentIntentId.isEmpty()) {
                logger.warn("⚠️ PaymentIntent ID not in database, retrieving from Stripe session: {}", sessionId);

                if (sessionId == null || sessionId.isEmpty()) {
                    logger.error("❌ SESSION ID IS ALSO MISSING!");
                    logger.error("   Cannot confirm payment without SessionID");
                    logger.warn("   Returning payment with current status: {}", payment.getStatus());
                    return payment;
                }

                try {
                    logger.info("🔍 Retrieving session from Stripe: {}", sessionId);
                    Session session = Session.retrieve(sessionId);
                    logger.info("✓ Session retrieved from Stripe");

                    paymentIntentId = session.getPaymentIntent();
                    if (paymentIntentId != null && !paymentIntentId.isEmpty()) {
                        logger.info("✓ PaymentIntent ID found in session: {}", paymentIntentId);
                        // Update the payment record with the PaymentIntent ID for future reference
                        payment.setStripePaymentIntentId(paymentIntentId);
                        paymentRepository.save(payment);
                        logger.info("✓ PaymentIntent ID saved to database for future use");
                    } else {
                        logger.warn("⚠️ Session does not have PaymentIntent ID yet");
                        logger.warn("   Payment is still processing or requires further action");
                        payment.setStatus("PENDING");
                        payment.setUpdatedAt(LocalDateTime.now());
                        paymentRepository.save(payment);
                        return payment;
                    }
                } catch (Exception e) {
                    logger.error("❌ Error retrieving session from Stripe: {}", e.getMessage());
                    logger.warn("   Returning payment with current status: {}", payment.getStatus());
                    return payment;
                }
            }

            logger.info("🔍 Querying Stripe API for PaymentIntent: {}", paymentIntentId);
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
            logger.info("✓ PaymentIntent retrieved from Stripe");
            logger.info("   Stripe PaymentIntent ID: {}", paymentIntent.getId());
            logger.info("   Stripe Status: {}", paymentIntent.getStatus());
            logger.info("   Stripe Amount: {}", paymentIntent.getAmount());
            logger.info("   Stripe Currency: {}", paymentIntent.getCurrency());

            // Check if payment succeeded in Stripe
            if ("succeeded".equalsIgnoreCase(paymentIntent.getStatus())) {
                logger.info("✅ STRIPE CONFIRMS: Payment is SUCCEEDED");
                // Update payment record
                payment.setStatus("SUCCEEDED");
                payment.setPaidAt(LocalDateTime.now());
                payment.setUpdatedAt(LocalDateTime.now());
                payment = paymentRepository.save(payment);

                logger.info("✅ DATABASE UPDATED: Payment status updated to SUCCEEDED");
                logger.info("   Payment ID: {}, PaidAt: {}", payment.getId(), payment.getPaidAt());
                logger.info("═══════════════════════════════════════════════");
                return payment;
            } else if ("processing".equalsIgnoreCase(paymentIntent.getStatus())) {
                logger.warn("⏳ PaymentIntent {} is still processing", paymentIntent.getId());
                logger.warn("   This is normal - payment may still be being processed by Stripe");
                payment.setStatus("PENDING");
                payment.setUpdatedAt(LocalDateTime.now());
                paymentRepository.save(payment);
                logger.info("═══════════════════════════════════════════════");
                return payment;
            } else if ("requires_payment_method".equalsIgnoreCase(paymentIntent.getStatus())) {
                logger.error("❌ PaymentIntent requires payment method - payment failed");
                payment.setStatus("FAILED");
                payment.setErrorMessage("Payment requires payment method - please try again");
                payment = paymentRepository.save(payment);
                logger.info("═══════════════════════════════════════════════");
                return payment;
            } else {
                logger.warn("⚠️ PaymentIntent has unexpected status: {}", paymentIntent.getStatus());
                logger.warn("   This payment status is not yet handled. Keeping as-is.");
                logger.info("═══════════════════════════════════════════════");
                return payment;
            }

        } catch (com.stripe.exception.InvalidRequestException e) {
            logger.error("❌ Stripe Invalid Request Error for PaymentIntent {}", payment.getStripePaymentIntentId());
            logger.error("   Error Code: {}", e.getCode());
            logger.error("   Error Message: {}", e.getMessage());
            throw e;
        } catch (com.stripe.exception.AuthenticationException e) {
            logger.error("❌ Stripe Authentication Error");
            logger.error("   Message: {}", e.getMessage());
            logger.error("   Verify Stripe API key is correctly configured");
            throw e;
        } catch (com.stripe.exception.StripeException e) {
            logger.error("❌ Stripe Exception while confirming payment");
            logger.error("   Status Code: {}", e.getStatusCode());
            logger.error("   Message: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("❌ Unexpected error confirming payment");
            logger.error("   Exception Type: {}", e.getClass().getName());
            logger.error("   Message: {}", e.getMessage());
            logger.error("   Full error:", e);
            throw new RuntimeException("Failed to confirm payment: " + e.getMessage());
        } finally {
            logger.info("═══════════════════════════════════════════════");
        }
    }

    /**
     * Build full URL with frontend base
     */
    private String buildUrl(String path) {
        if (path == null || path.isEmpty()) {
            return frontendUrl;
        }
        if (path.startsWith("http")) {
            return path;
        }
        return frontendUrl + (path.startsWith("/") ? path : "/" + path);
    }
}
