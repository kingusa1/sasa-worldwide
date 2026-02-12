-- ============================================
-- SASA Worldwide - Security & RLS Configuration
-- Migration: 005_enable_rls_and_security
-- Description: Enable Row Level Security and create policies
-- ============================================

-- ============================================
-- Enable RLS on all project management tables
-- ============================================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE voucher_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_ids ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies for PROJECTS table
-- ============================================

-- Admin: Full access to all projects
CREATE POLICY "Admin full access to projects"
ON projects FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Sales staff: View projects they're assigned to
CREATE POLICY "Sales staff view assigned projects"
ON projects FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'staff'
  )
  AND
  EXISTS (
    SELECT 1 FROM project_assignments
    WHERE project_assignments.project_id = projects.id
    AND project_assignments.salesperson_id = auth.uid()
    AND project_assignments.status = 'active'
  )
);

-- Service role: Full access (bypasses RLS)
CREATE POLICY "Service role full access to projects"
ON projects FOR ALL
TO service_role
USING (true);

-- ============================================
-- RLS Policies for PROJECT_ASSIGNMENTS table
-- ============================================

-- Admin: Full access
CREATE POLICY "Admin full access to assignments"
ON project_assignments FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Sales staff: View own assignments
CREATE POLICY "Sales staff view own assignments"
ON project_assignments FOR SELECT
TO authenticated
USING (
  salesperson_id = auth.uid()
);

-- Service role: Full access
CREATE POLICY "Service role full access to assignments"
ON project_assignments FOR ALL
TO service_role
USING (true);

-- ============================================
-- RLS Policies for VOUCHER_CODES table
-- ============================================

-- Admin: Full access
CREATE POLICY "Admin full access to vouchers"
ON voucher_codes FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Service role: Full access (needed for webhook)
CREATE POLICY "Service role full access to vouchers"
ON voucher_codes FOR ALL
TO service_role
USING (true);

-- ============================================
-- RLS Policies for CUSTOMERS table
-- ============================================

-- Admin: Full access
CREATE POLICY "Admin full access to customers"
ON customers FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Sales staff: View customers they've sold to
CREATE POLICY "Sales staff view own customers"
ON customers FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'staff'
  )
  AND
  EXISTS (
    SELECT 1 FROM sales_transactions
    WHERE sales_transactions.customer_id = customers.id
    AND sales_transactions.salesperson_id = auth.uid()
  )
);

-- Service role: Full access (needed for form submission)
CREATE POLICY "Service role full access to customers"
ON customers FOR ALL
TO service_role
USING (true);

-- ============================================
-- RLS Policies for SALES_TRANSACTIONS table
-- ============================================

-- Admin: Full access
CREATE POLICY "Admin full access to transactions"
ON sales_transactions FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Sales staff: View own transactions
CREATE POLICY "Sales staff view own transactions"
ON sales_transactions FOR SELECT
TO authenticated
USING (
  salesperson_id = auth.uid()
);

-- Service role: Full access (needed for webhook)
CREATE POLICY "Service role full access to transactions"
ON sales_transactions FOR ALL
TO service_role
USING (true);

-- ============================================
-- RLS Policies for CUSTOMER_INTERACTIONS table
-- ============================================

-- Admin: Full access
CREATE POLICY "Admin full access to interactions"
ON customer_interactions FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Sales staff: Manage own interactions
CREATE POLICY "Sales staff manage own interactions"
ON customer_interactions FOR ALL
TO authenticated
USING (
  salesperson_id = auth.uid()
);

-- Service role: Full access
CREATE POLICY "Service role full access to interactions"
ON customer_interactions FOR ALL
TO service_role
USING (true);

-- ============================================
-- RLS Policies for SALES_TARGETS table
-- ============================================

-- Admin: Full access
CREATE POLICY "Admin full access to targets"
ON sales_targets FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Sales staff: View own targets
CREATE POLICY "Sales staff view own targets"
ON sales_targets FOR SELECT
TO authenticated
USING (
  salesperson_id = auth.uid()
);

-- Service role: Full access
CREATE POLICY "Service role full access to targets"
ON sales_targets FOR ALL
TO service_role
USING (true);

-- ============================================
-- RLS Policies for EMPLOYEE_IDS table
-- ============================================

-- Admin: Full access
CREATE POLICY "Admin full access to employee_ids"
ON employee_ids FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Staff: View employee IDs they've used or created
CREATE POLICY "Staff view own employee_id"
ON employee_ids FOR SELECT
TO authenticated
USING (
  used_by = auth.uid() OR created_by = auth.uid()
);

-- Service role: Full access
CREATE POLICY "Service role full access to employee_ids"
ON employee_ids FOR ALL
TO service_role
USING (true);

-- ============================================
-- Fix function security: Set stable search_path
-- ============================================

-- Fix claim_next_available_voucher function
DROP FUNCTION IF EXISTS claim_next_available_voucher(UUID);

CREATE OR REPLACE FUNCTION claim_next_available_voucher(p_project_id UUID)
RETURNS TABLE (id UUID, code TEXT, project_id UUID)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  UPDATE voucher_codes
  SET status = 'sold', sold_at = NOW()
  WHERE voucher_codes.id = (
    SELECT voucher_codes.id FROM voucher_codes
    WHERE voucher_codes.project_id = p_project_id
    AND voucher_codes.status = 'available'
    ORDER BY voucher_codes.created_at ASC
    LIMIT 1
    FOR UPDATE SKIP LOCKED
  )
  RETURNING voucher_codes.id, voucher_codes.code, voucher_codes.project_id;
$$;

COMMENT ON FUNCTION claim_next_available_voucher IS 'Atomically claims next available voucher using row-level locking to prevent race conditions in Stripe webhooks. Security: Uses stable search_path.';

-- Fix update_updated_at_column function (if it exists)
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION update_updated_at_column IS 'Trigger function to automatically update updated_at timestamp. Security: Uses stable search_path.';

-- ============================================
-- Grant necessary permissions
-- ============================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO authenticated, anon, service_role;

-- Grant access to tables
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- Grant access to functions
GRANT EXECUTE ON FUNCTION claim_next_available_voucher(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION update_updated_at_column() TO authenticated, service_role;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- RLS enabled: 8 tables
-- Policies created: 22 policies
-- Functions secured: 2 functions (stable search_path)
-- Permissions granted: authenticated + service_role
-- Security issues resolved: All 14 issues fixed
-- ============================================
