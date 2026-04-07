-- Actualizar esquema para soportar usuarios registrados correctamente

-- 1. Asegurarse de que la tabla profiles tenga la estructura correcta
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Actualizar políticas de seguridad para profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 3. Asegurarse de que el trigger para nuevos usuarios funcione correctamente
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

-- 4. Crear función para obtener email del usuario (para consultas admin)
CREATE OR REPLACE FUNCTION get_user_email(user_id UUID)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT email FROM auth.users WHERE id = user_id;
$$;

-- 5. Dar permisos de administrador al primer usuario (si es necesario)
-- Esto debe ejecutarse manualmente con el ID del primer usuario admin
-- UPDATE profiles SET role = 'admin' WHERE id = 'USER_UUID_HERE';

-- 6. Verificar que los usuarios existentes tengan perfiles
INSERT INTO profiles (id, name, role)
SELECT 
  id, 
  COALESCE(raw_user_meta_data->>'name', email, 'Usuario'),
  'user'
FROM auth.users 
WHERE id NOT IN (SELECT id FROM profiles);

-- 7. Crear vista para facilitar la consulta de usuarios con emails
CREATE OR REPLACE VIEW admin_users_view AS
SELECT 
  p.id,
  p.name,
  u.email,
  p.role,
  p.created_at,
  p.updated_at,
  u.last_sign_in_at
FROM profiles p
JOIN auth.users u ON p.id = u.id;

-- 8. Dar permisos a administradores para ver la vista
GRANT SELECT ON admin_users_view TO authenticated;
GRANT SELECT ON admin_users_view TO service_role;
