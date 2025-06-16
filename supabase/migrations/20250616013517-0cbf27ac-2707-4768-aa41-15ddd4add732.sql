
-- Create financial_transactions table for the main ledger
CREATE TABLE IF NOT EXISTS public.financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- 'dues', 'store', 'performance', 'fine', 'expense', 'other'
  subcategory TEXT,
  amount DECIMAL(10,2) NOT NULL, -- positive for income, negative for expenses
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('income', 'expense')),
  payment_method TEXT, -- 'cash', 'check', 'stripe', 'venmo', 'zelle', 'other'
  reference_id UUID, -- link to dues, orders, etc.
  reference_type TEXT, -- 'dues', 'order', 'manual'
  member_id UUID REFERENCES public.profiles(id),
  notes TEXT,
  receipt_url TEXT,
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_by UUID REFERENCES public.profiles(id),
  approved_by UUID REFERENCES public.profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Create financial_categories table for expense/income categorization
CREATE TABLE IF NOT EXISTS public.financial_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create financial_budgets table for budget tracking
CREATE TABLE IF NOT EXISTS public.financial_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  budgeted_amount DECIMAL(10,2) NOT NULL,
  academic_year TEXT NOT NULL, -- '2024-2025'
  semester TEXT, -- 'fall', 'spring', 'summer'
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default financial categories (only if they don't exist)
INSERT INTO public.financial_categories (name, type, description) 
SELECT name, type, description FROM (VALUES
  ('Dues', 'income', 'Member dues payments'),
  ('Store Sales', 'income', 'Merchandise store revenue'),
  ('Performance Cash', 'income', 'Cash collected at performances'),
  ('Donations', 'income', 'Donations and gifts'),
  ('Fundraising', 'income', 'Fundraising events and activities'),
  ('Fines', 'income', 'Member fines and penalties'),
  ('Travel', 'expense', 'Travel and transportation costs'),
  ('Meals', 'expense', 'Food and meal expenses'),
  ('Merchandise Costs', 'expense', 'Cost of goods sold for store'),
  ('Equipment', 'expense', 'Music equipment and supplies'),
  ('Venue Rental', 'expense', 'Performance venue costs'),
  ('Marketing', 'expense', 'Promotional materials and advertising'),
  ('Administrative', 'expense', 'General administrative costs')
) AS v(name, type, description)
WHERE NOT EXISTS (SELECT 1 FROM public.financial_categories WHERE financial_categories.name = v.name);

-- Enable RLS on all financial tables
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_budgets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for financial_transactions
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'financial_transactions' 
    AND policyname = 'Super admins and treasurers can manage financial transactions'
  ) THEN
    CREATE POLICY "Super admins and treasurers can manage financial transactions"
    ON public.financial_transactions
    FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND (
          is_super_admin = true 
          OR 'Treasurer' = ANY(role_tags)
          OR 'Chief of Staff' = ANY(role_tags)
        )
      )
    );
  END IF;
END $$;

-- RLS Policies for financial_categories
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'financial_categories' 
    AND policyname = 'Super admins and treasurers can manage financial categories'
  ) THEN
    CREATE POLICY "Super admins and treasurers can manage financial categories"
    ON public.financial_categories
    FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND (
          is_super_admin = true 
          OR 'Treasurer' = ANY(role_tags)
          OR 'Chief of Staff' = ANY(role_tags)
        )
      )
    );
  END IF;
END $$;

-- RLS Policies for financial_budgets
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'financial_budgets' 
    AND policyname = 'Super admins and treasurers can manage financial budgets'
  ) THEN
    CREATE POLICY "Super admins and treasurers can manage financial budgets"
    ON public.financial_budgets
    FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND (
          is_super_admin = true 
          OR 'Treasurer' = ANY(role_tags)
          OR 'Chief of Staff' = ANY(role_tags)
        )
      )
    );
  END IF;
END $$;

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_financial_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_financial_transactions_updated_at ON public.financial_transactions;

CREATE TRIGGER update_financial_transactions_updated_at
  BEFORE UPDATE ON public.financial_transactions
  FOR EACH ROW EXECUTE FUNCTION update_financial_updated_at();

-- Create function to automatically create transactions from dues payments
CREATE OR REPLACE FUNCTION create_transaction_from_dues()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create transaction if amount_paid increased
  IF (TG_OP = 'UPDATE' AND NEW.amount_paid > OLD.amount_paid) OR TG_OP = 'INSERT' THEN
    INSERT INTO public.financial_transactions (
      date,
      description,
      category,
      subcategory,
      amount,
      transaction_type,
      payment_method,
      reference_id,
      reference_type,
      member_id,
      created_by,
      status
    ) VALUES (
      COALESCE(NEW.date_paid, CURRENT_DATE),
      'Dues payment - ' || (SELECT first_name || ' ' || last_name FROM public.profiles WHERE id = NEW.member_id),
      'dues',
      'member_dues',
      CASE 
        WHEN TG_OP = 'INSERT' THEN NEW.amount_paid
        ELSE NEW.amount_paid - OLD.amount_paid
      END,
      'income',
      'unknown',
      NEW.id,
      'dues',
      NEW.member_id,
      auth.uid(),
      'approved'
    );
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS dues_payment_trigger ON public.dues;

CREATE TRIGGER dues_payment_trigger
  AFTER INSERT OR UPDATE ON public.dues
  FOR EACH ROW EXECUTE FUNCTION create_transaction_from_dues();

-- Create function to automatically create transactions from store orders
CREATE OR REPLACE FUNCTION create_transaction_from_order()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create transaction when order status changes to completed
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    INSERT INTO public.financial_transactions (
      date,
      description,
      category,
      subcategory,
      amount,
      transaction_type,
      payment_method,
      reference_id,
      reference_type,
      member_id,
      created_by,
      status
    ) VALUES (
      CURRENT_DATE,
      'Store order - ' || NEW.customer_name,
      'store',
      'merchandise_sales',
      NEW.amount / 100.0, -- Convert cents to dollars
      'income',
      'stripe',
      NEW.id,
      'order',
      NEW.user_id,
      auth.uid(),
      'approved'
    );
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS order_completion_trigger ON public.orders;

CREATE TRIGGER order_completion_trigger
  AFTER UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION create_transaction_from_order();
