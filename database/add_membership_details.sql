-- Migration: Add membership details columns to club_memberships table
-- This adds personal information and skills from the membership form

ALTER TABLE club_memberships 
ADD COLUMN IF NOT EXISTS full_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS address VARCHAR(500),
ADD COLUMN IF NOT EXISTS contact_number VARCHAR(20),
ADD COLUMN IF NOT EXISTS birthday DATE,
ADD COLUMN IF NOT EXISTS faculty VARCHAR(100),
ADD COLUMN IF NOT EXISTS year VARCHAR(50),
ADD COLUMN IF NOT EXISTS skills JSON DEFAULT NULL;

-- Create indices for better query performance on new columns
ALTER TABLE club_memberships 
ADD INDEX IF NOT EXISTS idx_full_name (full_name),
ADD INDEX IF NOT EXISTS idx_contact_number (contact_number),
ADD INDEX IF NOT EXISTS idx_faculty (faculty);

-- Verify the structure
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'club_memberships' AND TABLE_SCHEMA = 'universe_db'
ORDER BY ORDINAL_POSITION;
