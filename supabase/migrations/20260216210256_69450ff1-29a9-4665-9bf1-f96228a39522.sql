
-- Table pour stocker plusieurs images par type de chambre
CREATE TABLE public.room_type_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_type_id UUID NOT NULL REFERENCES public.room_types(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index pour les requêtes fréquentes
CREATE INDEX idx_room_type_images_room_type_id ON public.room_type_images(room_type_id);

-- Enable RLS
ALTER TABLE public.room_type_images ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut voir les images
CREATE POLICY "Anyone can view room type images"
ON public.room_type_images
FOR SELECT
USING (true);

-- Les admins peuvent gérer les images
CREATE POLICY "Admins can manage room type images"
ON public.room_type_images
FOR ALL
USING (is_admin(auth.uid()));
