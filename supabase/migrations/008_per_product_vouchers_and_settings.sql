-- ============================================
-- Migration 008: Per-Product Vouchers + App Settings
-- ============================================

-- 1. Add product_name column to voucher_codes
ALTER TABLE voucher_codes ADD COLUMN IF NOT EXISTS product_name TEXT;
CREATE INDEX IF NOT EXISTS idx_voucher_codes_product ON voucher_codes(project_id, product_name, status);

-- 2. Update claim function to filter by product (backwards compatible)
CREATE OR REPLACE FUNCTION claim_next_available_voucher(
  p_project_id UUID, p_product_name TEXT DEFAULT NULL
)
RETURNS TABLE (id UUID, code TEXT, project_id UUID)
LANGUAGE SQL SECURITY DEFINER SET search_path = public, pg_temp
AS $$
  UPDATE voucher_codes SET status = 'sold', sold_at = NOW()
  WHERE voucher_codes.id = (
    SELECT vc.id FROM voucher_codes vc
    WHERE vc.project_id = p_project_id AND vc.status = 'available'
    AND (p_product_name IS NULL OR vc.product_name = p_product_name)
    ORDER BY vc.created_at ASC LIMIT 1 FOR UPDATE SKIP LOCKED
  )
  RETURNING voucher_codes.id, voucher_codes.code, voucher_codes.project_id;
$$;

-- 3. App settings table for Stripe mode etc.
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES users(id)
);
INSERT INTO app_settings (key, value) VALUES ('stripe_mode', 'live') ON CONFLICT DO NOTHING;
