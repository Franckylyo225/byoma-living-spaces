
-- Create a public storage bucket for room images
INSERT INTO storage.buckets (id, name, public) VALUES ('room-images', 'room-images', true);

-- Anyone can view room images (public bucket)
CREATE POLICY "Public can view room images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'room-images');

-- Admins can upload room images
CREATE POLICY "Admins can upload room images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'room-images' AND public.is_admin(auth.uid()));

-- Admins can update room images
CREATE POLICY "Admins can update room images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'room-images' AND public.is_admin(auth.uid()));

-- Admins can delete room images
CREATE POLICY "Admins can delete room images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'room-images' AND public.is_admin(auth.uid()));
