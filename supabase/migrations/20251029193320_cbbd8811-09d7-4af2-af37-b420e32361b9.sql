-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('student', 'faculty', 'admin');

-- Create enum for grievance status
CREATE TYPE public.grievance_status AS ENUM ('submitted', 'in_progress', 'resolved', 'closed');

-- Create enum for grievance categories
CREATE TYPE public.grievance_category AS ENUM ('academic', 'facility', 'examination', 'placement', 'other');

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  user_id_number TEXT NOT NULL, -- Student ID, Faculty ID, or Admin ID
  department TEXT,
  role user_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create grievances table
CREATE TABLE public.grievances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grievance_id TEXT NOT NULL UNIQUE, -- User-friendly ID like 'G-2025-001'
  submitted_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category grievance_category NOT NULL,
  sub_category TEXT NOT NULL,
  status grievance_status NOT NULL DEFAULT 'submitted',
  details JSONB NOT NULL DEFAULT '{}', -- Category-specific fields
  assigned_to UUID REFERENCES public.profiles(id),
  resolution_comments TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on grievances
ALTER TABLE public.grievances ENABLE ROW LEVEL SECURITY;

-- Grievances policies for students and faculty
CREATE POLICY "Users can view their own grievances"
  ON public.grievances FOR SELECT
  USING (auth.uid() = submitted_by);

CREATE POLICY "Users can create their own grievances"
  ON public.grievances FOR INSERT
  WITH CHECK (auth.uid() = submitted_by);

-- Grievances policies for admins (view and update all grievances)
CREATE POLICY "Admins can view all grievances"
  ON public.grievances FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all grievances"
  ON public.grievances FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_grievances_updated_at
  BEFORE UPDATE ON public.grievances
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function to generate unique grievance IDs
CREATE OR REPLACE FUNCTION public.generate_grievance_id()
RETURNS TEXT AS $$
DECLARE
  new_id TEXT;
  year_suffix TEXT;
  counter INTEGER;
BEGIN
  year_suffix := TO_CHAR(NOW(), 'YY');
  
  -- Get the count of grievances this year
  SELECT COUNT(*) + 1 INTO counter
  FROM public.grievances
  WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW());
  
  new_id := 'G-' || year_suffix || '-' || LPAD(counter::TEXT, 4, '0');
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate grievance_id
CREATE OR REPLACE FUNCTION public.set_grievance_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.grievance_id IS NULL OR NEW.grievance_id = '' THEN
    NEW.grievance_id := public.generate_grievance_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_grievance_id_trigger
  BEFORE INSERT ON public.grievances
  FOR EACH ROW
  EXECUTE FUNCTION public.set_grievance_id();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, user_id_number, department, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'user_id_number', ''),
    COALESCE(NEW.raw_user_meta_data->>'department', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();