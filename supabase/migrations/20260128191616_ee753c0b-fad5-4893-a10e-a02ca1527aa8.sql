-- =============================================
-- BYOMA Hotel Management System - Database Schema
-- =============================================

-- 1. CREATE ENUMS
CREATE TYPE public.app_role AS ENUM ('admin', 'employee');
CREATE TYPE public.department_type AS ENUM ('reception', 'restaurant', 'events');
CREATE TYPE public.room_status AS ENUM ('available', 'occupied', 'maintenance', 'cleaning');
CREATE TYPE public.reservation_status AS ENUM ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled');
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled');

-- 2. PROFILES TABLE (User roles and departments)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  role app_role NOT NULL DEFAULT 'employee',
  department department_type,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. USER ROLES TABLE (Separate table for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

-- 4. ROOM TYPES TABLE
CREATE TABLE public.room_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  capacity INTEGER NOT NULL DEFAULT 2,
  base_price DECIMAL(10,2) NOT NULL,
  amenities JSONB DEFAULT '[]'::jsonb,
  image_url TEXT,
  total_rooms INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. ROOMS TABLE
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_number TEXT NOT NULL UNIQUE,
  room_type_id UUID REFERENCES public.room_types(id) ON DELETE SET NULL,
  floor INTEGER DEFAULT 1,
  status room_status NOT NULL DEFAULT 'available',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. GUESTS TABLE
CREATE TABLE public.guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  id_type TEXT,
  id_number TEXT,
  nationality TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. RESERVATIONS TABLE
CREATE TABLE public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_number TEXT NOT NULL UNIQUE,
  guest_id UUID REFERENCES public.guests(id) ON DELETE SET NULL,
  room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
  room_type_id UUID REFERENCES public.room_types(id) ON DELETE SET NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  num_guests INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(10,2),
  status reservation_status NOT NULL DEFAULT 'pending',
  special_requests TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. MENU CATEGORIES TABLE
CREATE TABLE public.menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. MENU ITEMS TABLE
CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.menu_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  allergens TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. TABLE RESERVATIONS
CREATE TABLE public.table_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  guest_phone TEXT,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  num_guests INTEGER NOT NULL DEFAULT 2,
  table_number TEXT,
  status booking_status NOT NULL DEFAULT 'pending',
  special_requests TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. DAILY SPECIALS TABLE
CREATE TABLE public.daily_specials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. VENUES TABLE
CREATE TABLE public.venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  capacity INTEGER NOT NULL DEFAULT 100,
  hourly_rate DECIMAL(10,2),
  image_url TEXT,
  amenities JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 13. EVENTS TABLE
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID REFERENCES public.venues(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  ticket_price DECIMAL(10,2),
  capacity INTEGER NOT NULL DEFAULT 100,
  tickets_sold INTEGER DEFAULT 0,
  image_url TEXT,
  is_public BOOLEAN DEFAULT true,
  status booking_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 14. EVENT BOOKINGS TABLE
CREATE TABLE public.event_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  guest_phone TEXT,
  num_tickets INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(10,2),
  status booking_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 15. CONTACT MESSAGES TABLE
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  processed_by UUID REFERENCES auth.users(id),
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- HELPER FUNCTIONS (Security Definer)
-- =============================================

-- Check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin')
$$;

-- Get user department
CREATE OR REPLACE FUNCTION public.get_user_department(_user_id UUID)
RETURNS department_type
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT department FROM public.profiles WHERE user_id = _user_id LIMIT 1
$$;

-- Check if user is receptionist
CREATE OR REPLACE FUNCTION public.is_receptionist(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.get_user_department(_user_id) = 'reception' OR public.is_admin(_user_id)
$$;

-- Check if user is restaurant staff
CREATE OR REPLACE FUNCTION public.is_restaurant_staff(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.get_user_department(_user_id) = 'restaurant' OR public.is_admin(_user_id)
$$;

-- Check if user is event staff
CREATE OR REPLACE FUNCTION public.is_event_staff(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.get_user_department(_user_id) = 'events' OR public.is_admin(_user_id)
$$;

-- Check if user is any staff member
CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE user_id = _user_id
  )
$$;

-- Generate reservation number
CREATE OR REPLACE FUNCTION public.generate_reservation_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_number TEXT;
BEGIN
  new_number := 'RES-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN new_number;
END;
$$;

-- Auto-set reservation number trigger
CREATE OR REPLACE FUNCTION public.set_reservation_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.reservation_number IS NULL THEN
    NEW.reservation_number := public.generate_reservation_number();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER tr_set_reservation_number
  BEFORE INSERT ON public.reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.set_reservation_number();

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Apply update trigger to relevant tables
CREATE TRIGGER tr_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER tr_room_types_updated_at BEFORE UPDATE ON public.room_types FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER tr_rooms_updated_at BEFORE UPDATE ON public.rooms FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER tr_guests_updated_at BEFORE UPDATE ON public.guests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER tr_reservations_updated_at BEFORE UPDATE ON public.reservations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER tr_menu_items_updated_at BEFORE UPDATE ON public.menu_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER tr_table_reservations_updated_at BEFORE UPDATE ON public.table_reservations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER tr_venues_updated_at BEFORE UPDATE ON public.venues FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER tr_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER tr_event_bookings_updated_at BEFORE UPDATE ON public.event_bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =============================================
-- ENABLE RLS ON ALL TABLES
-- =============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.table_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_specials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES
-- =============================================

-- PROFILES
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Staff can view all profiles" ON public.profiles FOR SELECT USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins can insert profiles" ON public.profiles FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete profiles" ON public.profiles FOR DELETE USING (public.is_admin(auth.uid()));

-- USER ROLES
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.is_admin(auth.uid()));

-- ROOM TYPES (Public can view, staff can manage)
CREATE POLICY "Anyone can view room types" ON public.room_types FOR SELECT USING (true);
CREATE POLICY "Admins can manage room types" ON public.room_types FOR ALL USING (public.is_admin(auth.uid()));

-- ROOMS (Public can view, reception/admin can manage)
CREATE POLICY "Anyone can view rooms" ON public.rooms FOR SELECT USING (true);
CREATE POLICY "Admins can manage rooms" ON public.rooms FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Reception can update room status" ON public.rooms FOR UPDATE USING (public.is_receptionist(auth.uid()));

-- GUESTS (Staff can manage)
CREATE POLICY "Staff can view guests" ON public.guests FOR SELECT USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff can insert guests" ON public.guests FOR INSERT WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff can update guests" ON public.guests FOR UPDATE USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins can delete guests" ON public.guests FOR DELETE USING (public.is_admin(auth.uid()));

-- RESERVATIONS (Reception/admin can manage)
CREATE POLICY "Staff can view reservations" ON public.reservations FOR SELECT USING (public.is_staff(auth.uid()));
CREATE POLICY "Reception can create reservations" ON public.reservations FOR INSERT WITH CHECK (public.is_receptionist(auth.uid()));
CREATE POLICY "Reception can update reservations" ON public.reservations FOR UPDATE USING (public.is_receptionist(auth.uid()));
CREATE POLICY "Admins can delete reservations" ON public.reservations FOR DELETE USING (public.is_admin(auth.uid()));

-- MENU CATEGORIES (Public can view, restaurant staff can manage)
CREATE POLICY "Anyone can view menu categories" ON public.menu_categories FOR SELECT USING (true);
CREATE POLICY "Restaurant staff can manage categories" ON public.menu_categories FOR ALL USING (public.is_restaurant_staff(auth.uid()));

-- MENU ITEMS (Public can view, restaurant staff can manage)
CREATE POLICY "Anyone can view menu items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Restaurant staff can manage items" ON public.menu_items FOR ALL USING (public.is_restaurant_staff(auth.uid()));

-- TABLE RESERVATIONS (Restaurant staff can manage)
CREATE POLICY "Restaurant staff can view table reservations" ON public.table_reservations FOR SELECT USING (public.is_restaurant_staff(auth.uid()) OR public.is_receptionist(auth.uid()));
CREATE POLICY "Restaurant staff can manage table reservations" ON public.table_reservations FOR ALL USING (public.is_restaurant_staff(auth.uid()));

-- DAILY SPECIALS (Public can view, restaurant staff can manage)
CREATE POLICY "Anyone can view daily specials" ON public.daily_specials FOR SELECT USING (true);
CREATE POLICY "Restaurant staff can manage specials" ON public.daily_specials FOR ALL USING (public.is_restaurant_staff(auth.uid()));

-- VENUES (Public can view, event staff can manage)
CREATE POLICY "Anyone can view venues" ON public.venues FOR SELECT USING (true);
CREATE POLICY "Event staff can manage venues" ON public.venues FOR ALL USING (public.is_event_staff(auth.uid()));

-- EVENTS (Public can view public events, event staff can manage)
CREATE POLICY "Anyone can view public events" ON public.events FOR SELECT USING (is_public = true OR public.is_staff(auth.uid()));
CREATE POLICY "Event staff can manage events" ON public.events FOR ALL USING (public.is_event_staff(auth.uid()));

-- EVENT BOOKINGS (Event staff can manage)
CREATE POLICY "Event staff can view bookings" ON public.event_bookings FOR SELECT USING (public.is_event_staff(auth.uid()) OR public.is_receptionist(auth.uid()));
CREATE POLICY "Event staff can manage bookings" ON public.event_bookings FOR ALL USING (public.is_event_staff(auth.uid()));

-- CONTACT MESSAGES (Anyone can insert, staff can view/manage)
CREATE POLICY "Anyone can send contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff can view messages" ON public.contact_messages FOR SELECT USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff can update messages" ON public.contact_messages FOR UPDATE USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins can delete messages" ON public.contact_messages FOR DELETE USING (public.is_admin(auth.uid()));

-- =============================================
-- INSERT DEFAULT DATA
-- =============================================

-- Insert room types
INSERT INTO public.room_types (name, description, capacity, base_price, total_rooms, amenities) VALUES
('Standard', 'Un espace confortable et fonctionnel, idéal pour un séjour reposant.', 2, 35000, 10, '["Lit Double", "Climatisation", "TV Écran Plat", "WiFi", "Salle de bain privée"]'::jsonb),
('Premium', 'Un cadre élégant avec finitions haut de gamme et espace bureau.', 2, 55000, 10, '["Lit King Size", "Smart TV", "Coin bureau", "Mini-bar", "WiFi haut débit", "Room service"]'::jsonb),
('Suite', 'Notre offre premium avec salon séparé et cuisine équipée.', 4, 85000, 4, '["Salon privé", "Cuisine équipée", "Bar américain", "Vue panoramique", "Jacuzzi", "Service VIP"]'::jsonb);

-- Insert menu categories
INSERT INTO public.menu_categories (name, description, display_order) VALUES
('Entrées', 'Nos entrées raffinées pour ouvrir votre appétit', 1),
('Plats', 'Plats principaux préparés avec des ingrédients frais', 2),
('Desserts', 'Douceurs sucrées pour terminer en beauté', 3),
('Boissons', 'Cocktails, vins et boissons fraîches', 4);

-- Insert default venue
INSERT INTO public.venues (name, description, capacity, hourly_rate) VALUES
('Salle de Spectacle BYOMA', 'Un espace modulable et prestigieux pour vos événements les plus exceptionnels.', 500, 150000);