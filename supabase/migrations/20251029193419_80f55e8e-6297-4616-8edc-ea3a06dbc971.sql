-- Fix function search paths for security

-- Fix handle_updated_at function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix generate_grievance_id function
CREATE OR REPLACE FUNCTION public.generate_grievance_id()
RETURNS TEXT AS $$
DECLARE
  new_id TEXT;
  year_suffix TEXT;
  counter INTEGER;
BEGIN
  year_suffix := TO_CHAR(NOW(), 'YY');
  
  SELECT COUNT(*) + 1 INTO counter
  FROM public.grievances
  WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW());
  
  new_id := 'G-' || year_suffix || '-' || LPAD(counter::TEXT, 4, '0');
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix set_grievance_id function
CREATE OR REPLACE FUNCTION public.set_grievance_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.grievance_id IS NULL OR NEW.grievance_id = '' THEN
    NEW.grievance_id := public.generate_grievance_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;