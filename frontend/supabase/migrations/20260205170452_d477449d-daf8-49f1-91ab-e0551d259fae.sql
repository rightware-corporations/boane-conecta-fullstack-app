-- Drop overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can manage services" ON public.services;
DROP POLICY IF EXISTS "Authenticated users can manage projects" ON public.projects;

-- Create proper role-based policies for services
CREATE POLICY "Editors and admins can insert services"
ON public.services FOR INSERT
TO authenticated
WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')
);

CREATE POLICY "Editors and admins can update services"
ON public.services FOR UPDATE
TO authenticated
USING (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')
);

CREATE POLICY "Admins can delete services"
ON public.services FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create proper role-based policies for projects
CREATE POLICY "Editors and admins can insert projects"
ON public.projects FOR INSERT
TO authenticated
WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')
);

CREATE POLICY "Editors and admins can update projects"
ON public.projects FOR UPDATE
TO authenticated
USING (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')
);

CREATE POLICY "Admins can delete projects"
ON public.projects FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));