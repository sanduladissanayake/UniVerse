-- Fix Super Admin Password Hash
-- Password: admin123
-- Hash: $2a$10$e0MYzXyjpJS7Pd0RVvHwHe1p2uyLQCxSPPQH3HFqNcPWoqTp/xCgO

USE universe_db;

-- Update existing admin user with CORRECT hash
UPDATE users 
SET password = '$2a$10$e0MYzXyjpJS7Pd0RVvHwHe1p2uyLQCxSPPQH3HFqNcPWoqTp/xCgO'
WHERE email = 'admin@university.edu';

-- Update or insert second super admin
INSERT INTO users (email, password, first_name, last_name, role) 
VALUES ('superadmin@university.edu', '$2a$10$e0MYzXyjpJS7Pd0RVvHwHe1p2uyLQCxSPPQH3HFqNcPWoqTp/xCgO', 'Super', 'Admin2', 'SUPER_ADMIN')
ON DUPLICATE KEY UPDATE password = '$2a$10$e0MYzXyjpJS7Pd0RVvHwHe1p2uyLQCxSPPQH3HFqNcPWoqTp/xCgO';

-- Verify
SELECT id, email, first_name, role FROM users WHERE role = 'SUPER_ADMIN';
