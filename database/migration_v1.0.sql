-- UniVerse Database Migration File
-- Version: 1.0
-- Date: 2025-12-12
-- Description: Initial database schema for University Club Management System

-- ======================
-- Step 1: Create Database
-- ======================
CREATE DATABASE IF NOT EXISTS universe_db;
USE universe_db;

-- ======================
-- Step 2: Create Tables
-- ======================

-- Users table (Students, Club Admins, Super Admins)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Clubs table
CREATE TABLE IF NOT EXISTS clubs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    admin_id BIGINT,
    membership_fee DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_admin (admin_id),
    INDEX idx_fee (membership_fee)
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATETIME NOT NULL,
    location VARCHAR(255),
    photo_url VARCHAR(500),
    club_id BIGINT,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_club (club_id),
    INDEX idx_date (event_date)
);

-- Club memberships (Students joining clubs)
CREATE TABLE IF NOT EXISTS club_memberships (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    club_id BIGINT NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    full_name VARCHAR(255),
    address VARCHAR(500),
    contact_number VARCHAR(20),
    birthday DATE,
    faculty VARCHAR(100),
    year VARCHAR(50),
    skills JSON DEFAULT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
    UNIQUE KEY unique_membership (user_id, club_id),
    INDEX idx_full_name (full_name),
    INDEX idx_contact_number (contact_number),
    INDEX idx_faculty (faculty)
);

-- Payments table (Stripe payment records)
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    club_id BIGINT NOT NULL,
    stripe_session_id VARCHAR(500) UNIQUE NOT NULL,
    stripe_payment_intent_id VARCHAR(500),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'LKR',
    status VARCHAR(50) DEFAULT 'PENDING',
    payment_method VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_club (club_id),
    INDEX idx_status (status),
    INDEX idx_session (stripe_session_id)
);

-- ======================
-- Step 3: Insert Default Data
-- ======================

-- Insert default super admin (Password: admin123)
-- Note: Password is BCrypt hashed
INSERT INTO users (email, password, first_name, last_name, role) 
VALUES ('admin@university.edu', '$2a$10$e0MYzXyjpJS7Pd0RVvHwHe1p2uyLQCxSPPQH3HFqNcPWoqTp/xCgO', 'Super', 'Admin', 'SUPER_ADMIN')
ON DUPLICATE KEY UPDATE password='$2a$10$e0MYzXyjpJS7Pd0RVvHwHe1p2uyLQCxSPPQH3HFqNcPWoqTp/xCgO';

-- Insert second super admin (Password: admin123)
INSERT INTO users (email, password, first_name, last_name, role) 
VALUES ('superadmin@university.edu', '$2a$10$e0MYzXyjpJS7Pd0RVvHwHe1p2uyLQCxSPPQH3HFqNcPWoqTp/xCgO', 'Super', 'Admin2', 'SUPER_ADMIN')
ON DUPLICATE KEY UPDATE email=email;

-- Insert sample clubs with membership fees
INSERT INTO clubs (name, description, admin_id, membership_fee) VALUES
('Computer Science Club', 'A club for students interested in programming, software development, and technology.', NULL, 50.00),
('Photography Club', 'Capture moments and learn the art of photography with fellow enthusiasts.', NULL, 30.00),
('Music Society', 'For music lovers to share, perform, and appreciate different genres of music.', NULL, 40.00),
('Debate Society', 'Sharpen your argumentative and public speaking skills through structured debates.', NULL, 25.00),
('Sports Club', 'Stay active and healthy while competing in various sports activities.', NULL, 60.00)
ON DUPLICATE KEY UPDATE name=name;

-- ======================
-- Step 4: Verification Queries
-- ======================

-- Insert sample events
INSERT INTO events (title, description, event_date, location, club_id, created_by) VALUES
('Hackathon 2025', '24-hour coding competition with amazing prizes!', '2025-12-20 09:00:00', 'Computer Lab A', 1, NULL),
('Photo Walk', 'Explore the campus and capture beautiful moments.', '2025-12-18 15:00:00', 'Main Campus', 2, NULL),
('Concert Night', 'Live performances by talented student musicians.', '2025-12-22 18:00:00', 'University Auditorium', 3, NULL),
('Debate Championship', 'Inter-university debate competition.', '2025-12-25 14:00:00', 'Conference Hall', 4, NULL),
('Sports Day', 'Annual sports day with various competitive events.', '2026-01-10 08:00:00', 'Sports Complex', 5, NULL)
ON DUPLICATE KEY UPDATE title=title;

-- Check if tables are created
SELECT 'Tables created successfully' AS status;
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as club_count FROM clubs;
SELECT COUNT(*) as event_count FROM events;
SELECT COUNT(*) as membership_count FROM club_memberships;
SELECT COUNT(*) as payment_count FROM payments;

-- ======================
-- For Team Collaboration
-- ======================
-- Each team member should:
-- 1. Create their own MySQL database locally
-- 2. Run this file to create the schema
-- 3. Update backend/src/main/resources/application.properties with their MySQL password
-- 4. Never commit database credentials to GitHub
-- 5. Use .env file or application-local.properties for local settings

-- ======================
-- Rollback (if needed)
-- ======================
-- DROP DATABASE IF EXISTS universe_db;
