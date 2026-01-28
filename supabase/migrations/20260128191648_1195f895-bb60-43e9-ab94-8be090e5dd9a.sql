-- Fix function search_path warnings
CREATE OR REPLACE FUNCTION public.generate_reservation_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_number TEXT;
BEGIN
  new_number := 'RES-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN new_number;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_reservation_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.reservation_number IS NULL THEN
    NEW.reservation_number := public.generate_reservation_number();
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix overly permissive INSERT policy for contact_messages
-- Drop the old policy and create a more restrictive one
DROP POLICY IF EXISTS "Anyone can send contact messages" ON public.contact_messages;

-- Create a policy that allows inserts only with required fields
CREATE POLICY "Public can send contact messages" ON public.contact_messages 
  FOR INSERT 
  WITH CHECK (
    name IS NOT NULL AND 
    name <> '' AND 
    email IS NOT NULL AND 
    email <> '' AND 
    message IS NOT NULL AND 
    message <> ''
  );