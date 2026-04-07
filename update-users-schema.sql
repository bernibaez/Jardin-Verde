-- Actualizar esquema para soportar usuarios registrados correctamente

-- 1. Asegurarse de que la tabla profiles tenga la estructura correcta
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Eliminar políticas existentes y recrearlas correctamente
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- 3. Crear políticas que funcionen correctamente con la tabla profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);

-- Política clave: Admins pueden ver todos los perfiles verificando el rol en la tabla profiles
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 4. Asegurarse de que el trigger para nuevos usuarios funcione correctamente
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

-- 5. Función auxiliar para verificar si un usuario es admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT role = 'admin' FROM profiles WHERE id = user_id;
$$;

-- 6. Verificar que los usuarios existentes tengan perfiles
INSERT INTO profiles (id, name, role)
SELECT 
  id, 
  COALESCE(raw_user_meta_data->>'name', email, 'Usuario'),
  'user'
FROM auth.users 
WHERE id NOT IN (SELECT id FROM profiles);

-- 7. Crear vista simplificada para administradores
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

-- 8. Políticas para la vista de administradores
DROP POLICY IF EXISTS "Admin view policy" ON admin_users_view;
CREATE POLICY "Admin view policy" ON admin_users_view FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- 9. Dar permisos necesarios
GRANT SELECT ON admin_users_view TO authenticated;
GRANT SELECT ON admin_users_view TO service_role;

-- 10. Crear primer administrador (descomenta y reemplaza el UUID)
-- UPDATE profiles SET role = 'admin' WHERE id = 'REEMPLAZAR_CON_UUID_DEL_ADMIN';

-- 11. Verificar configuración
SELECT 'Policies configured successfully' as status;
