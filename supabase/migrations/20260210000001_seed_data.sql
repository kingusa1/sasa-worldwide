-- SASA Worldwide Authentication System
-- Seed data for development

-- ============================================
-- INITIAL ADMIN USER
-- ============================================
-- Email: admin@sasa-worldwide.com
-- Password: Admin@123
-- ⚠️  IMPORTANT: Change this password immediately after first login!

INSERT INTO users (email, password_hash, name, role, status, email_verified)
VALUES (
  'admin@sasa-worldwide.com',
  '$2b$12$QyWRnSx2F8197Jukx0htKuQb8MIXDVRDimyHasaoBNoh9tSXEvHpm', -- bcrypt hash of 'Admin@123'
  'System Administrator',
  'admin',
  'active',
  true
)
ON CONFLICT (email) DO NOTHING;

-- Log the admin creation
INSERT INTO audit_logs (user_id, action, metadata)
SELECT
  id,
  'admin_created',
  '{"source": "seed_file", "note": "Initial admin user created"}'::jsonb
FROM users
WHERE email = 'admin@sasa-worldwide.com';

-- ============================================
-- SAMPLE STAFF MEMBER (FOR TESTING)
-- ============================================
-- Email: john.doe@sasa-worldwide.com
-- Password: Staff@123
-- Status: Active (pre-approved for testing)

INSERT INTO users (email, password_hash, name, role, status, email_verified)
VALUES (
  'john.doe@sasa-worldwide.com',
  '$2b$12$n5V0Vi7NxuHZXd3zgWGPduZtikCMbmCK3Y6fei.Yeno3rf4Uermey', -- bcrypt hash of 'Staff@123'
  'John Doe',
  'staff',
  'active',
  true
)
ON CONFLICT (email) DO NOTHING;

-- Add staff profile for John
INSERT INTO staff_profiles (user_id, employee_id, department, phone, hire_date)
SELECT
  id,
  'SASA-00001',
  'sales',
  '+971501234567',
  CURRENT_DATE
FROM users
WHERE email = 'john.doe@sasa-worldwide.com'
ON CONFLICT (employee_id) DO NOTHING;

-- ============================================
-- SAMPLE AFFILIATE (FOR TESTING)
-- ============================================
-- Email: jane.smith@example.com
-- Password: Affiliate@123
-- Status: Active (no approval needed for affiliates)

INSERT INTO users (email, password_hash, name, role, status, email_verified)
VALUES (
  'jane.smith@example.com',
  '$2b$12$PLEujLx9Q86HL.y3Cqgxg.KE8vwyijymRq1Bj8ON9r7yt6bRhWzji',  -- bcrypt hash of 'Affiliate@123'
  'Jane Smith',
  'affiliate',
  'active',
  true
)
ON CONFLICT (email) DO NOTHING;

-- Add affiliate profile for Jane
INSERT INTO affiliate_profiles (user_id, phone, referral_code)
SELECT
  id,
  '+971509876543',
  'JANE-REF-001'
FROM users
WHERE email = 'jane.smith@example.com'
ON CONFLICT (referral_code) DO NOTHING;

-- ============================================
-- SUMMARY
-- ============================================
-- After running this seed:
--
-- Admin Login:
--   Email: admin@sasa-worldwide.com
--   Password: Admin@123
--
-- Staff Login (for testing):
--   Email: john.doe@sasa-worldwide.com
--   Password: Staff@123
--
-- Affiliate Login (for testing):
--   Email: jane.smith@example.com
--   Password: Affiliate@123
--
-- ⚠️  CHANGE ALL PASSWORDS IN PRODUCTION!
