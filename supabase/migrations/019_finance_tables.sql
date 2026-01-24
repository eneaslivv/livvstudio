-- ============================================
-- LIVV STUDIO - PHASE 1: FINANCE TABLES
-- Migration: 019_finance_tables.sql
-- ============================================
-- Run this in: Supabase SQL Editor
-- Purpose: Create invoices, invoice_items, and expenses tables
-- ============================================

-- 1. INVOICES TABLE
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  paid_amount DECIMAL(10,2) DEFAULT 0,
  paid_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. INVOICE ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. EXPENSES TABLE
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category TEXT CHECK (category IN ('software', 'hardware', 'marketing', 'office', 'travel', 'salary', 'other')),
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  vendor TEXT,
  receipt_url TEXT,
  is_billable BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_project_id ON invoices(project_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_expenses_project_id ON expenses(project_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date DESC);

-- 5. ENABLE RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- 6. PERMISSIVE POLICIES (Development - tighten for production)
DROP POLICY IF EXISTS "Allow all for anon" ON invoices;
DROP POLICY IF EXISTS "Allow all for anon" ON invoice_items;
DROP POLICY IF EXISTS "Allow all for anon" ON expenses;

CREATE POLICY "Allow all for anon" ON invoices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON invoice_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON expenses FOR ALL USING (true) WITH CHECK (true);

-- 7. GRANT PERMISSIONS
GRANT ALL ON public.invoices TO anon, authenticated, service_role;
GRANT ALL ON public.invoice_items TO anon, authenticated, service_role;
GRANT ALL ON public.expenses TO anon, authenticated, service_role;

-- 8. UPDATED_AT TRIGGERS
DROP TRIGGER IF EXISTS trigger_invoices_updated_at ON invoices;
CREATE TRIGGER trigger_invoices_updated_at BEFORE UPDATE ON invoices 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_expenses_updated_at ON expenses;
CREATE TRIGGER trigger_expenses_updated_at BEFORE UPDATE ON expenses 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. AUTO-CALCULATE INVOICE TOTALS
CREATE OR REPLACE FUNCTION calculate_invoice_total()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE invoices SET
    subtotal = (SELECT COALESCE(SUM(amount), 0) FROM invoice_items WHERE invoice_id = COALESCE(NEW.invoice_id, OLD.invoice_id)),
    total = subtotal + COALESCE(tax, 0)
  WHERE id = COALESCE(NEW.invoice_id, OLD.invoice_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_invoice_items_total ON invoice_items;
CREATE TRIGGER trigger_invoice_items_total AFTER INSERT OR UPDATE OR DELETE ON invoice_items
  FOR EACH ROW EXECUTE FUNCTION calculate_invoice_total();

-- 10. REFRESH SCHEMA CACHE
NOTIFY pgrst, 'reload schema';

-- ============================================
-- DONE - Finance tables created!
-- ============================================
DO $$
BEGIN
  RAISE NOTICE 'Finance tables (invoices, invoice_items, expenses) created successfully!';
END $$;
