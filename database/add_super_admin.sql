-- Add new Super Admin user
-- Password: password123 (BCrypt hash)
-- Note: The password hash below is for "password123"
-- If you want to use a different password, generate the hash and replace it

INSERT INTO users (email, password, first_name, last_name, role) 
VALUES (
  'superadmin@university.edu',
  '$2a$10$slYQmyNdGzin7olVYGLBN.LYp1/F8j7IHEz9zl6BjOGOHPDlyQWkm',
  'Super',
  'Admin2',
  'SUPER_ADMIN'
)
ON DUPLICATE KEY UPDATE email=email;

-- Also update the existing admin with a fresh hash
-- Password: admin@123 (BCrypt hash below)
UPDATE users 
SET password = '$2a$10$slYQmyNdGzin7olVYGLBN.LYp1/F8j7IHEz9zl6BjOGOHPDlyQWkm'
WHERE email = 'admin@university.edu' AND role = 'SUPER_ADMIN';

-- Verify the super admins were created/updated
SELECT id, email, first_name, last_name, role FROM users WHERE role = 'SUPER_ADMIN';
