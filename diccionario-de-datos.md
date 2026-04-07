# Diccionario de Datos - Jardín Verde

## Base de Datos: PostgreSQL (Supabase)
**Fecha de Creación:** 1 de abril de 2026
**Descripción:** Base de datos para la aplicación de e-commerce "Jardín Verde" dedicada a la venta de plantas y productos de jardinería.

---

## Tabla: `products`

**Descripción:** Almacena información sobre los productos disponibles para venta en la tienda.
**Fecha de Creación:** 1 de abril de 2026
**Campo Clave:** `id` (UUID)

| Campo | Tipo de Datos | Tamaño | Descripción | Restricciones | Propagación |
|-------|---------------|--------|-------------|---------------|-------------|
| `id` | UUID | 36 bytes | Identificador único del producto | PRIMARY KEY, NOT NULL | No aplica |
| `name` | TEXT | Variable | Nombre del producto | NOT NULL | No aplica |
| `description` | TEXT | Variable | Descripción detallada del producto | NULL | No aplica |
| `price` | DECIMAL(10,2) | 10 dígitos (2 decimales) | Precio del producto | NOT NULL | No aplica |
| `image` | TEXT | Variable | URL de la imagen del producto | NULL | No aplica |
| `category` | TEXT | Variable | Categoría del producto | NOT NULL | No aplica |
| `rating` | DECIMAL(3,2) | 3 dígitos (2 decimales) | Calificación promedio del producto | DEFAULT 0 | No aplica |
| `stock` | INTEGER | 4 bytes | Cantidad disponible en inventario | DEFAULT 0 | No aplica |
| `created_at` | TIMESTAMP WITH TIME ZONE | 8 bytes | Fecha y hora de creación | DEFAULT NOW() | No aplica |
| `updated_at` | TIMESTAMP WITH TIME ZONE | 8 bytes | Fecha y hora de última actualización | DEFAULT NOW() | No aplica |

**Relaciones:**
- No tiene relaciones directas (es una tabla independiente)
- Referenciada por: `order_items.product_id`

**Restricciones Adicionales:**
- Row Level Security (RLS) habilitado
- Políticas de seguridad: Lectura pública, solo administradores pueden modificar

---

## Tabla: `profiles`

**Descripción:** Extiende la información de usuarios de autenticación de Supabase con datos adicionales del perfil.
**Fecha de Creación:** 1 de abril de 2026
**Campo Clave:** `id` (UUID)

| Campo | Tipo de Datos | Tamaño | Descripción | Restricciones | Propagación |
|-------|---------------|--------|-------------|---------------|-------------|
| `id` | UUID | 36 bytes | ID del usuario (referencia a auth.users) | PRIMARY KEY, NOT NULL | CASCADE |
| `name` | TEXT | Variable | Nombre completo del usuario | NOT NULL | No aplica |
| `role` | TEXT | Variable | Rol del usuario en el sistema | DEFAULT 'user', CHECK IN ('user','admin') | No aplica |
| `created_at` | TIMESTAMP WITH TIME ZONE | 8 bytes | Fecha y hora de creación | DEFAULT NOW() | No aplica |
| `updated_at` | TIMESTAMP WITH TIME ZONE | 8 bytes | Fecha y hora de última actualización | DEFAULT NOW() | No aplica |

**Relaciones:**
- Referencia: `auth.users(id)` 
- Referenciada por: `orders.user_id`

**Restricciones Adicionales:**
- Row Level Security (RLS) habilitado
- Políticas de seguridad: Usuarios solo ven/editan su perfil, admins ven todos

---

## Tabla: `orders`

**Descripción:** Almacena información sobre los pedidos realizados por los clientes.
**Fecha de Creación:** 1 de abril de 2026
**Campo Clave:** `id` (UUID)

| Campo | Tipo de Datos | Tamaño | Descripción | Restricciones | Propagación |
|-------|---------------|--------|-------------|---------------|-------------|
| `id` | UUID | 36 bytes | Identificador único del pedido | PRIMARY KEY, NOT NULL | No aplica |
| `user_id` | UUID | 36 bytes | ID del usuario que realizó el pedido | NULL | CASCADE |
| `status` | TEXT | Variable | Estado actual del pedido | DEFAULT 'pending', CHECK IN ('pending','processing','shipped','delivered','cancelled') | No aplica |
| `total` | DECIMAL(10,2) | 10 dígitos (2 decimales) | Monto total del pedido | NOT NULL | No aplica |
| `shipping_address` | TEXT | Variable | Dirección de envío del pedido | NULL | No aplica |
| `created_at` | TIMESTAMP WITH TIME ZONE | 8 bytes | Fecha y hora de creación | DEFAULT NOW() | No aplica |
| `updated_at` | TIMESTAMP WITH TIME ZONE | 8 bytes | Fecha y hora de última actualización | DEFAULT NOW() | No aplica |

**Relaciones:**
- Referencia: `profiles(id)`
- Referenciada por: `order_items.order_id`

**Restricciones Adicionales:**
- Row Level Security (RLS) habilitado
- Políticas de seguridad: Usuarios solo ven sus pedidos, admins ven todos

---

## Tabla: `order_items`

**Descripción:** Almacena los productos individuales que componen cada pedido.
**Fecha de Creación:** 1 de abril de 2026
**Campo Clave:** `id` (UUID)

| Campo | Tipo de Datos | Tamaño | Descripción | Restricciones | Propagación |
|-------|---------------|--------|-------------|---------------|-------------|
| `id` | UUID | 36 bytes | Identificador único del item | PRIMARY KEY, NOT NULL | No aplica |
| `order_id` | UUID | 36 bytes | ID del pedido al que pertenece | NOT NULL | CASCADE |
| `product_id` | UUID | 36 bytes | ID del producto | NOT NULL | CASCADE |
| `quantity` | INTEGER | 4 bytes | Cantidad de unidades del producto | NOT NULL | No aplica |
| `price` | DECIMAL(10,2) | 10 dígitos (2 decimales) | Precio unitario al momento de la compra | NOT NULL | No aplica |
| `created_at` | TIMESTAMP WITH TIME ZONE | 8 bytes | Fecha y hora de creación | DEFAULT NOW() | No aplica |

**Relaciones:**
- Referencia: `orders(id)`
- Referencia: `products(id)`

**Restricciones Adicionales:**
- Row Level Security (RLS) habilitado
- Políticas de seguridad: Acceso a través de pedidos

---

## Funciones y Triggers

### Función: `get_user_role()`
- **Descripción:** Obtiene el rol del usuario autenticado
- **Tipo:** SQL
- **Seguridad:** SECURITY DEFINER
- **Retorno:** TEXT

### Función: `update_updated_at_column()`
- **Descripción:** Actualiza automáticamente el campo updated_at
- **Tipo:** PL/pgSQL
- **Uso:** Trigger para tablas con timestamps

### Función: `handle_new_user()`
- **Descripción:** Crea automáticamente un perfil cuando se registra un nuevo usuario
- **Tipo:** PL/pgSQL
- **Seguridad:** SECURITY DEFINER

---

## Triggers Implementados

| Trigger | Tabla | Evento | Función | Descripción |
|---------|-------|--------|---------|-------------|
| `update_products_updated_at` | products | BEFORE UPDATE | update_updated_at_column() | Actualiza updated_at |
| `update_profiles_updated_at` | profiles | BEFORE UPDATE | update_updated_at_column() | Actualiza updated_at |
| `update_orders_updated_at` | orders | BEFORE UPDATE | update_updated_at_column() | Actualiza updated_at |
| `on_auth_user_created` | auth.users | AFTER INSERT | handle_new_user() | Crea perfil automáticamente |

---

## Políticas de Seguridad (Row Level Security)

### Products
- **Lectura:** Pública (todos pueden ver)
- **Escritura:** Solo administradores

### Profiles
- **Lectura:** Usuario propio o administradores
- **Escritura:** Usuario propio

### Orders
- **Lectura:** Usuario propio o administradores
- **Escritura:** Usuarios pueden crear, admins pueden actualizar

### Order Items
- **Lectura:** A través de los pedidos del usuario o administradores

---

## Diagrama de Relaciones

```
auth.users (1) ──── (1) profiles (1) ──── (∗) orders (∗) ──── (1) order_items (∗) ──── (1) products
```

**Leyenda:**
- (1) = Uno
- (∗) = Muchos
- ──── = Relación

---

## Notas Adicionales

1. **Integridad Referencial:** Se utilizan restricciones FOREIGN KEY con propagación CASCADE para mantener la integridad de datos.
2. **Seguridad:** Todas las tablas tienen Row Level Security habilitado para controlar el acceso a datos.
3. **Timestamps:** Se manejan automáticamente mediante triggers.
4. **Autenticación:** Se integra con el sistema de autenticación de Supabase.
5. **Roles:** Sistema de roles basado en 'user' y 'admin' para control de permisos.
