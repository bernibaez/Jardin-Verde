-- SQL function to create orders bypassing RLS policies
-- This function should be created in Supabase SQL editor

CREATE OR REPLACE FUNCTION create_order_as_admin(order_data jsonb)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  items jsonb,
  total numeric,
  status text,
  shipping_address jsonb,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Insert order directly, bypassing RLS
    RETURN QUERY
    INSERT INTO orders (
        id,
        user_id,
        items,
        total,
        status,
        shipping_address,
        created_at
    )
    VALUES (
        gen_random_uuid(),
        (order_data->>'user_id')::uuid,
        order_data->>'items',
        (order_data->>'total')::numeric,
        order_data->>'status',
        order_data->>'shipping_address',
        NOW()
    )
    RETURNING *;
END;
$$;

-- SQL function to create products bypassing RLS policies
CREATE OR REPLACE FUNCTION create_product_as_admin(product_data jsonb)
RETURNS TABLE (
  id uuid,
  name text,
  price numeric,
  category text,
  description text,
  image text,
  stock integer,
  rating numeric,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Insert product directly, bypassing RLS
    RETURN QUERY
    INSERT INTO products (
        id,
        name,
        price,
        category,
        description,
        image,
        stock,
        rating,
        created_at
    )
    VALUES (
        gen_random_uuid(),
        product_data->>'name',
        (product_data->>'price')::numeric,
        product_data->>'category',
        product_data->>'description',
        product_data->>'image',
        (product_data->>'stock')::integer,
        (product_data->>'rating')::numeric,
        NOW()
    )
    RETURNING *;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_order_as_admin TO authenticated;
GRANT EXECUTE ON FUNCTION create_order_as_admin TO service_role;

GRANT EXECUTE ON FUNCTION create_product_as_admin TO authenticated;
GRANT EXECUTE ON FUNCTION create_product_as_admin TO service_role;
