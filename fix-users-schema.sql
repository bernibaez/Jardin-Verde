-- Script actualizado para corregir el problema de vista existente
-- Ejecutar paso a paso si hay errores

-- 1. Primero eliminar la vista si existe (esto causa el error)
DROP VIEW IF EXISTS admin_users_view CASCADE;

-- 2. Eliminar políticas existentes
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- 3. Asegurarse de que la tabla profiles tenga la estructura correcta
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Crear políticas que funcionen correctamente con la tabla profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);

-- Política clave: Admins pueden ver todos los perfiles verificando el rol en la tabla profiles
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 5. Asegurarse de que el trigger para nuevos usuarios funcione correctamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuario'),
    'user'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Función auxiliar para verificar si un usuario es admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT role = 'admin' FROM profiles WHERE id = user_id;
$$;

-- 7. Verificar que los usuarios existentes tengan perfiles
INSERT INTO profiles (id, name, role)
SELECT 
  id, 
  COALESCE(raw_user_meta_data->>'name', email, 'Usuario'),
  'user'
FROM auth.users 
WHERE id NOT IN (SELECT id FROM profiles);

-- 8. Crear vista simplificada para administradores (SIN POLÍTICAS RLS)
CREATE OR REPLACE VIEW admin_users_view AS
SELECT 
  p.id,
  p.name,
  u.email,
  p.role,
  p.created_at,
  p.updated_at
FROM profiles p
JOIN auth.users u ON p.id = u.id;

-- 9. NO APLICAR POLÍTICAS RLS A LA VISTA - Las vistas no soportan RLS
-- En su lugar, creamos una función segura para obtener datos de admin

CREATE OR REPLACE FUNCTION get_all_users_for_admin()
RETURNS TABLE (
  id UUID,
  name TEXT,
  email TEXT,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  -- Solo ejecutar si el usuario actual es admin
  SELECT 
    p.id,
    p.name,
    u.email,
    p.role,
    p.created_at,
    p.updated_at
  FROM profiles p
  JOIN auth.users u ON p.id = u.id
  WHERE EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  );
$$;

-- 10. Dar permisos necesarios
GRANT SELECT ON admin_users_view TO authenticated;
GRANT SELECT ON admin_users_view TO service_role;
GRANT EXECUTE ON FUNCTION get_all_users_for_admin TO authenticated;

-- 11. Verificar administradores existentes
SELECT 'Current admins:' as info, id, name, role FROM profiles WHERE role = 'admin';

-- 12. Si necesitas crear un administrador, descomenta y ejecuta esta línea:
-- UPDATE profiles SET role = 'admin' WHERE id = 'REEMPLAZAR_CON_UUID_DEL_ADMIN';

-- 13. Verificar configuración final
SELECT 'Setup completed successfully' as status, COUNT(*) as total_users FROM profiles;
