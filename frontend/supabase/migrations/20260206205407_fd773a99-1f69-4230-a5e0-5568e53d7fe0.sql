
-- Step 1: Add new roles to the enum only
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'funcionario';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'gestor';
