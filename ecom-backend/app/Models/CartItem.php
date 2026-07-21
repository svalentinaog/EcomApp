<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_id',
        'quantity',
    ];

    // ==========================================
    // RELACIONES DEL DIAGRAMA
    // ==========================================

    // Relación: Muchos a Uno (Pertenece a un Usuario)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relación: Muchos a Uno (Pertenece a un Producto)
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}

// =====================================================================
// 🧠 NOTAS DE APRENDIZAJE: Modelo CartItem y Relaciones Múltiples
// - Convención de Nombres Plural (`snake_case`): Laravel infiere automáticamente
//   que `CartItem` corresponde a `cart_items`, omitiendo `$table = 'cart_items'`.
//
// - Encapsulamiento de `$fillable`: Se declara como `protected` para resguardar
//   la asignación masiva.
//
// - Múltiples `belongsTo`: `CartItem` guarda físicamente las claves `user_id`
//   y `product_id`, conectando a un usuario con el producto en su carrito.
// =====================================================================
