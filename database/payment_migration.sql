-- Payment System Migration Script
-- This script creates the payments table to track Stripe payment transactions
-- Run this script after updating your Spring Boot application

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    club_id BIGINT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'LKR',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    stripe_session_id VARCHAR(255) UNIQUE,
    stripe_payment_intent_id VARCHAR(255),
    payment_method VARCHAR(50),
    error_message TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    paid_at TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_club (club_id),
    INDEX idx_status (status),
    INDEX idx_stripe_session (stripe_session_id),
    INDEX idx_stripe_intent (stripe_payment_intent_id),
    INDEX idx_created_at (created_at)
);

-- Add membership_fee column to clubs table if it doesn't exist
-- This column stores the membership fee amount for each club
ALTER TABLE clubs 
ADD COLUMN IF NOT EXISTS membership_fee DECIMAL(10, 2) DEFAULT NULL;

-- Create an index on club membership_fee for filtering
ALTER TABLE clubs 
ADD INDEX IF NOT EXISTS idx_membership_fee (membership_fee);

-- Optional: Create a view for payment statistics
CREATE OR REPLACE VIEW payment_statistics AS
SELECT 
    club_id,
    COUNT(*) as total_payments,
    SUM(CASE WHEN status = 'SUCCEEDED' THEN 1 ELSE 0 END) as successful_payments,
    SUM(CASE WHEN status = 'FAILED' THEN 1 ELSE 0 END) as failed_payments,
    SUM(CASE WHEN status = 'SUCCEEDED' THEN amount ELSE 0 END) as total_revenue,
    currency
FROM payments
GROUP BY club_id, currency;

-- Optional: Create a view for user payment history
CREATE OR REPLACE VIEW user_payment_history AS
SELECT 
    p.id,
    p.user_id,
    p.club_id,
    c.name as club_name,
    p.amount,
    p.currency,
    p.status,
    p.created_at,
    p.paid_at
FROM payments p
LEFT JOIN clubs c ON p.club_id = c.id
ORDER BY p.created_at DESC;
