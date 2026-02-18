-- Migration: Restore Currency Column with LKR
-- This migration restores the currency column to the payments table
-- All payments use LKR currency

-- Step 1: Verify current state
SELECT COUNT(*) as payment_count 
FROM payments;

-- Step 2: Add the currency column back to payments table if it doesn't exist
ALTER TABLE payments ADD COLUMN currency VARCHAR(3) NOT NULL DEFAULT 'LKR' AFTER amount;

-- Step 3: Update all existing payments to LKR
UPDATE payments SET currency = 'LKR' WHERE currency IS NULL OR currency != 'LKR';

-- Step 4: Verify the change
DESC payments;
SELECT COUNT(*), currency FROM payments GROUP BY currency;

-- Note: All payments now use LKR currency
-- This is configured in the Payment.java entity and PaymentService
