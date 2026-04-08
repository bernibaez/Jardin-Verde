-- Script para crear sistema de categorías de productos
-- Ejecutar en el editor SQL de Supabase

-- 1. Crear tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  slug TEXT NOT NULL UNIQUE,
  image TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crear función para generar slug automáticamente
CREATE OR REPLACE FUNCTION create_slug(category_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN LOWER(REGEXP_REPLACE(category_name, '[^a-zA-Z0-9\s]', '', 'g'));
END;
$$;

-- 3. Trigger para generar slug automáticamente
CREATE OR REPLACE FUNCTION generate_category_slug()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := create_slug(NEW.name);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER category_slug_trigger
  BEFORE INSERT OR UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION generate_category_slug();

-- 4. Modificar tabla products para usar foreign key a categorías
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL;

-- 5. Migrar datos existentes de category (texto) a category_id
DO $$
DECLARE
  category_record RECORD;
BEGIN
  -- Crear categorías base si no existen
  INSERT INTO categories (name, description, slug) VALUES
    ('Plantas', 'Todo tipo de plantas para interior y exterior', 'plantas'),
    ('Cactus', 'Cactus y suculentas de diversas especies', 'cactus'),
    ('Macetas', 'Macetas y contenedores para plantas', 'macetas'),
    ('Sustratos', 'Tierras y sustratos para cultivo', 'sustratos'),
    ('Fertilizantes', 'Nutrientes y fertilizantes para plantas', 'fertilizantes'),
    ('Herramientas', 'Herramientas de jardinería y mantenimiento', 'herramientas')
  ON CONFLICT (name) DO NOTHING;

  -- Actualizar productos existentes para que apunten a las nuevas categorías
  FOR category_record IN 
    SELECT name, slug FROM categories 
    WHERE slug IN ('plantas', 'cactus', 'macetas', 'sustratos', 'fertilizantes', 'herramientas')
  LOOP
    UPDATE products 
    SET category_id = (
      SELECT id FROM categories WHERE slug = category_record.slug
    )
    WHERE LOWER(category) = category_record.slug;
  END LOOP;
END $$;

-- 6. Políticas RLS para categorías
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Lectura pública para todos
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (is_active = true);

-- Solo admins pueden crear/actualizar/eliminar categorías
CREATE POLICY "Only admins can insert categories" ON categories FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Only admins can update categories" ON categories FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Only admins can delete categories" ON categories FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- 7. Vista para administración de categorías
CREATE OR REPLACE VIEW admin_categories_view AS
SELECT 
  c.id,
  c.name,
  c.description,
  c.slug,
  c.image,
  c.is_active,
  c.sort_order,
  c.created_at,
  c.updated_at,
  -- Contar cuántos productos usan esta categoría
  (SELECT COUNT(*) FROM products WHERE category_id = c.id) as product_count
FROM categories c
ORDER BY c.sort_order, c.name;

-- 8. Vista para productos con información de categoría
CREATE OR REPLACE VIEW products_with_categories_view AS
SELECT 
  p.id,
  p.name,
  p.description,
  p.price,
  p.image,
  p.rating,
  p.stock,
  p.created_at,
  p.updated_at,
  -- Información de categoría
  COALESCE(c.name, 'Sin categoría') as category_name,
  COALESCE(c.slug, 'sin-categoria') as category_slug,
  c.id as category_id
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE c.is_active = true OR c.id IS NULL;

ministrador):
-- SELECT * FROM admin_categories_view ORDER BY name;
-- SELECT * FROM get_active_categories();
-- SELECT * FROM products_with_categories_view LIMIT 10;-- 9. Trigger para actualizar timestamps en categorías
CREATE TRIGGER update_categories_updated_at 
  BEFORE UPDATE ON categories 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 10. Dar permisos
GRANT SELECT ON categories TO authenticated;
GRANT SELECT ON categories TO anon;
GRANT SELECT ON admin_categories_view TO authenticated;
GRANT SELECT ON admin_categories_view TO service_role;
GRANT SELECT ON products_with_categories_view TO authenticated;
GRANT SELECT ON products_with_categories_view TO anon;

-- 11. Función para obtener categorías activas (para filtros)
CREATE OR REPLACE FUNCTION get_active_categories()
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  product_count BIGINT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    c.id,
    c.name,
    c.slug,
    (SELECT COUNT(*) FROM products WHERE category_id = c.id) as product_count
  FROM categories c
  WHERE c.is_active = true
  ORDER BY c.sort_order, c.name;
$$;

-- 12. Verificación
SELECT 'Categories system created successfully' as status;


