-- Announcement Feature Migration
-- Date: 2026-02-16
-- Description: Create announcements table for club announcements

USE universe_db;

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    club_id BIGINT NOT NULL,
    created_by BIGINT NOT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_club_id (club_id),
    INDEX idx_created_by (created_by),
    INDEX idx_is_published (is_published),
    INDEX idx_club_published (club_id, is_published)
);

-- Verification
SELECT 'Announcements table created successfully' AS status;
SELECT COUNT(*) as announcement_count FROM announcements;
