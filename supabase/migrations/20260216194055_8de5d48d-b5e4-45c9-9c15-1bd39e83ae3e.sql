
-- Allow public (anonymous) users to create reservations
-- They don't need to be authenticated, just provide required fields
CREATE POLICY "Public can create reservations"
ON public.reservations
FOR INSERT
WITH CHECK (
  guest_id IS NOT NULL
  AND room_type_id IS NOT NULL
  AND check_in_date IS NOT NULL
  AND check_out_date IS NOT NULL
  AND check_out_date > check_in_date
);

-- Allow public to create guests (for the booking form)
CREATE POLICY "Public can create guests"
ON public.guests
FOR INSERT
WITH CHECK (
  first_name IS NOT NULL AND first_name <> ''
  AND last_name IS NOT NULL AND last_name <> ''
);

-- Create trigger for auto-generating reservation numbers if not exists
CREATE OR REPLACE TRIGGER set_reservation_number_trigger
BEFORE INSERT ON public.reservations
FOR EACH ROW
EXECUTE FUNCTION public.set_reservation_number();

-- Create trigger for updating updated_at on reservations
CREATE OR REPLACE TRIGGER update_reservations_updated_at
BEFORE UPDATE ON public.reservations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Create trigger for updating updated_at on room_types
CREATE OR REPLACE TRIGGER update_room_types_updated_at
BEFORE UPDATE ON public.room_types
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();
