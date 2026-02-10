-- SASA Worldwide Authentication System
-- Initial schema migration

-- Note: gen_random_uuid() is built-in to PostgreSQL 13+, no extension needed

-- ============================================
-- USERS TABLE
-- ============================================
-- Stores all user accounts (staff, affiliates, admins)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('staff', 'affiliate', 'admin')) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'active', 'suspended', 'rejected')) DEFAULT 'pending',
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE users IS 'All user accounts for staff, affiliates, and admins';
COMMENT ON COLUMN users.role IS 'User role: staff, affiliate, or admin';
COMMENT ON COLUMN users.status IS 'Account status: pending (awaiting approval), active, suspended, or rejected';
COMMENT ON COLUMN users.email_verified IS 'Whether email has been verified via verification link';

-- ============================================
-- STAFF PROFILES TABLE
-- ============================================
-- Additional information specific to staff members
CREATE TABLE staff_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  employee_id TEXT UNIQUE NOT NULL,
  department TEXT NOT NULL,
  phone TEXT,
  hire_date DATE,
  manager_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE staff_profiles IS 'Extended profile information for staff members';
COMMENT ON COLUMN staff_profiles.employee_id IS 'Unique employee ID (format: EMP-##### or SASA-#####)';
COMMENT ON COLUMN staff_profiles.department IS 'Department: sales, marketing, operations, etc.';
COMMENT ON COLUMN staff_profiles.manager_id IS 'ID of staff member''s manager for hierarchical approval';

-- ============================================
-- AFFILIATE PROFILES TABLE
-- ============================================
-- Additional information specific to affiliates
CREATE TABLE affiliate_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  phone TEXT,
  referral_code TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE affiliate_profiles IS 'Extended profile information for affiliate members';
COMMENT ON COLUMN affiliate_profiles.referral_code IS 'Unique referral code for tracking affiliate conversions';

-- ============================================
-- SIGNUP REQUESTS TABLE
-- ============================================
-- Tracks staff signup requests for admin approval workflow
CREATE TABLE signup_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  approved_by UUID REFERENCES users(id),
  approval_notes TEXT,
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

COMMENT ON TABLE signup_requests IS 'Staff signup requests requiring admin approval';
COMMENT ON COLUMN signup_requests.approved_by IS 'Admin user who approved or rejected the request';
COMMENT ON COLUMN signup_requests.approval_notes IS 'Reason for rejection or notes from admin';

-- ============================================
-- VERIFICATION TOKENS TABLE
-- ============================================
-- Stores email verification and password reset tokens
CREATE TABLE verification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  token TEXT UNIQUE NOT NULL,
  type TEXT CHECK (type IN ('email_verification', 'password_reset')) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE verification_tokens IS 'Tokens for email verification and password reset';
COMMENT ON COLUMN verification_tokens.type IS 'email_verification (24h expiry) or password_reset (1h expiry)';
COMMENT ON COLUMN verification_tokens.used_at IS 'Timestamp when token was used (null = not used yet)';

-- ============================================
-- SESSIONS TABLE
-- ============================================
-- Stores user sessions (if using database sessions instead of JWT)
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE sessions IS 'User sessions for NextAuth (optional - can use JWT instead)';

-- ============================================
-- AUDIT LOGS TABLE
-- ============================================
-- Tracks all authentication-related events for security
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE audit_logs IS 'Audit trail of all authentication events';
COMMENT ON COLUMN audit_logs.action IS 'Event type: login, signup, password_reset, approval, rejection, etc.';
COMMENT ON COLUMN audit_logs.metadata IS 'Additional JSON data (e.g., {"approved_by": "admin@sasa.com"})';

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_status ON users(role, status);
CREATE INDEX idx_staff_employee_id ON staff_profiles(employee_id);
CREATE INDEX idx_signup_requests_status ON signup_requests(status);
CREATE INDEX idx_verification_tokens_token ON verification_tokens(token);
CREATE INDEX idx_verification_tokens_user_id ON verification_tokens(user_id);
CREATE INDEX idx_verification_tokens_type_expires ON verification_tokens(type, expires_at);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE signup_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  USING (auth.uid()::text = id::text);

-- Users can update their own data (except role and status)
CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid()::text = id::text);

-- Staff can read their own profile
CREATE POLICY "Staff can read own profile"
  ON staff_profiles FOR SELECT
  USING (auth.uid()::text = user_id::text);

-- Affiliates can read their own profile
CREATE POLICY "Affiliates can read own profile"
  ON affiliate_profiles FOR SELECT
  USING (auth.uid()::text = user_id::text);

-- Service role (backend) has full access
-- Note: Service role bypasses RLS by default

-- ============================================
-- TRIGGERS
-- ============================================
-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INITIAL DATA
-- ============================================
-- This will be added in the seed file
