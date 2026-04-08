-- Script para crear vista de detalles de pedidos con nombre del cliente
-- Ejecutar este script en el editor SQL de Supabase

-- 1. Crear vista para detalles de pedidos con nombre del cliente
CREATE OR REPLACE VIEW admin_order_details_view AS
SELECT 
  o.id as order_id,
  o.user_id,
  p.name as customer_name,
  u.email as customer_email,
  o.status,
  o.total,
  o.shipping_address,
  o.created_at as order_date,
  o.updated_at as last_updated,
  -- Detalles de items del pedido
  json_agg(
    json_build_object(
      'product_id', oi.product_id,
      'product_name', pr.name,
      'quantity', oi.quantity,
      'price', oi.price,
      'subtotal', oi.quantity * oi.price
    )
  ) as items
FROM orders o
JOIN profiles p ON o.user_id = p.id
JOIN auth.users u ON p.id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN products pr ON oi.product_id = pr.id
GROUP BY o.id, o.user_id, p.name, u.email, o.status, o.total, o.shipping_address, o.created_at, o.updated_at;

-- 2. Crear función para verificar si es administrador
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  );
$$;

-- 3. Crear vista con seguridad a nivel de función
CREATE OR REPLACE VIEW admin_order_details_view AS
SELECT 
  o.id as order_id,
  o.user_id,
  p.name as customer_name,
  u.email as customer_email,
  o.status,
  o.total,
  o.shipping_address,
  o.created_at as order_date,
  o.updated_at as last_updated,
  -- Detalles de items del pedido
  json_agg(
    json_build_object(
      'product_id', oi.product_id,
      'product_name', pr.name,
      'quantity', oi.quantity,
      'price', oi.price,
      'subtotal', oi.quantity * oi.price
    )
  ) as items
FROM orders o
JOIN profiles p ON o.user_id = p.id
JOIN auth.users u ON p.id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN products pr ON oi.product_id = pr.id
WHERE is_admin_user()  -- Solo admins pueden ver los datos
GROUP BY o.id, o.user_id, p.name, u.email, o.status, o.total, o.shipping_address, o.created_at, o.updated_at;

-- 4. Dar permisos necesarios para la vista de pedidos
GRANT SELECT ON admin_order_details_view TO authenticated;
GRANT SELECT ON admin_order_details_view TO service_role;

-- 4. Verificar configuración
SELECT 'Admin order details view created successfully' as status;

-- Para probar la vista (ejecutar como administrador):
-- SELECT * FROM admin_order_details_view ORDER BY order_date DESC;
