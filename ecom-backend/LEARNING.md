# 🧠 Notas Laravel

## 1. Conceptos Clave de Laravel y Backend
- **Eloquent ORM:** El ORM oficial de Laravel que mapea las tablas relacionales de la base de datos a clases y objetos en PHP, facilitando las operaciones CRUD y la gestión de relaciones.
- **HasFactory:** Trait que conecta los modelos con sus Model Factories para generar datos de prueba automatizados y seeders masivos.

## 2. Convenciones de Modelos y Seguridad
- **Nombres de Tablas:** Laravel asume por defecto el plural en minúsculas del nombre del modelo en inglés (ej. `Product` -> `products`). Se omite `$table` si se sigue esta regla.
- **Asignación Masiva (`$fillable`):** Debe declararse siempre como `protected` (nunca `public`) para proteger el modelo de asignaciones masivas no deseadas desde formularios o peticiones HTTP.

## 3. Tipos de Relaciones y Regla de Clave Foránea
- **`belongsTo` (Muchos a Uno):** Se usa en el modelo que guarda FÍSICAMENTE la clave foránea en su propia estructura de base de datos (ej. `user_id`, `product_id`). Sus métodos se nombran en **singular**.
- **`hasMany` (Uno a Muchos):** Se usa en el modelo padre o principal, cuya clave foránea reside físicamente en la tabla destino. Sus métodos se nombran en **plural**.
- **Inmutabilidad en Historiales:** Guardar campos estáticos (como precios de venta o direcciones de envío) en tablas transaccionales como `orders` y `order_items` garantiza que el historial de compras permanezca intacto aunque los datos originales del producto cambien en el futuro.

<!-- Comunicación Asíncrona (Webhooks) -->

<!-- Stripe Sandbox -->