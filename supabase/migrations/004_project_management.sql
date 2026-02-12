-- ============================================
-- SASA Worldwide - Project Management System
-- Migration: 004_project_management
-- Description: Complete project management, CRM, and sales tracking tables
-- ============================================

-- ============================================
-- TABLE: projects
-- Description: Project management (CAFU vouchers, real estate, etc.)
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  project_type TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  price DECIMAL(12,2) NOT NULL,
  cost_of_goods DECIMAL(12,2) DEFAULT 0,
  commission_rate DECIMAL(5,2) DEFAULT 10.00,
  status TEXT CHECK (status IN ('draft', 'active', 'paused', 'completed')) DEFAULT 'draft',
  form_fields JSONB NOT NULL DEFAULT '[]',
  stripe_product_id TEXT,
  stripe_price_id TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by);

COMMENT ON TABLE projects IS 'Project management for sales projects (CAFU vouchers, real estate, etc.)';
COMMENT ON COLUMN projects.form_fields IS 'JSON array of form field definitions: [{name: "customer_name", type: "text", label: "Full Name", required: true}, ...]';

-- ============================================
-- TABLE: project_assignments
-- Description: Salesperson assignments to projects
-- ============================================
CREATE TABLE IF NOT EXISTS project_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  salesperson_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  form_url TEXT NOT NULL,
  qr_code_url TEXT,
  qr_code_data TEXT,
  stripe_checkout_url TEXT,
  status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  assigned_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(project_id, salesperson_id)
);

CREATE INDEX IF NOT EXISTS idx_project_assignments_project ON project_assignments(project_id);
CREATE INDEX IF NOT EXISTS idx_project_assignments_salesperson ON project_assignments(salesperson_id);
CREATE INDEX IF NOT EXISTS idx_project_assignments_form_url ON project_assignments(form_url);

COMMENT ON TABLE project_assignments IS 'Links salespeople to projects with auto-generated forms and QR codes';

-- ============================================
-- TABLE: voucher_codes
-- Description: Voucher inventory management
-- ============================================
CREATE TABLE IF NOT EXISTS voucher_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  code TEXT NOT NULL,
  status TEXT CHECK (status IN ('available', 'reserved', 'sold', 'expired')) DEFAULT 'available',
  reserved_at TIMESTAMPTZ,
  sold_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(project_id, code)
);

CREATE INDEX IF NOT EXISTS idx_voucher_codes_project ON voucher_codes(project_id);
CREATE INDEX IF NOT EXISTS idx_voucher_codes_status ON voucher_codes(status);
CREATE INDEX IF NOT EXISTS idx_voucher_codes_code ON voucher_codes(code);

COMMENT ON TABLE voucher_codes IS 'Inventory of voucher codes for projects (CSV uploaded by admin)';

-- ============================================
-- TABLE: customers
-- Description: CRM customer database
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  additional_info JSONB DEFAULT '{}',
  source TEXT,
  tags TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at);
CREATE INDEX IF NOT EXISTS idx_customers_tags ON customers USING GIN(tags);

COMMENT ON TABLE customers IS 'CRM customer database with contact details and custom fields';
COMMENT ON COLUMN customers.additional_info IS 'Flexible JSONB storage for project-specific custom fields';

-- ============================================
-- TABLE: sales_transactions
-- Description: Complete transaction records
-- ============================================
CREATE TABLE IF NOT EXISTS sales_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  salesperson_id UUID REFERENCES users(id) NOT NULL,
  customer_id UUID REFERENCES customers(id) NOT NULL,
  voucher_code_id UUID REFERENCES voucher_codes(id),

  -- Payment details
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_session_id TEXT,
  amount DECIMAL(12,2) NOT NULL,
  commission_rate DECIMAL(5,2) NOT NULL,
  commission_amount DECIMAL(12,2) GENERATED ALWAYS AS (amount * commission_rate / 100) STORED,

  -- Status tracking
  payment_status TEXT CHECK (payment_status IN ('pending', 'processing', 'succeeded', 'failed', 'refunded')) DEFAULT 'pending',
  fulfillment_status TEXT CHECK (fulfillment_status IN ('pending', 'email_sent', 'completed', 'failed')) DEFAULT 'pending',

  -- Customer form data
  form_data JSONB NOT NULL DEFAULT '{}',

  -- Timestamps
  payment_completed_at TIMESTAMPTZ,
  fulfillment_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sales_transactions_project ON sales_transactions(project_id);
CREATE INDEX IF NOT EXISTS idx_sales_transactions_salesperson ON sales_transactions(salesperson_id);
CREATE INDEX IF NOT EXISTS idx_sales_transactions_customer ON sales_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_transactions_payment_status ON sales_transactions(payment_status);
CREATE INDEX IF NOT EXISTS idx_sales_transactions_stripe_payment ON sales_transactions(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_sales_transactions_created_at ON sales_transactions(created_at);

COMMENT ON TABLE sales_transactions IS 'Complete transaction records linking projects, salespeople, customers, and vouchers';
COMMENT ON COLUMN sales_transactions.commission_amount IS 'Auto-calculated commission based on amount and rate';

-- ============================================
-- TABLE: customer_interactions
-- Description: CRM activity tracking
-- ============================================
CREATE TABLE IF NOT EXISTS customer_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id),
  salesperson_id UUID REFERENCES users(id),
  interaction_type TEXT CHECK (interaction_type IN ('call', 'email', 'meeting', 'form_submission', 'purchase', 'note', 'follow_up')) NOT NULL,
  subject TEXT,
  description TEXT,
  outcome TEXT,
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_interactions_customer ON customer_interactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_interactions_project ON customer_interactions(project_id);
CREATE INDEX IF NOT EXISTS idx_customer_interactions_salesperson ON customer_interactions(salesperson_id);
CREATE INDEX IF NOT EXISTS idx_customer_interactions_type ON customer_interactions(interaction_type);

COMMENT ON TABLE customer_interactions IS 'CRM interaction history (calls, meetings, notes, etc.)';

-- ============================================
-- TABLE: sales_targets
-- Description: Sales targets (optional for future)
-- ============================================
CREATE TABLE IF NOT EXISTS sales_targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  salesperson_id UUID REFERENCES users(id),
  target_type TEXT CHECK (target_type IN ('individual', 'team', 'project')) NOT NULL,
  target_period TEXT CHECK (target_period IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')) NOT NULL,
  target_value DECIMAL(12,2) NOT NULL,
  target_units INTEGER,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sales_targets_project ON sales_targets(project_id);
CREATE INDEX IF NOT EXISTS idx_sales_targets_salesperson ON sales_targets(salesperson_id);
CREATE INDEX IF NOT EXISTS idx_sales_targets_period ON sales_targets(period_start, period_end);

COMMENT ON TABLE sales_targets IS 'Sales targets for individuals, teams, or projects';
COMMENT ON COLUMN sales_targets.target_units IS 'For unit-based targets (e.g., vouchers sold)';

-- ============================================
-- FUNCTION: claim_next_available_voucher
-- Description: Atomic voucher claiming to prevent race conditions
-- ============================================
CREATE OR REPLACE FUNCTION claim_next_available_voucher(p_project_id UUID)
RETURNS TABLE (id UUID, code TEXT, project_id UUID) AS $$
  UPDATE voucher_codes
  SET status = 'sold', sold_at = NOW()
  WHERE id = (
    SELECT id FROM voucher_codes
    WHERE project_id = p_project_id
    AND status = 'available'
    ORDER BY created_at ASC
    LIMIT 1
    FOR UPDATE SKIP LOCKED
  )
  RETURNING voucher_codes.id, voucher_codes.code, voucher_codes.project_id;
$$ LANGUAGE SQL;

COMMENT ON FUNCTION claim_next_available_voucher IS 'Atomically claims next available voucher using row-level locking to prevent race conditions in Stripe webhooks';

-- ============================================
-- RLS (Row Level Security) - Future Enhancement
-- Note: Enable RLS when implementing fine-grained access control
-- ============================================

-- Example RLS policies (commented out for now):
-- ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Admin full access to projects" ON projects FOR ALL USING (auth.jwt()->>'role' = 'admin');
-- CREATE POLICY "Sales staff view assigned projects" ON projects FOR SELECT USING (
--   EXISTS (
--     SELECT 1 FROM project_assignments
--     WHERE project_assignments.project_id = projects.id
--     AND project_assignments.salesperson_id = auth.uid()
--   )
-- );

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- Tables created: 7
-- Indexes created: 24
-- Functions created: 1
-- Next steps:
-- 1. Verify tables in Supabase dashboard
-- 2. Test with sample data
-- 3. Configure Stripe webhook endpoint
-- ============================================
