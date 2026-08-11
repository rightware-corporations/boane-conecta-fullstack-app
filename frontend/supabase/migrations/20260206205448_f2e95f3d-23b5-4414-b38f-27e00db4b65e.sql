
-- 1. Update handle_new_user to NOT auto-assign role (admin assigns manually)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    INSERT INTO public.profiles (user_id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$function$;

-- 2. Update news policies for editor+admin only
DROP POLICY IF EXISTS "Authenticated users can create news" ON public.news;
DROP POLICY IF EXISTS "Users can update their own news" ON public.news;
DROP POLICY IF EXISTS "Users can delete their own news" ON public.news;

CREATE POLICY "Editors and admins can create news"
ON public.news FOR INSERT
TO authenticated
WITH CHECK (
    has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role)
);

CREATE POLICY "Editors and admins can update news"
ON public.news FOR UPDATE
TO authenticated
USING (
    has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role)
);

CREATE POLICY "Editors and admins can delete news"
ON public.news FOR DELETE
TO authenticated
USING (
    has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role)
);

-- 3. Update services policies for funcionario+admin
DROP POLICY IF EXISTS "Editors and admins can insert services" ON public.services;
DROP POLICY IF EXISTS "Editors and admins can update services" ON public.services;
DROP POLICY IF EXISTS "Admins can delete services" ON public.services;

CREATE POLICY "Admin and funcionario can insert services"
ON public.services FOR INSERT
TO authenticated
WITH CHECK (
    has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'funcionario'::app_role)
);

CREATE POLICY "Admin and funcionario can update services"
ON public.services FOR UPDATE
TO authenticated
USING (
    has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'funcionario'::app_role)
);

CREATE POLICY "Only admin can delete services"
ON public.services FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 4. Update projects policies for gestor+admin
DROP POLICY IF EXISTS "Editors and admins can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Editors and admins can update projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can delete projects" ON public.projects;

CREATE POLICY "Admin and gestor can insert projects"
ON public.projects FOR INSERT
TO authenticated
WITH CHECK (
    has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'gestor'::app_role)
);

CREATE POLICY "Admin and gestor can update projects"
ON public.projects FOR UPDATE
TO authenticated
USING (
    has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'gestor'::app_role)
);

CREATE POLICY "Only admin can delete projects"
ON public.projects FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 5. Create service_requests table
CREATE TABLE public.service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    service_name TEXT NOT NULL,
    citizen_name TEXT NOT NULL,
    citizen_phone TEXT NOT NULL,
    citizen_email TEXT,
    citizen_nif TEXT,
    status TEXT NOT NULL DEFAULT 'pendente',
    payment_method TEXT,
    payment_status TEXT NOT NULL DEFAULT 'pendente',
    payment_reference TEXT UNIQUE,
    total_amount DECIMAL(10,2) NOT NULL,
    notes TEXT,
    processed_by UUID,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view service requests"
ON public.service_requests FOR SELECT
USING (true);

CREATE POLICY "Staff can update service requests"
ON public.service_requests FOR UPDATE
TO authenticated
USING (
    has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'funcionario'::app_role)
);

CREATE POLICY "Admin can delete service requests"
ON public.service_requests FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 6. Create payments table
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_request_id UUID REFERENCES public.service_requests(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'MZN',
    payment_method TEXT NOT NULL,
    provider_reference TEXT,
    phone_number TEXT,
    card_last_four TEXT,
    status TEXT NOT NULL DEFAULT 'pendente',
    error_message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view payments"
ON public.payments FOR SELECT
USING (true);

CREATE POLICY "Admin can delete payments"
ON public.payments FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 7. Triggers
CREATE TRIGGER update_service_requests_updated_at
BEFORE UPDATE ON public.service_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
