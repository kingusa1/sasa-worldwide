-- Employee IDs Table
-- This table stores admin-generated employee IDs that staff members must use to register
-- Only admins can create employee IDs, and each ID can only be used once

CREATE TABLE employee_ids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL, -- Email this ID was assigned to
  status TEXT CHECK (status IN ('unused', 'used', 'revoked')) DEFAULT 'unused',
  used_by UUID REFERENCES users(id) ON DELETE SET NULL, -- User who used this ID
  created_by UUID REFERENCES users(id) ON DELETE SET NULL, -- Admin who created it
  created_at TIMESTAMPTZ DEFAULT NOW(),
  used_at TIMESTAMPTZ,
  notes TEXT -- Admin notes
);

-- Indexes for performance
CREATE INDEX idx_employee_ids_employee_id ON employee_ids(employee_id);
CREATE INDEX idx_employee_ids_email ON employee_ids(email);
CREATE INDEX idx_employee_ids_status ON employee_ids(status);
CREATE INDEX idx_employee_ids_created_by ON employee_ids(created_by);

-- Add comment
COMMENT ON TABLE employee_ids IS 'Admin-controlled employee IDs that must be provided to staff before they can register';
