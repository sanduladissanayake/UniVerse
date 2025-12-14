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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_admin (admin_id)
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATETIME NOT NULL,
    location VARCHAR(255),
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
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
    UNIQUE KEY unique_membership (user_id, club_id),
    INDEX idx_user (user_id),
    INDEX idx_club (club_id)
);

-- ======================
-- Step 3: Insert Default Data
-- ======================

-- Insert default super admin (Password: admin123)
-- Note: Password is BCrypt hashed
INSERT INTO users (email, password, first_name, last_name, role) 
VALUES ('admin@university.edu', '$2a$10$e0MYzXyjpJS7Pd0RVvHwHe1p2uyLQCxSPPQH3HFqNcPWoqTp/xCgO', 'Super', 'Admin', 'SUPER_ADMIN')
ON DUPLICATE KEY UPDATE email=email;

-- Insert sample clubs
INSERT INTO clubs (name, description, admin_id) VALUES
('Computer Science Club', 'A club for students interested in programming, software development, and technology.', NULL),
('Photography Club', 'Capture moments and learn the art of photography with fellow enthusiasts.', NULL),
('Music Society', 'For music lovers to share, perform, and appreciate different genres of music.', NULL),
('Debate Society', 'Sharpen your argumentative and public speaking skills through structured debates.', NULL),
('Sports Club', 'Stay active and healthy while competing in various sports activities.', NULL)
ON DUPLICATE KEY UPDATE name=name;

-- ======================
-- Step 4: Verification Queries
-- ======================

-- Check if tables are created
SELECT 'Tables created successfully' AS status;
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as club_count FROM clubs;
SELECT COUNT(*) as event_count FROM events;

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
