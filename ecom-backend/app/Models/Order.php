<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'address_id',
        'status',
        'payment_method',
        'shipping_full_name',
        'shipping_phone',
        'shipping_address_line',
        'shipping_city',
        'shipping_state',
        'shipping_postal_code',
        'shipping_country',
        'subtotal',
        'shipping_cost',
        'total',
    ];

    // =====================================================================
    // RELACIONES DEL DIAGRAMA
    // =====================================================================

    // 🔹 Relación Muchos a Uno (belongsTo): Muchas Órdenes (Historiales de compras) pertenecen a un solo Usuario.
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // 🔹 Relación Muchos a Uno (belongsTo): Muchas Órdenes se asocian a una sola Dirección de origen.
    public function address()
    {
        return $this->belongsTo(Address::class);
    }

    // 🔹 Relación Uno a Muchos (hasMany): Una Orden tiene (contiene) muchos Ítems de Pedido.
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}

// =====================================================================
// 🧠 NOTAS DE APRENDIZAJE: Modelo Order y Relaciones Mixtas
// - Convención de Tablas: Omitimos "protected $table" porque Laravel 
//   traduce automáticamente el nombre "Order" a su plural en minúsculas ("orders").
// - Encapsulamiento de "$fillable": Se declara como "protected" (no "public") 
//   para mantener la seguridad en la asignación masiva de datos.
// - Tipos de Relaciones (Cardinalidad y Regla Física):
//   * "belongsTo": Se usa para "user" y "address" porque esta tabla ("orders") 
//     es la que guarda FÍSICAMENTE las llaves foráneas ("user_id", "address_id").
//   * "hasMany": Se usa para "orderItems" porque la orden es la "dueña" de los 
//     ítems, pero la llave foránea ("order_id") está guardada en la tabla destino.
// - Buenas Prácticas de E-commerce (Datos de Envío): Guardar campos como 
//   "shipping_address_line" en la orden es una excelente decisión arquitectónica. 
//   Si el usuario elimina o modifica su dirección en el futuro, el histórico 
//   de esta compra queda intacto e inmutable.
// =====================================================================