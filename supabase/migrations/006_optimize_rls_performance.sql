-- ============================================
-- SASA Worldwide - RLS Performance Optimization
-- Migration: 006_optimize_rls_performance
-- Description: Optimize RLS policies by caching auth.uid() evaluation
-- Issue: auth.uid() was being re-evaluated for each row
-- Fix: Wrap with (select auth.uid()) to evaluate once per query
-- ============================================

-- Drop all existing policies and recreate with optimized versions

-- ============================================
-- PROJECTS - Optimized policies
-- ============================================
DROP POLICY IF EXISTS "Admin full access to projects" ON projects;
DROP POLICY IF EXISTS "Sales staff view assigned projects" ON projects;
DROP POLICY IF EXISTS "Service role full access to projects" ON projects;

CREATE POLICY "Admin full access to projects"
ON projects FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = (select auth.uid())
    AND users.role = 'admin'
  )
);

CREATE POLICY "Sales staff view assigned projects"
ON projects FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = (select auth.uid())
    AND users.role = 'staff'
  )
  AND
  EXISTS (
    SELECT 1 FROM project_assignments
    WHERE project_assignments.project_id = projects.id
    AND project_assignments.salesperson_id = (select auth.uid())
    AND project_assignments.status = 'active'
  )
);

CREATE POLICY "Service role full access to projects"
ON projects FOR ALL
TO service_role
USING (true);

-- ============================================
-- PROJECT_ASSIGNMENTS - Optimized policies
-- ============================================
DROP POLICY IF EXISTS "Admin full access to assignments" ON project_assignments;
DROP POLICY IF EXISTS "Sales staff view own assignments" ON project_assignments;
DROP POLICY IF EXISTS "Service role full access to assignments" ON project_assignments;

CREATE POLICY "Admin full access to assignments"
ON project_assignments FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = (select auth.uid())
    AND users.role = 'admin'
  )
);

CREATE POLICY "Sales staff view own assignments"
ON project_assignments FOR SELECT
TO authenticated
USING (
  salesperson_id = (select auth.uid())
);

CREATE POLICY "Service role full access to assignments"
ON project_assignments FOR ALL
TO service_role
USING (true);

-- ============================================
-- VOUCHER_CODES - Optimized policies
-- ============================================
DROP POLICY IF EXISTS "Admin full access to vouchers" ON voucher_codes;
DROP POLICY IF EXISTS "Service role full access to vouchers" ON voucher_codes;

CREATE POLICY "Admin full access to vouchers"
ON voucher_codes FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = (select auth.uid())
    AND users.role = 'admin'
  )
);

CREATE POLICY "Service role full access to vouchers"
ON voucher_codes FOR ALL
TO service_role
USING (true);

-- ============================================
-- CUSTOMERS - Optimized policies
-- ============================================
DROP POLICY IF EXISTS "Admin full access to customers" ON customers;
DROP POLICY IF EXISTS "Sales staff view own customers" ON customers;
DROP POLICY IF EXISTS "Service role full access to customers" ON customers;

CREATE POLICY "Admin full access to customers"
ON customers FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = (select auth.uid())
    AND users.role = 'admin'
  )
);

CREATE POLICY "Sales staff view own customers"
ON customers FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = (select auth.uid())
    AND users.role = 'staff'
  )
  AND
  EXISTS (
    SELECT 1 FROM sales_transactions
    WHERE sales_transactions.customer_id = customers.id
    AND sales_transactions.salesperson_id = (select auth.uid())
  )
);

CREATE POLICY "Service role full access to customers"
ON customers FOR ALL
TO service_role
USING (true);

-- ============================================
-- SALES_TRANSACTIONS - Optimized policies
-- ============================================
DROP POLICY IF EXISTS "Admin full access to transactions" ON sales_transactions;
DROP POLICY IF EXISTS "Sales staff view own transactions" ON sales_transactions;
DROP POLICY IF EXISTS "Service role full access to transactions" ON sales_transactions;

CREATE POLICY "Admin full access to transactions"
ON sales_transactions FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = (select auth.uid())
    AND users.role = 'admin'
  )
);

CREATE POLICY "Sales staff view own transactions"
ON sales_transactions FOR SELECT
TO authenticated
USING (
  salesperson_id = (select auth.uid())
);

CREATE POLICY "Service role full access to transactions"
ON sales_transactions FOR ALL
TO service_role
USING (true);

-- ============================================
-- CUSTOMER_INTERACTIONS - Optimized policies
-- ============================================
DROP POLICY IF EXISTS "Admin full access to interactions" ON customer_interactions;
DROP POLICY IF EXISTS "Sales staff manage own interactions" ON customer_interactions;
DROP POLICY IF EXISTS "Service role full access to interactions" ON customer_interactions;

CREATE POLICY "Admin full access to interactions"
ON customer_interactions FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = (select auth.uid())
    AND users.role = 'admin'
  )
);

CREATE POLICY "Sales staff manage own interactions"
ON customer_interactions FOR ALL
TO authenticated
USING (
  salesperson_id = (select auth.uid())
);

CREATE POLICY "Service role full access to interactions"
ON customer_interactions FOR ALL
TO service_role
USING (true);

-- ============================================
-- SALES_TARGETS - Optimized policies
-- ============================================
DROP POLICY IF EXISTS "Admin full access to targets" ON sales_targets;
DROP POLICY IF EXISTS "Sales staff view own targets" ON sales_targets;
DROP POLICY IF EXISTS "Service role full access to targets" ON sales_targets;

CREATE POLICY "Admin full access to targets"
ON sales_targets FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = (select auth.uid())
    AND users.role = 'admin'
  )
);

CREATE POLICY "Sales staff view own targets"
ON sales_targets FOR SELECT
TO authenticated
USING (
  salesperson_id = (select auth.uid())
);

CREATE POLICY "Service role full access to targets"
ON sales_targets FOR ALL
TO service_role
USING (true);

-- ============================================
-- EMPLOYEE_IDS - Optimized policies
-- ============================================
DROP POLICY IF EXISTS "Admin full access to employee_ids" ON employee_ids;
DROP POLICY IF EXISTS "Staff view own employee_id" ON employee_ids;
DROP POLICY IF EXISTS "Service role full access to employee_ids" ON employee_ids;

CREATE POLICY "Admin full access to employee_ids"
ON employee_ids FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = (select auth.uid())
    AND users.role = 'admin'
  )
);

CREATE POLICY "Staff view own employee_id"
ON employee_ids FOR SELECT
TO authenticated
USING (
  used_by = (select auth.uid()) OR created_by = (select auth.uid())
);

CREATE POLICY "Service role full access to employee_ids"
ON employee_ids FOR ALL
TO service_role
USING (true);

-- ============================================
-- USERS - Optimized policies (existing table)
-- ============================================
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

CREATE POLICY "Users can read own data"
ON users FOR SELECT
TO authenticated
USING (id = (select auth.uid()) OR EXISTS (
  SELECT 1 FROM users u
  WHERE u.id = (select auth.uid())
  AND u.role = 'admin'
));

CREATE POLICY "Users can update own data"
ON users FOR UPDATE
TO authenticated
USING (id = (select auth.uid()));

-- ============================================
-- STAFF_PROFILES - Optimized policies (existing table)
-- ============================================
DROP POLICY IF EXISTS "Staff can read own profile" ON staff_profiles;

CREATE POLICY "Staff can read own profile"
ON staff_profiles FOR SELECT
TO authenticated
USING (user_id = (select auth.uid()) OR EXISTS (
  SELECT 1 FROM users
  WHERE users.id = (select auth.uid())
  AND users.role = 'admin'
));

-- ============================================
-- AFFILIATE_PROFILES - Optimized policies (existing table)
-- ============================================
DROP POLICY IF EXISTS "Affiliates can read own profile" ON affiliate_profiles;

CREATE POLICY "Affiliates can read own profile"
ON affiliate_profiles FOR SELECT
TO authenticated
USING (user_id = (select auth.uid()) OR EXISTS (
  SELECT 1 FROM users
  WHERE users.id = (select auth.uid())
  AND users.role = 'admin'
));

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- Optimized: 27 policies across 11 tables
-- Performance: auth.uid() now evaluated once per query instead of per row
-- Note: "Multiple permissive policies" warnings are expected and correct
--       They allow access through multiple paths (admin OR staff)
-- ============================================
