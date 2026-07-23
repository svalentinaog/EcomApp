<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'unit_price',
        'subtotal',
    ];

    // =====================================================================
    // RELACIONES DEL DIAGRAMA
    // =====================================================================

    // 🔹 Relación Muchos a Uno (belongsTo): Muchos Ítems de Pedido pertenecen a una sola Orden.
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // 🔹 Relación Muchos a Uno (belongsTo): Muchos Ítems de Pedido hacen referencia a un solo Producto.
    public function product()
    {
        // Nota: Esta relación es vital para poder acceder a la foto y nombre 
        // del producto al renderizar el historial de compras del usuario.
        return $this->belongsTo(Product::class);
    }
}

// =====================================================================
// 🧠 NOTAS DE APRENDIZAJE: Modelo OrderItem y Tipos de Relación
// - Convención de Tablas: Omitimos "protected $table" porque Laravel 
//   traduce automáticamente el nombre "OrderItem" a "order_items" ("snake_case").
// - Encapsulamiento: "$fillable" siempre debe declararse como "protected" 
//   para mantener la seguridad en la asignación masiva de datos.
// - Tipos de Relaciones (Cardinalidad y Regla Física):
//   * "order()" -> Relación Muchos a Uno ("belongsTo"): Múltiples ítems 
//     forman parte de un único Pedido (Orden).
//   * "product()" -> Relación Muchos a Uno ("belongsTo"): Múltiples ítems 
//     históricos apuntan al mismo Producto del catálogo.
//   * Regla de Clave Foránea: Usamos "belongsTo" porque este modelo guarda 
//     FÍSICAMENTE las llaves foráneas ("order_id" y "product_id") en su tabla.
// - Buenas Prácticas (Historial de Compras): 
//   * Datos Inmutables: Guardar "unit_price" y "subtotal" aquí garantiza que 
//     el total pagado no cambie si el precio del producto se actualiza mañana.
//   * Datos Dinámicos: La relación "product()" permite consultar en tiempo 
//     real la imagen o nombre del producto para mostrar en el historial.
// =====================================================================