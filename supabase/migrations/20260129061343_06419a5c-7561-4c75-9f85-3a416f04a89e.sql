-- Create enums for room and booking management
CREATE TYPE public.room_type AS ENUM ('standard', 'deluxe', 'suite', 'executive');
CREATE TYPE public.room_status AS ENUM ('available', 'occupied', 'reserved', 'maintenance', 'cleaning');
CREATE TYPE public.guest_type AS ENUM ('individual', 'corporate', 'vip', 'group');
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled');

-- Create rooms table
CREATE TABLE public.rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_number TEXT NOT NULL UNIQUE,
  room_type public.room_type NOT NULL DEFAULT 'standard',
  floor INTEGER NOT NULL DEFAULT 1,
  base_rate DECIMAL(10,2) NOT NULL DEFAULT 0,
  status public.room_status NOT NULL DEFAULT 'available',
  amenities TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create guests table
CREATE TABLE public.guests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  id_type TEXT,
  id_number TEXT,
  guest_type public.guest_type NOT NULL DEFAULT 'individual',
  address TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_ref TEXT NOT NULL UNIQUE,
  room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
  guest_id UUID REFERENCES public.guests(id) ON DELETE SET NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  status public.booking_status NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  amount_paid DECIMAL(10,2) NOT NULL DEFAULT 0,
  adults INTEGER NOT NULL DEFAULT 1,
  children INTEGER NOT NULL DEFAULT 0,
  special_requests TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create helper function for reception access
CREATE OR REPLACE FUNCTION public.has_reception_access(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('manager', 'reception')
  )
$$;

-- RLS Policies for rooms
CREATE POLICY "Staff with reception access can view rooms"
  ON public.rooms FOR SELECT
  USING (has_reception_access(auth.uid()) OR is_manager(auth.uid()));

CREATE POLICY "Staff with reception access can manage rooms"
  ON public.rooms FOR ALL
  USING (has_reception_access(auth.uid()) OR is_manager(auth.uid()));

-- RLS Policies for guests
CREATE POLICY "Staff with reception access can view guests"
  ON public.guests FOR SELECT
  USING (has_reception_access(auth.uid()) OR is_manager(auth.uid()));

CREATE POLICY "Staff with reception access can manage guests"
  ON public.guests FOR ALL
  USING (has_reception_access(auth.uid()) OR is_manager(auth.uid()));

-- RLS Policies for bookings
CREATE POLICY "Staff with reception access can view bookings"
  ON public.bookings FOR SELECT
  USING (has_reception_access(auth.uid()) OR is_manager(auth.uid()));

CREATE POLICY "Staff with reception access can manage bookings"
  ON public.bookings FOR ALL
  USING (has_reception_access(auth.uid()) OR is_manager(auth.uid()));

-- Create triggers for updated_at
CREATE TRIGGER update_rooms_updated_at
  BEFORE UPDATE ON public.rooms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_guests_updated_at
  BEFORE UPDATE ON public.guests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate booking reference
CREATE OR REPLACE FUNCTION public.generate_booking_ref()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.booking_ref := 'VPH-' || TO_CHAR(NOW(), 'YYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_booking_ref
  BEFORE INSERT ON public.bookings
  FOR EACH ROW
  WHEN (NEW.booking_ref IS NULL OR NEW.booking_ref = '')
  EXECUTE FUNCTION public.generate_booking_ref();

-- Seed initial rooms data
INSERT INTO public.rooms (room_number, room_type, floor, base_rate, status, amenities) VALUES
  ('101', 'standard', 1, 85.00, 'available', ARRAY['WiFi', 'TV', 'AC']),
  ('102', 'standard', 1, 85.00, 'occupied', ARRAY['WiFi', 'TV', 'AC']),
  ('103', 'deluxe', 1, 120.00, 'reserved', ARRAY['WiFi', 'TV', 'AC', 'Mini Bar']),
  ('104', 'deluxe', 1, 120.00, 'occupied', ARRAY['WiFi', 'TV', 'AC', 'Mini Bar']),
  ('105', 'suite', 1, 200.00, 'available', ARRAY['WiFi', 'TV', 'AC', 'Mini Bar', 'Jacuzzi']),
  ('106', 'standard', 1, 85.00, 'maintenance', ARRAY['WiFi', 'TV', 'AC']),
  ('201', 'deluxe', 2, 120.00, 'occupied', ARRAY['WiFi', 'TV', 'AC', 'Mini Bar', 'Balcony']),
  ('202', 'suite', 2, 200.00, 'available', ARRAY['WiFi', 'TV', 'AC', 'Mini Bar', 'Jacuzzi', 'Balcony']),
  ('203', 'standard', 2, 85.00, 'reserved', ARRAY['WiFi', 'TV', 'AC']),
  ('204', 'executive', 2, 300.00, 'occupied', ARRAY['WiFi', 'TV', 'AC', 'Mini Bar', 'Jacuzzi', 'Balcony', 'Living Room']),
  ('205', 'suite', 2, 200.00, 'available', ARRAY['WiFi', 'TV', 'AC', 'Mini Bar', 'Jacuzzi']),
  ('206', 'standard', 2, 85.00, 'cleaning', ARRAY['WiFi', 'TV', 'AC']),
  ('301', 'executive', 3, 300.00, 'available', ARRAY['WiFi', 'TV', 'AC', 'Mini Bar', 'Jacuzzi', 'Balcony', 'Living Room']),
  ('302', 'executive', 3, 350.00, 'reserved', ARRAY['WiFi', 'TV', 'AC', 'Mini Bar', 'Jacuzzi', 'Balcony', 'Living Room', 'Kitchen']);