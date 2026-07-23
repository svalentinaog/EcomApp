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

    // =====================================================================
    // RELACIONES DEL DIAGRAMA
    // =====================================================================

    // 🔹 Relación Muchos a Uno (belongsTo): Muchos Ítems de Carrito pertenecen a un solo Usuario.
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // 🔹 Relación Muchos a Uno (belongsTo): Muchos Ítems de Carrito hacen referencia a un solo Producto.
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}

// =====================================================================
// 🧠 NOTAS DE APRENDIZAJE: Modelo CartItem y Tipos de Relación
// - Convención de Tablas: Omitimos "protected $table" porque Laravel 
//   traduce automáticamente el nombre "CartItem" a "cart_items" ("snake_case").
// - Encapsulamiento: "$fillable" siempre debe declararse como "protected" 
//   para mantener la seguridad en la asignación masiva de datos.
// - Tipos de Relaciones (Cardinalidad y Regla Física):
//   * "user()" -> Relación Muchos a Uno ("belongsTo"): Muchos ítems de 
//     carrito están asociados a un solo Usuario.
//   * "product()" -> Relación Muchos a Uno ("belongsTo"): Muchos ítems de 
//     carrito apuntan a un único Producto del catálogo.
//   * Regla de Clave Foránea: Usamos "belongsTo" en ambas relaciones porque 
//     este modelo es el que guarda FÍSICAMENTE las claves foráneas 
//     ("user_id" y "product_id") en su tabla.
// =====================================================================